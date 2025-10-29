"""
SNPQIM Quality Metrics
Métricas especializadas para avaliação de modelos de quality assessment
"""

import torch
import torch.nn as nn
import numpy as np
from typing import Dict, List, Optional, Tuple, Union
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from scipy.stats import pearsonr, spearmanr
import torchmetrics


class FadexQualityMetrics:
    """
    Conjunto completo de métricas para avaliação de quality assessment
    Específico para imagens médicas oftalmológicas
    """
    
    def __init__(self, device: torch.device = None):
        self.device = device or torch.device('cpu')
        self.reset()
        
        # Threshold para diferentes categorias de qualidade
        self.quality_thresholds = {
            'excellent': 85,
            'good': 70,
            'fair': 50,
            'poor': 0
        }
        
    def reset(self):
        """Reset de todas as métricas acumuladas"""
        self.predictions = {
            'global_scores': [],
            'dimension_scores': {
                'sharpness': [],
                'exposure': [],
                'contrast': [],
                'noise_level': [],
                'artifacts': [],
                'clinical_adequacy': []
            },
            'confidences': []
        }
        
        self.targets = {
            'global_scores': [],
            'dimension_scores': {
                'sharpness': [],
                'exposure': [],
                'contrast': [],
                'noise_level': [],
                'artifacts': [],
                'clinical_adequacy': []
            },
            'confidences': []
        }
    
    def update(
        self, 
        predictions: Dict[str, torch.Tensor], 
        targets: Dict[str, torch.Tensor]
    ):
        """
        Atualiza métricas com novo batch de predições
        
        Args:
            predictions: Predições do modelo
            targets: Ground truth labels
        """
        # Global scores
        if 'global_score' in predictions and 'global_score' in targets:
            pred_global = predictions['global_score'].detach().cpu().numpy().flatten()
            target_global = targets['global_score'].detach().cpu().numpy().flatten()
            
            self.predictions['global_scores'].extend(pred_global)
            self.targets['global_scores'].extend(target_global)
        
        # Dimension scores
        pred_dimensions = predictions.get('dimension_scores', {})
        target_dimensions = targets.get('dimension_scores', {})
        
        for dim_name in pred_dimensions.keys():
            if dim_name in target_dimensions:
                pred_dim = pred_dimensions[dim_name].detach().cpu().numpy().flatten()
                target_dim = target_dimensions[dim_name].detach().cpu().numpy().flatten()
                
                if dim_name in self.predictions['dimension_scores']:
                    self.predictions['dimension_scores'][dim_name].extend(pred_dim)
                    self.targets['dimension_scores'][dim_name].extend(target_dim)
        
        # Confidence scores
        if 'confidence' in predictions and 'confidence' in targets:
            pred_conf = predictions['confidence'].detach().cpu().numpy().flatten()
            target_conf = targets['confidence'].detach().cpu().numpy().flatten()
            
            self.predictions['confidences'].extend(pred_conf)
            self.targets['confidences'].extend(target_conf)
    
    def compute(self) -> Dict[str, float]:
        """
        Computa todas as métricas acumuladas
        
        Returns:
            Dict com todas as métricas calculadas
        """
        metrics = {}
        
        # Global Score Metrics
        if self.predictions['global_scores']:
            global_metrics = self._compute_regression_metrics(
                self.predictions['global_scores'],
                self.targets['global_scores'],
                prefix='global'
            )
            metrics.update(global_metrics)
            
            # Classification metrics por categoria de qualidade
            global_class_metrics = self._compute_classification_metrics(
                self.predictions['global_scores'],
                self.targets['global_scores']
            )
            metrics.update(global_class_metrics)
        
        # Dimension Score Metrics
        for dim_name, pred_scores in self.predictions['dimension_scores'].items():
            if pred_scores and dim_name in self.targets['dimension_scores']:
                target_scores = self.targets['dimension_scores'][dim_name]
                
                dim_metrics = self._compute_regression_metrics(
                    pred_scores, target_scores, prefix=f'dim_{dim_name}'
                )
                metrics.update(dim_metrics)
        
        # Confidence Metrics
        if self.predictions['confidences']:
            conf_metrics = self._compute_regression_metrics(
                self.predictions['confidences'],
                self.targets['confidences'],
                prefix='confidence'
            )
            metrics.update(conf_metrics)
        
        # Clinical Adequacy Metrics (específicas para medicina)
        clinical_metrics = self._compute_clinical_metrics()
        metrics.update(clinical_metrics)
        
        # Overall Score (métrica proprietária SNPQIM)
        if self.predictions['global_scores']:
            overall_score = self._compute_fadex_overall_score(metrics)
            metrics['fadex_overall_score'] = overall_score
        
        return metrics
    
    def _compute_regression_metrics(
        self, 
        predictions: List[float], 
        targets: List[float],
        prefix: str = ''
    ) -> Dict[str, float]:
        """
        Computa métricas de regressão padrão
        """
        if not predictions or not targets:
            return {}
        
        pred_array = np.array(predictions)
        target_array = np.array(targets)
        
        # Métricas básicas de regressão
        mae = mean_absolute_error(target_array, pred_array)
        mse = mean_squared_error(target_array, pred_array)
        rmse = np.sqrt(mse)
        
        # R² score
        r2 = r2_score(target_array, pred_array)
        
        # Correlação de Pearson
        pearson_corr, pearson_p = pearsonr(pred_array, target_array)
        
        # Correlação de Spearman
        spearman_corr, spearman_p = spearmanr(pred_array, target_array)
        
        # Mean Absolute Percentage Error (MAPE)
        mape = np.mean(np.abs((target_array - pred_array) / (target_array + 1e-8))) * 100
        
        # Symmetric Mean Absolute Percentage Error (SMAPE)
        smape = np.mean(
            2 * np.abs(pred_array - target_array) / 
            (np.abs(pred_array) + np.abs(target_array) + 1e-8)
        ) * 100
        
        prefix_str = f"{prefix}_" if prefix else ""
        
        return {
            f'{prefix_str}mae': mae,
            f'{prefix_str}mse': mse,
            f'{prefix_str}rmse': rmse,
            f'{prefix_str}r2': r2,
            f'{prefix_str}pearson_corr': pearson_corr,
            f'{prefix_str}spearman_corr': spearman_corr,
            f'{prefix_str}mape': mape,
            f'{prefix_str}smape': smape
        }
    
    def _compute_classification_metrics(
        self, 
        predictions: List[float], 
        targets: List[float]
    ) -> Dict[str, float]:
        """
        Computa métricas de classificação por categoria de qualidade
        """
        if not predictions or not targets:
            return {}
        
        pred_array = np.array(predictions)
        target_array = np.array(targets)
        
        # Converte scores para categorias
        pred_categories = self._score_to_category(pred_array)
        target_categories = self._score_to_category(target_array)
        
        # Accuracy por categoria
        category_accuracy = np.mean(pred_categories == target_categories)
        
        # Accuracy dentro de ±1 categoria
        category_diff = np.abs(pred_categories - target_categories)
        tolerance_1_accuracy = np.mean(category_diff <= 1)
        
        # Confusion matrix simplificada
        categories = ['poor', 'fair', 'good', 'excellent']
        confusion_metrics = {}
        
        for i, category in enumerate(categories):
            true_positives = np.sum((pred_categories == i) & (target_categories == i))
            false_positives = np.sum((pred_categories == i) & (target_categories != i))
            false_negatives = np.sum((pred_categories != i) & (target_categories == i))
            
            precision = true_positives / (true_positives + false_positives + 1e-8)
            recall = true_positives / (true_positives + false_negatives + 1e-8)
            f1 = 2 * (precision * recall) / (precision + recall + 1e-8)
            
            confusion_metrics[f'{category}_precision'] = precision
            confusion_metrics[f'{category}_recall'] = recall
            confusion_metrics[f'{category}_f1'] = f1
        
        return {
            'category_accuracy': category_accuracy,
            'category_tolerance_1_accuracy': tolerance_1_accuracy,
            **confusion_metrics
        }
    
    def _score_to_category(self, scores: np.ndarray) -> np.ndarray:
        """
        Converte scores numéricos para categorias de qualidade
        """
        categories = np.zeros_like(scores, dtype=int)
        
        categories[scores >= self.quality_thresholds['excellent']] = 3  # excellent
        categories[(scores >= self.quality_thresholds['good']) & 
                  (scores < self.quality_thresholds['excellent'])] = 2  # good
        categories[(scores >= self.quality_thresholds['fair']) & 
                  (scores < self.quality_thresholds['good'])] = 1  # fair
        categories[scores < self.quality_thresholds['fair']] = 0  # poor
        
        return categories
    
    def _compute_clinical_metrics(self) -> Dict[str, float]:
        """
        Computa métricas específicas para contexto clínico
        Propriedade intelectual SNPQIM
        """
        if not self.predictions['global_scores']:
            return {}
        
        pred_array = np.array(self.predictions['global_scores'])
        target_array = np.array(self.targets['global_scores'])
        
        clinical_metrics = {}
        
        # 1. Clinical Adequacy Rate
        # Porcentagem de imagens corretamente classificadas como adequadas para diagnóstico
        diagnostic_threshold = 80
        
        pred_adequate = pred_array >= diagnostic_threshold
        target_adequate = target_array >= diagnostic_threshold
        
        clinical_adequacy_accuracy = np.mean(pred_adequate == target_adequate)
        clinical_metrics['clinical_adequacy_accuracy'] = clinical_adequacy_accuracy
        
        # 2. Conservative Bias (importante para medicina)
        # Tendência de subestimar vs superestimar qualidade
        estimation_bias = np.mean(pred_array - target_array)
        clinical_metrics['estimation_bias'] = estimation_bias
        
        # Preferível em medicina: bias negativo (conservador)
        conservative_rate = np.mean(pred_array <= target_array)
        clinical_metrics['conservative_rate'] = conservative_rate
        
        # 3. Critical Error Rate
        # Porcentagem de imagens inadequadas classificadas como adequadas
        critical_threshold = 60
        target_inadequate = target_array < critical_threshold
        pred_adequate_critical = pred_array >= diagnostic_threshold
        
        critical_errors = np.sum(target_inadequate & pred_adequate_critical)
        total_inadequate = np.sum(target_inadequate)
        
        critical_error_rate = critical_errors / (total_inadequate + 1e-8)
        clinical_metrics['critical_error_rate'] = critical_error_rate
        
        # 4. Sensitivity/Specificity para adequação diagnóstica
        true_positives = np.sum(pred_adequate & target_adequate)
        false_positives = np.sum(pred_adequate & ~target_adequate)
        true_negatives = np.sum(~pred_adequate & ~target_adequate)
        false_negatives = np.sum(~pred_adequate & target_adequate)
        
        sensitivity = true_positives / (true_positives + false_negatives + 1e-8)
        specificity = true_negatives / (true_negatives + false_positives + 1e-8)
        
        clinical_metrics['diagnostic_sensitivity'] = sensitivity
        clinical_metrics['diagnostic_specificity'] = specificity
        
        # 5. Clinical Agreement Rate
        # Taxa de concordância dentro de margem clinicamente aceitável (±10 pontos)
        clinical_tolerance = 10
        within_tolerance = np.abs(pred_array - target_array) <= clinical_tolerance
        clinical_agreement = np.mean(within_tolerance)
        
        clinical_metrics['clinical_agreement_rate'] = clinical_agreement
        
        return clinical_metrics
    
    def _compute_fadex_overall_score(self, metrics: Dict[str, float]) -> float:
        """
        Computa score geral proprietário SNPQIM
        Combina múltiplas métricas com pesos específicos para medicina
        PROPRIEDADE INTELECTUAL
        """
        # Componentes do score SNPQIM (0-100)
        components = {}
        
        # 1. Accuracy Component (40%)
        if 'global_r2' in metrics:
            accuracy_component = max(0, min(100, metrics['global_r2'] * 100))
        else:
            accuracy_component = 0
        
        # 2. Clinical Safety Component (30%)
        # Baseado em conservative rate e critical error rate
        conservative_bonus = metrics.get('conservative_rate', 0.5) * 50
        critical_penalty = metrics.get('critical_error_rate', 0.5) * 50
        safety_component = max(0, conservative_bonus - critical_penalty)
        
        # 3. Correlation Component (20%)
        # Baseado em correlação de Pearson
        if 'global_pearson_corr' in metrics:
            correlation_component = max(0, metrics['global_pearson_corr']) * 100
        else:
            correlation_component = 0
        
        # 4. Clinical Agreement Component (10%)
        # Baseado na taxa de concordância clínica
        agreement_component = metrics.get('clinical_agreement_rate', 0) * 100
        
        # Combinação ponderada (fórmula proprietária SNPQIM)
        weights = [0.40, 0.30, 0.20, 0.10]
        components_list = [
            accuracy_component,
            safety_component,
            correlation_component,
            agreement_component
        ]
        
        fadex_score = sum(w * c for w, c in zip(weights, components_list))
        
        return min(max(fadex_score, 0), 100)
    
    def get_summary(self) -> str:
        """
        Retorna summary das métricas em formato legível
        """
        metrics = self.compute()
        
        summary = "=== SNPQIM QUALITY METRICS SUMMARY ===\n\n"
        
        # Overall Performance
        if 'fadex_overall_score' in metrics:
            summary += f"SNPQIM Overall Score: {metrics['fadex_overall_score']:.1f}/100\n\n"
        
        # Global Score Performance
        if 'global_r2' in metrics:
            summary += "Global Score Performance:\n"
            summary += f"  R² Score: {metrics['global_r2']:.3f}\n"
            summary += f"  MAE: {metrics['global_mae']:.2f}\n"
            summary += f"  RMSE: {metrics['global_rmse']:.2f}\n"
            summary += f"  Pearson Correlation: {metrics['global_pearson_corr']:.3f}\n\n"
        
        # Clinical Performance
        if 'clinical_adequacy_accuracy' in metrics:
            summary += "Clinical Performance:\n"
            summary += f"  Clinical Adequacy Accuracy: {metrics['clinical_adequacy_accuracy']:.3f}\n"
            summary += f"  Conservative Rate: {metrics['conservative_rate']:.3f}\n"
            summary += f"  Critical Error Rate: {metrics['critical_error_rate']:.3f}\n"
            summary += f"  Clinical Agreement Rate: {metrics['clinical_agreement_rate']:.3f}\n\n"
        
        # Category Performance
        if 'category_accuracy' in metrics:
            summary += "Category Classification:\n"
            summary += f"  Category Accuracy: {metrics['category_accuracy']:.3f}\n"
            summary += f"  Tolerance ±1 Accuracy: {metrics['category_tolerance_1_accuracy']:.3f}\n\n"
        
        # Per-Category F1 Scores
        categories = ['poor', 'fair', 'good', 'excellent']
        f1_scores = [metrics.get(f'{cat}_f1', 0) for cat in categories]
        if any(f1_scores):
            summary += "F1 Scores by Category:\n"
            for cat, f1 in zip(categories, f1_scores):
                summary += f"  {cat.capitalize()}: {f1:.3f}\n"
        
        return summary
    
    def get_dimension_summary(self) -> str:
        """
        Retorna summary das métricas por dimensão
        """
        metrics = self.compute()
        
        summary = "=== DIMENSION-WISE PERFORMANCE ===\n\n"
        
        dimensions = ['sharpness', 'exposure', 'contrast', 'noise_level', 'artifacts', 'clinical_adequacy']
        
        for dim in dimensions:
            mae_key = f'dim_{dim}_mae'
            r2_key = f'dim_{dim}_r2'
            corr_key = f'dim_{dim}_pearson_corr'
            
            if mae_key in metrics:
                summary += f"{dim.replace('_', ' ').title()}:\n"
                summary += f"  MAE: {metrics[mae_key]:.2f}\n"
                if r2_key in metrics:
                    summary += f"  R²: {metrics[r2_key]:.3f}\n"
                if corr_key in metrics:
                    summary += f"  Correlation: {metrics[corr_key]:.3f}\n"
                summary += "\n"
        
        return summary


class RealTimeMetrics:
    """
    Métricas em tempo real para monitoramento durante treinamento
    """
    
    def __init__(self, window_size: int = 100):
        self.window_size = window_size
        self.reset()
    
    def reset(self):
        """Reset das métricas em tempo real"""
        self.recent_predictions = []
        self.recent_targets = []
        self.recent_losses = []
    
    def update(self, prediction: float, target: float, loss: float):
        """Atualiza com nova predição"""
        self.recent_predictions.append(prediction)
        self.recent_targets.append(target)
        self.recent_losses.append(loss)
        
        # Mantém apenas as últimas N observações
        if len(self.recent_predictions) > self.window_size:
            self.recent_predictions.pop(0)
            self.recent_targets.pop(0)
            self.recent_losses.pop(0)
    
    def get_current_metrics(self) -> Dict[str, float]:
        """Retorna métricas atuais da janela"""
        if len(self.recent_predictions) < 2:
            return {}
        
        pred_array = np.array(self.recent_predictions)
        target_array = np.array(self.recent_targets)
        loss_array = np.array(self.recent_losses)
        
        # Métricas básicas
        mae = mean_absolute_error(target_array, pred_array)
        correlation, _ = pearsonr(pred_array, target_array)
        avg_loss = np.mean(loss_array)
        
        return {
            'recent_mae': mae,
            'recent_correlation': correlation,
            'recent_avg_loss': avg_loss,
            'window_size': len(self.recent_predictions)
        }


if __name__ == "__main__":
    # Teste das métricas
    device = torch.device('cpu')
    metrics = FadexQualityMetrics(device=device)
    
    # Dados de teste
    n_samples = 100
    
    # Simula predições e targets
    for _ in range(5):  # 5 batches
        batch_size = 20
        
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
        
        # Targets com alguma correlação com predições (simula modelo razoável)
        targets = {
            'global_score': predictions['global_score'] + torch.randn(batch_size, 1) * 10,
            'dimension_scores': {
                dim: score + torch.randn(batch_size, 1) * 5 
                for dim, score in predictions['dimension_scores'].items()
            },
            'confidence': predictions['confidence'] + torch.randn(batch_size, 1) * 5
        }
        
        metrics.update(predictions, targets)
    
    # Computa e exibe métricas
    computed_metrics = metrics.compute()
    
    print(metrics.get_summary())
    print(metrics.get_dimension_summary())
    
    print("Métricas computadas:")
    for key, value in computed_metrics.items():
        print(f"  {key}: {value:.4f}")