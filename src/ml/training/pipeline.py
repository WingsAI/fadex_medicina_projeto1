"""
FADEX Training Pipeline
Pipeline modular para treinamento de modelos de qualidade de imagens médicas
Suporte para MLflow, Weights & Biases, TensorBoard
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union, Any
from dataclasses import dataclass, asdict
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset, random_split
from torch.utils.tensorboard import SummaryWriter
import torchmetrics
from tqdm import tqdm
import yaml

# Optional imports for experiment tracking
try:
    import mlflow
    import mlflow.pytorch
    MLFLOW_AVAILABLE = True
except ImportError:
    MLFLOW_AVAILABLE = False

try:
    import wandb
    WANDB_AVAILABLE = True
except ImportError:
    WANDB_AVAILABLE = False

from ..models.quality_cnn import create_fadex_model, FadexQualityResNet, FadexEnsembleModel
from ..data.dataset import FadexImageDataset, get_data_loaders
from .losses import FadexQualityLoss, DimensionAwareLoss
from .metrics import FadexQualityMetrics


@dataclass
class TrainingConfig:
    """Configuração de treinamento estruturada"""
    
    # Model Configuration
    model_config: Dict[str, Any]
    
    # Training Hyperparameters
    batch_size: int = 32
    learning_rate: float = 1e-4
    num_epochs: int = 100
    weight_decay: float = 1e-5
    optimizer: str = 'adam'  # adam, adamw, sgd
    scheduler: str = 'cosine'  # cosine, step, plateau
    
    # Loss Configuration
    loss_type: str = 'fadex_quality'  # fadex_quality, dimension_aware, mse
    loss_weights: Dict[str, float] = None
    
    # Data Configuration
    train_split: float = 0.8
    val_split: float = 0.15
    test_split: float = 0.05
    num_workers: int = 4
    pin_memory: bool = True
    
    # Regularization
    dropout_rate: float = 0.3
    early_stopping_patience: int = 15
    grad_clip_norm: float = 1.0
    
    # Experiment Tracking
    experiment_name: str = "fadex_quality_training"
    experiment_tracker: str = "tensorboard"  # tensorboard, mlflow, wandb
    log_interval: int = 10
    save_interval: int = 5
    
    # Hardware
    device: str = "auto"  # auto, cuda, cpu
    mixed_precision: bool = True
    
    # Paths
    data_dir: str = "./data"
    output_dir: str = "./outputs"
    checkpoint_dir: str = "./checkpoints"
    
    def __post_init__(self):
        """Pós-processamento da configuração"""
        if self.loss_weights is None:
            self.loss_weights = {
                'global_score': 0.5,
                'dimension_scores': 0.4,
                'consistency': 0.1
            }


class FadexTrainer:
    """
    Trainer principal para modelos FADEX
    Suporte para múltiplos backends de experiment tracking
    """
    
    def __init__(self, config: TrainingConfig):
        self.config = config
        self.setup_logging()
        self.setup_device()
        self.setup_directories()
        self.setup_experiment_tracking()
        
        # Training state
        self.epoch = 0
        self.global_step = 0
        self.best_val_score = 0.0
        self.patience_counter = 0
        
        # Model and training components (will be initialized later)
        self.model = None
        self.optimizer = None
        self.scheduler = None
        self.criterion = None
        self.metrics = None
        self.train_loader = None
        self.val_loader = None
        self.test_loader = None
        
    def setup_logging(self):
        """Configura logging"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(f'training_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def setup_device(self):
        """Configura device para treinamento"""
        if self.config.device == "auto":
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = torch.device(self.config.device)
        
        self.logger.info(f"Using device: {self.device}")
        
        if self.device.type == "cuda":
            self.logger.info(f"GPU: {torch.cuda.get_device_name()}")
            self.logger.info(f"Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    
    def setup_directories(self):
        """Cria diretórios necessários"""
        for dir_path in [self.config.output_dir, self.config.checkpoint_dir]:
            Path(dir_path).mkdir(parents=True, exist_ok=True)
    
    def setup_experiment_tracking(self):
        """Configura experiment tracking"""
        self.experiment_tracker = None
        
        if self.config.experiment_tracker == "mlflow" and MLFLOW_AVAILABLE:
            mlflow.set_experiment(self.config.experiment_name)
            mlflow.start_run()
            mlflow.log_params(asdict(self.config))
            self.experiment_tracker = "mlflow"
            
        elif self.config.experiment_tracker == "wandb" and WANDB_AVAILABLE:
            wandb.init(
                project=self.config.experiment_name,
                config=asdict(self.config)
            )
            self.experiment_tracker = "wandb"
            
        elif self.config.experiment_tracker == "tensorboard":
            log_dir = Path(self.config.output_dir) / "tensorboard" / datetime.now().strftime("%Y%m%d_%H%M%S")
            self.writer = SummaryWriter(log_dir)
            self.experiment_tracker = "tensorboard"
            
        self.logger.info(f"Experiment tracking: {self.experiment_tracker}")
    
    def prepare_model(self) -> nn.Module:
        """Prepara modelo para treinamento"""
        self.model = create_fadex_model(self.config.model_config)
        self.model.to(self.device)
        
        # Log model info
        total_params = sum(p.numel() for p in self.model.parameters())
        trainable_params = sum(p.numel() for p in self.model.parameters() if p.requires_grad)
        
        self.logger.info(f"Model: {self.model.__class__.__name__}")
        self.logger.info(f"Total parameters: {total_params:,}")
        self.logger.info(f"Trainable parameters: {trainable_params:,}")
        
        return self.model
    
    def prepare_data(self) -> Tuple[DataLoader, DataLoader, DataLoader]:
        """Prepara data loaders"""
        self.train_loader, self.val_loader, self.test_loader = get_data_loaders(
            data_dir=self.config.data_dir,
            batch_size=self.config.batch_size,
            train_split=self.config.train_split,
            val_split=self.config.val_split,
            test_split=self.config.test_split,
            num_workers=self.config.num_workers,
            pin_memory=self.config.pin_memory
        )
        
        self.logger.info(f"Train samples: {len(self.train_loader.dataset)}")
        self.logger.info(f"Val samples: {len(self.val_loader.dataset)}")
        self.logger.info(f"Test samples: {len(self.test_loader.dataset)}")
        
        return self.train_loader, self.val_loader, self.test_loader
    
    def prepare_optimizer(self) -> optim.Optimizer:
        """Prepara optimizer"""
        if self.config.optimizer.lower() == 'adam':
            self.optimizer = optim.Adam(
                self.model.parameters(),
                lr=self.config.learning_rate,
                weight_decay=self.config.weight_decay
            )
        elif self.config.optimizer.lower() == 'adamw':
            self.optimizer = optim.AdamW(
                self.model.parameters(),
                lr=self.config.learning_rate,
                weight_decay=self.config.weight_decay
            )
        elif self.config.optimizer.lower() == 'sgd':
            self.optimizer = optim.SGD(
                self.model.parameters(),
                lr=self.config.learning_rate,
                momentum=0.9,
                weight_decay=self.config.weight_decay
            )
        else:
            raise ValueError(f"Optimizer {self.config.optimizer} não suportado")
        
        self.logger.info(f"Optimizer: {self.optimizer.__class__.__name__}")
        return self.optimizer
    
    def prepare_scheduler(self) -> Optional[optim.lr_scheduler._LRScheduler]:
        """Prepara learning rate scheduler"""
        if self.config.scheduler.lower() == 'cosine':
            self.scheduler = optim.lr_scheduler.CosineAnnealingLR(
                self.optimizer,
                T_max=self.config.num_epochs
            )
        elif self.config.scheduler.lower() == 'step':
            self.scheduler = optim.lr_scheduler.StepLR(
                self.optimizer,
                step_size=self.config.num_epochs // 3,
                gamma=0.1
            )
        elif self.config.scheduler.lower() == 'plateau':
            self.scheduler = optim.lr_scheduler.ReduceLROnPlateau(
                self.optimizer,
                mode='max',
                patience=5,
                factor=0.5
            )
        else:
            self.scheduler = None
        
        if self.scheduler:
            self.logger.info(f"Scheduler: {self.scheduler.__class__.__name__}")
        
        return self.scheduler
    
    def prepare_criterion(self) -> nn.Module:
        """Prepara loss function"""
        if self.config.loss_type == 'fadex_quality':
            self.criterion = FadexQualityLoss(
                weights=self.config.loss_weights,
                device=self.device
            )
        elif self.config.loss_type == 'dimension_aware':
            self.criterion = DimensionAwareLoss(
                weights=self.config.loss_weights,
                device=self.device
            )
        elif self.config.loss_type == 'mse':
            self.criterion = nn.MSELoss()
        else:
            raise ValueError(f"Loss type {self.config.loss_type} não suportado")
        
        self.logger.info(f"Loss function: {self.criterion.__class__.__name__}")
        return self.criterion
    
    def prepare_metrics(self) -> FadexQualityMetrics:
        """Prepara métricas de avaliação"""
        self.metrics = FadexQualityMetrics(device=self.device)
        return self.metrics
    
    def setup_training(self):
        """Setup completo para treinamento"""
        self.prepare_model()
        self.prepare_data()
        self.prepare_optimizer()
        self.prepare_scheduler()
        self.prepare_criterion()
        self.prepare_metrics()
        
        # Mixed precision training
        if self.config.mixed_precision and self.device.type == "cuda":
            self.scaler = torch.cuda.amp.GradScaler()
            self.logger.info("Mixed precision training enabled")
        else:
            self.scaler = None
    
    def train_epoch(self) -> Dict[str, float]:
        """Treina uma época"""
        self.model.train()
        epoch_metrics = {'loss': 0.0}
        
        progress_bar = tqdm(
            self.train_loader, 
            desc=f"Epoch {self.epoch+1}/{self.config.num_epochs}"
        )
        
        for batch_idx, batch in enumerate(progress_bar):
            images = batch['image'].to(self.device)
            targets = batch['targets'].to(self.device)
            
            # Forward pass
            if self.scaler is not None:
                with torch.cuda.amp.autocast():
                    outputs = self.model(images)
                    loss = self.criterion(outputs, targets)
            else:
                outputs = self.model(images)
                loss = self.criterion(outputs, targets)
            
            # Backward pass
            self.optimizer.zero_grad()
            
            if self.scaler is not None:
                self.scaler.scale(loss).backward()
                self.scaler.unscale_(self.optimizer)
                torch.nn.utils.clip_grad_norm_(
                    self.model.parameters(), 
                    self.config.grad_clip_norm
                )
                self.scaler.step(self.optimizer)
                self.scaler.update()
            else:
                loss.backward()
                torch.nn.utils.clip_grad_norm_(
                    self.model.parameters(), 
                    self.config.grad_clip_norm
                )
                self.optimizer.step()
            
            # Update metrics
            epoch_metrics['loss'] += loss.item()
            
            # Log batch metrics
            if batch_idx % self.config.log_interval == 0:
                self.log_metrics({
                    'batch_loss': loss.item(),
                    'learning_rate': self.optimizer.param_groups[0]['lr']
                }, step=self.global_step)
            
            self.global_step += 1
            
            # Update progress bar
            progress_bar.set_postfix({
                'loss': f"{loss.item():.4f}",
                'lr': f"{self.optimizer.param_groups[0]['lr']:.2e}"
            })
        
        # Average metrics
        epoch_metrics['loss'] /= len(self.train_loader)
        
        return epoch_metrics
    
    def validate_epoch(self) -> Dict[str, float]:
        """Valida uma época"""
        self.model.eval()
        val_metrics = {}
        
        with torch.no_grad():
            for batch in tqdm(self.val_loader, desc="Validation"):
                images = batch['image'].to(self.device)
                targets = batch['targets'].to(self.device)
                
                outputs = self.model(images)
                loss = self.criterion(outputs, targets)
                
                # Update metrics
                self.metrics.update(outputs, targets)
        
        # Compute final metrics
        val_metrics = self.metrics.compute()
        val_metrics['val_loss'] = loss.item()  # Simplified for example
        
        # Reset metrics for next epoch
        self.metrics.reset()
        
        return val_metrics
    
    def save_checkpoint(self, metrics: Dict[str, float], is_best: bool = False):
        """Salva checkpoint do modelo"""
        checkpoint = {
            'epoch': self.epoch,
            'global_step': self.global_step,
            'model_state_dict': self.model.state_dict(),
            'optimizer_state_dict': self.optimizer.state_dict(),
            'scheduler_state_dict': self.scheduler.state_dict() if self.scheduler else None,
            'metrics': metrics,
            'config': asdict(self.config),
            'best_val_score': self.best_val_score
        }
        
        # Save regular checkpoint
        checkpoint_path = Path(self.config.checkpoint_dir) / f"checkpoint_epoch_{self.epoch}.pt"
        torch.save(checkpoint, checkpoint_path)
        
        # Save best model
        if is_best:
            best_path = Path(self.config.checkpoint_dir) / "best_model.pt"
            torch.save(checkpoint, best_path)
            self.logger.info(f"New best model saved with score: {self.best_val_score:.4f}")
    
    def log_metrics(self, metrics: Dict[str, float], step: Optional[int] = None):
        """Log metrics para experiment tracker"""
        if step is None:
            step = self.global_step
        
        if self.experiment_tracker == "mlflow":
            for key, value in metrics.items():
                mlflow.log_metric(key, value, step=step)
                
        elif self.experiment_tracker == "wandb":
            wandb.log(metrics, step=step)
            
        elif self.experiment_tracker == "tensorboard":
            for key, value in metrics.items():
                self.writer.add_scalar(key, value, step)
    
    def train(self):
        """Loop principal de treinamento"""
        self.setup_training()
        
        self.logger.info("Starting training...")
        self.logger.info(f"Total epochs: {self.config.num_epochs}")
        self.logger.info(f"Device: {self.device}")
        
        for epoch in range(self.config.num_epochs):
            self.epoch = epoch
            
            # Train epoch
            train_metrics = self.train_epoch()
            
            # Validate epoch
            val_metrics = self.validate_epoch()
            
            # Update scheduler
            if self.scheduler:
                if isinstance(self.scheduler, optim.lr_scheduler.ReduceLROnPlateau):
                    self.scheduler.step(val_metrics.get('val_score', 0))
                else:
                    self.scheduler.step()
            
            # Combine metrics
            all_metrics = {**train_metrics, **val_metrics}
            
            # Log epoch metrics
            self.log_metrics(all_metrics, step=epoch)
            
            # Check for best model
            current_val_score = val_metrics.get('val_score', 0)
            is_best = current_val_score > self.best_val_score
            
            if is_best:
                self.best_val_score = current_val_score
                self.patience_counter = 0
            else:
                self.patience_counter += 1
            
            # Save checkpoint
            if epoch % self.config.save_interval == 0 or is_best:
                self.save_checkpoint(all_metrics, is_best)
            
            # Early stopping
            if self.patience_counter >= self.config.early_stopping_patience:
                self.logger.info(f"Early stopping triggered after {epoch + 1} epochs")
                break
            
            # Log epoch summary
            self.logger.info(
                f"Epoch {epoch+1}/{self.config.num_epochs} - "
                f"Train Loss: {train_metrics['loss']:.4f} - "
                f"Val Score: {current_val_score:.4f} - "
                f"Best: {self.best_val_score:.4f}"
            )
        
        self.logger.info("Training completed!")
        self.logger.info(f"Best validation score: {self.best_val_score:.4f}")
        
        # Final cleanup
        if self.experiment_tracker == "mlflow":
            mlflow.end_run()
        elif self.experiment_tracker == "wandb":
            wandb.finish()
        elif self.experiment_tracker == "tensorboard":
            self.writer.close()


def load_config(config_path: str) -> TrainingConfig:
    """Carrega configuração de arquivo YAML"""
    with open(config_path, 'r') as f:
        config_dict = yaml.safe_load(f)
    return TrainingConfig(**config_dict)


def save_config(config: TrainingConfig, save_path: str):
    """Salva configuração em arquivo YAML"""
    with open(save_path, 'w') as f:
        yaml.dump(asdict(config), f, default_flow_style=False)


if __name__ == "__main__":
    # Exemplo de uso
    config = TrainingConfig(
        model_config={
            'type': 'single',
            'params': {
                'backbone': 'resnet50',
                'num_quality_dimensions': 6,
                'dropout_rate': 0.3
            }
        },
        batch_size=16,
        learning_rate=1e-4,
        num_epochs=50,
        experiment_name="fadex_quality_test"
    )
    
    trainer = FadexTrainer(config)
    trainer.train()