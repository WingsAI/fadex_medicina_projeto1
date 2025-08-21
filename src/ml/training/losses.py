"""
FADEX Custom Loss Functions
Loss functions proprietárias otimizadas para quality assessment de imagens médicas
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from typing import Dict, List, Optional, Union


class FadexQualityLoss(nn.Module):
    """
    Loss function proprietária FADEX para quality assessment
    Combina múltiplos objetivos específicos para imagens médicas
    PROPRIEDADE INTELECTUAL
    """
    
    def __init__(
        self,
        weights: Dict[str, float] = None,
        device: torch.device = None,
        smoothing_factor: float = 0.1
    ):
        super(FadexQualityLoss, self).__init__()
        
        self.device = device or torch.device('cpu')
        self.smoothing_factor = smoothing_factor
        
        # Pesos padrão para componentes da loss
        self.weights = weights or {
            'global_score': 0.4,      # Score global principal
            'dimension_scores': 0.35,  # Scores por dimensão
            'consistency': 0.15,       # Consistência entre dimensões
            'confidence': 0.1          # Confidence accuracy
        }
        
        # Loss functions auxiliares
        self.mse_loss = nn.MSELoss()
        self.smooth_l1_loss = nn.SmoothL1Loss()
        self.bce_loss = nn.BCEWithLogitsLoss()
        
    def forward(
        self, 
        predictions: Dict[str, torch.Tensor], 
        targets: Dict[str, torch.Tensor]
    ) -> Dict[str, torch.Tensor]:
        """
        Calcula loss total e componentes
        
        Args:
            predictions: Dict com outputs do modelo
            targets: Dict com ground truth labels
            
        Returns:
            Dict com loss total e componentes individuais
        """
        losses = {}
        
        # 1. Global Score Loss (MSE suavizado)
        global_pred = predictions['global_score'] / 100.0  # Normaliza para 0-1
        global_target = targets['global_score'] / 100.0
        
        global_loss = self.smooth_l1_loss(global_pred, global_target)
        losses['global_loss'] = global_loss
        
        # 2. Dimension Scores Loss
        dimension_loss = self._calculate_dimension_loss(predictions, targets)
        losses['dimension_loss'] = dimension_loss
        
        # 3. Consistency Loss (propriedade FADEX)
        consistency_loss = self._calculate_consistency_loss(predictions, targets)
        losses['consistency_loss'] = consistency_loss
        
        # 4. Confidence Loss
        if 'confidence' in predictions and 'confidence' in targets:
            conf_pred = predictions['confidence'] / 100.0
            conf_target = targets['confidence'] / 100.0
            confidence_loss = self.mse_loss(conf_pred, conf_target)
            losses['confidence_loss'] = confidence_loss
        else:
            losses['confidence_loss'] = torch.tensor(0.0, device=self.device)
        
        # 5. Total Loss (combinação ponderada)
        total_loss = (
            self.weights['global_score'] * losses['global_loss'] +
            self.weights['dimension_scores'] * losses['dimension_loss'] +
            self.weights['consistency'] * losses['consistency_loss'] +
            self.weights['confidence'] * losses['confidence_loss']
        )
        
        losses['total_loss'] = total_loss
        
        return losses
    
    def _calculate_dimension_loss(
        self, 
        predictions: Dict[str, torch.Tensor], 
        targets: Dict[str, torch.Tensor]
    ) -> torch.Tensor:
        """
        Loss para scores dimensionais individuais
        Propriedade intelectual FADEX
        """
        dimension_losses = []
        
        pred_dimensions = predictions.get('dimension_scores', {})
        target_dimensions = targets.get('dimension_scores', {})
        
        for dim_name in pred_dimensions.keys():
            if dim_name in target_dimensions:
                pred_score = pred_dimensions[dim_name] / 100.0
                target_score = target_dimensions[dim_name] / 100.0
                
                # Loss adaptativa baseada na importância da dimensão
                if dim_name in ['sharpness', 'clinical_adequacy']:
                    # Dimensões críticas têm penalidade maior
                    dim_loss = self.smooth_l1_loss(pred_score, target_score) * 1.5
                else:
                    dim_loss = self.smooth_l1_loss(pred_score, target_score)
                
                dimension_losses.append(dim_loss)
        
        if dimension_losses:
            return torch.stack(dimension_losses).mean()
        else:
            return torch.tensor(0.0, device=self.device)
    
    def _calculate_consistency_loss(
        self, 
        predictions: Dict[str, torch.Tensor], 
        targets: Dict[str, torch.Tensor]
    ) -> torch.Tensor:
        """
        Loss de consistência entre global score e dimension scores
        ALGORITMO PROPRIETÁRIO FADEX
        """
        pred_global = predictions.get('global_score', torch.tensor(0.0))
        pred_dimensions = predictions.get('dimension_scores', {})
        
        if not pred_dimensions:
            return torch.tensor(0.0, device=self.device)
        
        # Calcula média das dimensões
        dim_values = list(pred_dimensions.values())
        if dim_values:
            pred_dim_mean = torch.stack(dim_values).mean()
            
            # Loss de consistência: global score deve ser consistente com média das dimensões
            consistency_diff = torch.abs(pred_global - pred_dim_mean) / 100.0
            
            # Penalidade não-linear para grandes inconsistências
            consistency_loss = consistency_diff ** 2
            
            return consistency_loss.mean()
        
        return torch.tensor(0.0, device=self.device)


class DimensionAwareLoss(nn.Module):
    """
    Loss function que considera a importância relativa de cada dimensão
    para diferentes tipos de exames oftalmológicos
    """
    
    def __init__(
        self,
        exam_type: str = 'fundoscopy',
        weights: Dict[str, float] = None,
        device: torch.device = None
    ):
        super(DimensionAwareLoss, self).__init__()
        
        self.exam_type = exam_type
        self.device = device or torch.device('cpu')
        
        # Pesos específicos por tipo de exame
        self.exam_weights = {
            'fundoscopy': {
                'sharpness': 0.25,
                'exposure': 0.20,
                'contrast': 0.15,
                'noise_level': 0.15,
                'artifacts': 0.15,
                'clinical_adequacy': 0.10
            },
            'oct': {
                'sharpness': 0.30,
                'exposure': 0.15,
                'contrast': 0.20,
                'noise_level': 0.20,
                'artifacts': 0.10,
                'clinical_adequacy': 0.05
            },
            'angiography': {
                'sharpness': 0.20,
                'exposure': 0.25,
                'contrast': 0.25,
                'noise_level': 0.15,
                'artifacts': 0.10,
                'clinical_adequacy': 0.05
            }
        }
        
        self.dimension_weights = self.exam_weights.get(
            exam_type, self.exam_weights['fundoscopy']
        )
        
        # Loss base
        self.mse_loss = nn.MSELoss(reduction='none')
        
    def forward(
        self, 
        predictions: Dict[str, torch.Tensor], 
        targets: Dict[str, torch.Tensor]
    ) -> torch.Tensor:
        """
        Calcula loss ponderada por importância dimensional
        """
        total_loss = torch.tensor(0.0, device=self.device)
        
        pred_dimensions = predictions.get('dimension_scores', {})
        target_dimensions = targets.get('dimension_scores', {})
        
        for dim_name, weight in self.dimension_weights.items():
            if dim_name in pred_dimensions and dim_name in target_dimensions:
                pred_score = pred_dimensions[dim_name] / 100.0
                target_score = target_dimensions[dim_name] / 100.0
                
                # Loss MSE ponderada
                dim_loss = self.mse_loss(pred_score, target_score)
                weighted_loss = weight * dim_loss.mean()
                
                total_loss += weighted_loss
        
        return total_loss


class RobustQualityLoss(nn.Module):
    """
    Loss function robusta para lidar com outliers e anotações ruidosas
    Importante para dados médicos onde anotações podem ter variabilidade
    """
    
    def __init__(
        self,
        alpha: float = 0.5,  # Parâmetro para Huber loss
        weights: Dict[str, float] = None,
        device: torch.device = None
    ):
        super(RobustQualityLoss, self).__init__()
        
        self.alpha = alpha
        self.device = device or torch.device('cpu')
        self.weights = weights or {'global': 0.6, 'dimensions': 0.4}
        
        # Huber loss para robustez
        self.huber_loss = nn.HuberLoss(delta=alpha)
        
    def forward(
        self, 
        predictions: Dict[str, torch.Tensor], 
        targets: Dict[str, torch.Tensor]
    ) -> torch.Tensor:
        """
        Loss robusta usando Huber loss
        """
        losses = []
        
        # Global score loss
        if 'global_score' in predictions and 'global_score' in targets:
            global_pred = predictions['global_score'] / 100.0
            global_target = targets['global_score'] / 100.0
            global_loss = self.huber_loss(global_pred, global_target)
            losses.append(self.weights['global'] * global_loss)
        
        # Dimension scores loss
        pred_dimensions = predictions.get('dimension_scores', {})
        target_dimensions = targets.get('dimension_scores', {})
        
        dim_losses = []
        for dim_name in pred_dimensions.keys():
            if dim_name in target_dimensions:
                pred_score = pred_dimensions[dim_name] / 100.0
                target_score = target_dimensions[dim_name] / 100.0
                dim_loss = self.huber_loss(pred_score, target_score)
                dim_losses.append(dim_loss)
        
        if dim_losses:
            avg_dim_loss = torch.stack(dim_losses).mean()
            losses.append(self.weights['dimensions'] * avg_dim_loss)
        
        return sum(losses) if losses else torch.tensor(0.0, device=self.device)


class ConfidenceAwareLoss(nn.Module):
    """
    Loss function que incorpora confidence scores
    Dá menos peso a predições com baixa confidence
    """
    
    def __init__(
        self,
        confidence_threshold: float = 0.5,
        device: torch.device = None
    ):
        super(ConfidenceAwareLoss, self).__init__()
        
        self.confidence_threshold = confidence_threshold
        self.device = device or torch.device('cpu')
        self.mse_loss = nn.MSELoss(reduction='none')
        
    def forward(
        self, 
        predictions: Dict[str, torch.Tensor], 
        targets: Dict[str, torch.Tensor]
    ) -> torch.Tensor:
        """
        Loss ponderada por confidence
        """
        # Extrai confidence (assumindo que está normalizada 0-1)
        confidence = predictions.get('confidence', torch.ones(1, device=self.device)) / 100.0
        
        # Global score loss
        global_pred = predictions['global_score'] / 100.0
        global_target = targets['global_score'] / 100.0
        
        # Loss base
        base_loss = self.mse_loss(global_pred, global_target)
        
        # Pondera pela confidence
        # Confidence alta = peso alto, confidence baixa = peso baixo
        confidence_weights = torch.clamp(confidence, min=0.1, max=1.0)
        weighted_loss = base_loss * confidence_weights
        
        return weighted_loss.mean()


class MultiTaskQualityLoss(nn.Module):
    """
    Loss function para treinamento multi-task
    Combina quality assessment com outras tarefas auxiliares
    """
    
    def __init__(
        self,
        task_weights: Dict[str, float] = None,
        device: torch.device = None
    ):
        super(MultiTaskQualityLoss, self).__init__()
        
        self.device = device or torch.device('cpu')
        self.task_weights = task_weights or {
            'quality': 0.7,      # Tarefa principal
            'classification': 0.2,  # Classificação auxiliar (ex: tipo de patologia)
            'segmentation': 0.1   # Segmentação auxiliar (ex: estruturas anatômicas)
        }
        
        # Loss functions para cada tarefa
        self.quality_loss = FadexQualityLoss(device=device)
        self.classification_loss = nn.CrossEntropyLoss()
        self.segmentation_loss = nn.BCEWithLogitsLoss()
        
    def forward(
        self, 
        predictions: Dict[str, torch.Tensor], 
        targets: Dict[str, torch.Tensor]
    ) -> Dict[str, torch.Tensor]:
        """
        Multi-task loss computation
        """
        losses = {}
        total_loss = torch.tensor(0.0, device=self.device)
        
        # Quality assessment loss
        if 'global_score' in predictions:
            quality_loss_dict = self.quality_loss(predictions, targets)
            quality_loss = quality_loss_dict['total_loss']
            losses['quality'] = quality_loss
            total_loss += self.task_weights['quality'] * quality_loss
        
        # Classification loss (se disponível)
        if 'classification' in predictions and 'classification' in targets:
            class_loss = self.classification_loss(
                predictions['classification'], 
                targets['classification']
            )
            losses['classification'] = class_loss
            total_loss += self.task_weights['classification'] * class_loss
        
        # Segmentation loss (se disponível)
        if 'segmentation' in predictions and 'segmentation' in targets:
            seg_loss = self.segmentation_loss(
                predictions['segmentation'], 
                targets['segmentation']
            )
            losses['segmentation'] = seg_loss
            total_loss += self.task_weights['segmentation'] * seg_loss
        
        losses['total'] = total_loss
        return losses


def create_loss_function(loss_config: Dict) -> nn.Module:
    """
    Factory function para criar loss functions FADEX
    
    Args:
        loss_config: Configuração da loss function
        
    Returns:
        Loss function inicializada
    """
    loss_type = loss_config.get('type', 'fadex_quality')
    
    if loss_type == 'fadex_quality':
        return FadexQualityLoss(**loss_config.get('params', {}))
    elif loss_type == 'dimension_aware':
        return DimensionAwareLoss(**loss_config.get('params', {}))
    elif loss_type == 'robust':
        return RobustQualityLoss(**loss_config.get('params', {}))
    elif loss_type == 'confidence_aware':
        return ConfidenceAwareLoss(**loss_config.get('params', {}))
    elif loss_type == 'multi_task':
        return MultiTaskQualityLoss(**loss_config.get('params', {}))
    else:
        raise ValueError(f"Loss type {loss_type} não suportado")


# Configurações de loss pré-definidas
LOSS_CONFIGS = {
    'fadex_standard': {
        'type': 'fadex_quality',
        'params': {
            'weights': {
                'global_score': 0.4,
                'dimension_scores': 0.35,
                'consistency': 0.15,
                'confidence': 0.1
            }
        }
    },
    
    'fundoscopy_optimized': {
        'type': 'dimension_aware',
        'params': {
            'exam_type': 'fundoscopy',
            'weights': {
                'sharpness': 0.25,
                'exposure': 0.20,
                'contrast': 0.15,
                'noise_level': 0.15,
                'artifacts': 0.15,
                'clinical_adequacy': 0.10
            }
        }
    },
    
    'robust_training': {
        'type': 'robust',
        'params': {
            'alpha': 0.5,
            'weights': {'global': 0.6, 'dimensions': 0.4}
        }
    },
    
    'multi_task_research': {
        'type': 'multi_task',
        'params': {
            'task_weights': {
                'quality': 0.7,
                'classification': 0.2,
                'segmentation': 0.1
            }
        }
    }
}


if __name__ == "__main__":
    # Teste das loss functions
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Dados dummy para teste
    batch_size = 4
    
    predictions = {
        'global_score': torch.rand(batch_size, 1) * 100,
        'dimension_scores': {
            'sharpness': torch.rand(batch_size, 1) * 100,
            'exposure': torch.rand(batch_size, 1) * 100,
            'contrast': torch.rand(batch_size, 1) * 100,
            'noise_level': torch.rand(batch_size, 1) * 100,
            'artifacts': torch.rand(batch_size, 1) * 100,
            'clinical_adequacy': torch.rand(batch_size, 1) * 100
        },
        'confidence': torch.rand(batch_size, 1) * 100
    }
    
    targets = {
        'global_score': torch.rand(batch_size, 1) * 100,
        'dimension_scores': {
            'sharpness': torch.rand(batch_size, 1) * 100,
            'exposure': torch.rand(batch_size, 1) * 100,
            'contrast': torch.rand(batch_size, 1) * 100,
            'noise_level': torch.rand(batch_size, 1) * 100,
            'artifacts': torch.rand(batch_size, 1) * 100,
            'clinical_adequacy': torch.rand(batch_size, 1) * 100
        },
        'confidence': torch.rand(batch_size, 1) * 100
    }
    
    # Teste FADEX Quality Loss
    fadex_loss = FadexQualityLoss(device=device)
    losses = fadex_loss(predictions, targets)
    
    print("FADEX Quality Loss Results:")
    for loss_name, loss_value in losses.items():
        print(f"  {loss_name}: {loss_value.item():.4f}")
    
    # Teste Dimension Aware Loss
    dim_loss = DimensionAwareLoss(exam_type='fundoscopy', device=device)
    dim_loss_value = dim_loss(predictions, targets)
    
    print(f"\nDimension Aware Loss: {dim_loss_value.item():.4f}")
    
    # Teste Robust Loss
    robust_loss = RobustQualityLoss(device=device)
    robust_loss_value = robust_loss(predictions, targets)
    
    print(f"Robust Loss: {robust_loss_value.item():.4f}")
    
    print("\nTodos os testes de loss functions executados com sucesso!")