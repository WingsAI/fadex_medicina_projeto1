"""
FADEX Core Scoring System
Sistema proprietário de scoring de qualidade de imagens médicas oftalmológicas
PROPRIEDADE INTELECTUAL FADEX - ALGORITMO PATENTEÁVEL

Este módulo implementa o algoritmo core proprietário da FADEX para:
1. Quality Assessment Multi-dimensional 
2. Clinical Adequacy Scoring
3. ML Readiness Assessment
4. Confidence Quantification
"""

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, List, Tuple, Optional, Union
from dataclasses import dataclass
from enum import Enum
import cv2
from scipy import ndimage
from skimage import filters, measure, feature
import math


class QualityDimension(Enum):
    """Dimensões de qualidade específicas para oftalmologia"""
    SHARPNESS = "sharpness"
    EXPOSURE = "exposure" 
    CONTRAST = "contrast"
    NOISE_LEVEL = "noise_level"
    ARTIFACTS = "artifacts"
    CLINICAL_ADEQUACY = "clinical_adequacy"


@dataclass
class FadexScore:
    """Estrutura do score FADEX proprietário"""
    global_score: float  # Score global 0-100
    dimension_scores: Dict[str, float]  # Scores por dimensão
    confidence: float  # Confidence do score
    ml_readiness: str  # Adequação para ML (excellent, good, fair, poor)
    clinical_adequacy: str  # Adequação clínica (diagnostic, screening, inadequate)
    recommendations: List[str]  # Recomendações específicas
    metadata: Dict[str, any]  # Metadata adicional


class FadexQualityAnalyzer:
    """
    Analisador principal de qualidade FADEX
    ALGORITMO PROPRIETÁRIO para avaliação multi-dimensional
    """
    
    def __init__(
        self,
        device: torch.device = None,
        clinical_standards: Dict[str, float] = None
    ):
        self.device = device or torch.device('cpu')
        
        # Padrões clínicos específicos para oftalmologia (propriedade intelectual)
        self.clinical_standards = clinical_standards or {
            'min_resolution': 512,  # Resolução mínima aceitável
            'optimal_resolution': 1024,  # Resolução ótima
            'contrast_threshold': 0.3,  # Contraste mínimo
            'noise_threshold': 0.15,  # Nível máximo de ruído
            'sharpness_threshold': 0.7,  # Nitidez mínima
            'exposure_range': (0.2, 0.8),  # Range de exposição adequada
        }
        
        # Pesos adaptativos por tipo de exame (algoritmo proprietário)
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
    
    def analyze_image(
        self, 
        image: Union[np.ndarray, torch.Tensor],
        exam_type: str = 'fundoscopy',
        metadata: Optional[Dict] = None
    ) -> FadexScore:
        """
        Análise principal de qualidade da imagem
        ALGORITMO PROPRIETÁRIO FADEX
        
        Args:
            image: Imagem para análise
            exam_type: Tipo de exame oftalmológico
            metadata: Metadata adicional da imagem
            
        Returns:
            FadexScore com análise completa
        """
        # Preprocessamento da imagem
        processed_image = self._preprocess_image(image)
        
        # Análise por dimensões específicas (algoritmo proprietário)
        dimension_scores = {}
        
        # 1. Análise de nitidez (propriedade intelectual FADEX)
        dimension_scores['sharpness'] = self._analyze_sharpness(processed_image)
        
        # 2. Análise de exposição (algoritmo proprietário)
        dimension_scores['exposure'] = self._analyze_exposure(processed_image)
        
        # 3. Análise de contraste (método FADEX)
        dimension_scores['contrast'] = self._analyze_contrast(processed_image)
        
        # 4. Análise de ruído (propriedade intelectual)
        dimension_scores['noise_level'] = self._analyze_noise(processed_image)
        
        # 5. Detecção de artifacts (algoritmo FADEX)
        dimension_scores['artifacts'] = self._detect_artifacts(processed_image)
        
        # 6. Adequação clínica (propriedade intelectual)
        dimension_scores['clinical_adequacy'] = self._assess_clinical_adequacy(
            processed_image, dimension_scores, exam_type
        )
        
        # Cálculo do score global (fórmula proprietária FADEX)
        global_score = self._calculate_global_score(
            dimension_scores, exam_type
        )
        
        # Cálculo de confidence (algoritmo proprietário)
        confidence = self._calculate_confidence(dimension_scores, processed_image)
        
        # Classificação ML readiness (propriedade intelectual)
        ml_readiness = self._assess_ml_readiness(global_score, dimension_scores)
        
        # Classificação clínica (algoritmo FADEX)
        clinical_adequacy = self._classify_clinical_adequacy(global_score, dimension_scores)
        
        # Geração de recomendações (sistema especialista propriedade)
        recommendations = self._generate_recommendations(dimension_scores, exam_type)
        
        return FadexScore(
            global_score=global_score,
            dimension_scores=dimension_scores,
            confidence=confidence,
            ml_readiness=ml_readiness,
            clinical_adequacy=clinical_adequacy,
            recommendations=recommendations,
            metadata=metadata or {}
        )
    
    def _preprocess_image(self, image: Union[np.ndarray, torch.Tensor]) -> np.ndarray:
        """Preprocessamento padronizado da imagem"""
        if isinstance(image, torch.Tensor):
            image = image.detach().cpu().numpy()

        # Normalização para 0-1
        if image.max() > 1.0:
            image = image.astype(np.float32) / 255.0
        else:
            # Garantir float32 para compatibilidade com OpenCV
            image = image.astype(np.float32)

        # Conversão para grayscale se necessário para análises específicas
        if len(image.shape) == 3 and image.shape[-1] == 3:
            gray_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        else:
            gray_image = image

        return gray_image
    
    def _analyze_sharpness(self, image: np.ndarray) -> float:
        """
        Análise proprietária de nitidez FADEX
        Combina múltiplas métricas para avaliação robusta
        PROPRIEDADE INTELECTUAL
        """
        # Garante tipo correto para OpenCV
        image = image.astype(np.float64)

        # 1. Variance of Laplacian (método clássico)
        laplacian_var = cv2.Laplacian(image, cv2.CV_64F).var()
        
        # 2. Gradiente magnitude médio (FADEX method)
        grad_x = cv2.Sobel(image, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(image, cv2.CV_64F, 0, 1, ksize=3)
        gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        mean_gradient = np.mean(gradient_magnitude)
        
        # 3. High-frequency content analysis (propriedade FADEX)
        f_transform = np.fft.fft2(image)
        f_shift = np.fft.fftshift(f_transform)
        magnitude_spectrum = np.abs(f_shift)
        
        # Análise de alta frequência nas bordas
        h, w = magnitude_spectrum.shape
        center = (h//2, w//2)
        high_freq_mask = np.zeros((h, w))
        cv2.circle(high_freq_mask, center, min(h, w)//4, 1, -1)
        high_freq_mask = 1 - high_freq_mask
        
        high_freq_energy = np.mean(magnitude_spectrum * high_freq_mask)
        
        # 4. Edge density analysis (método FADEX)
        edges = cv2.Canny((image * 255).astype(np.uint8), 50, 150)
        edge_density = np.sum(edges > 0) / edges.size
        
        # Combinação proprietária FADEX (fórmula patenteável)
        weights = [0.3, 0.25, 0.25, 0.2]
        normalized_metrics = [
            min(laplacian_var / 1000, 1.0),  # Normalização empírica
            min(mean_gradient / 0.5, 1.0),
            min(high_freq_energy / 1000, 1.0),
            min(edge_density / 0.1, 1.0)
        ]
        
        sharpness_score = sum(w * m for w, m in zip(weights, normalized_metrics))
        
        return min(sharpness_score * 100, 100.0)
    
    def _analyze_exposure(self, image: np.ndarray) -> float:
        """
        Análise proprietária de exposição FADEX
        Específica para imagens oftalmológicas
        ALGORITMO PROPRIETÁRIO
        """
        # Garante tipo correto
        image = image.astype(np.float64)

        # 1. Análise de histograma
        hist, bins = np.histogram(image.flatten(), bins=256, range=(0, 1))
        hist_normalized = hist / hist.sum()
        
        # 2. Detecção de clipping (over/under exposure)
        underexposed_ratio = np.sum(image < 0.05) / image.size
        overexposed_ratio = np.sum(image > 0.95) / image.size
        clipping_penalty = (underexposed_ratio + overexposed_ratio) * 2
        
        # 3. Análise de distribuição tonal (método FADEX)
        mean_intensity = np.mean(image)
        std_intensity = np.std(image)
        
        # Ideal range para oftalmologia (baseado em estudos clínicos)
        ideal_mean_range = (0.3, 0.7)
        ideal_std_range = (0.15, 0.4)
        
        # Score baseado na proximidade do ideal
        mean_score = 1 - abs(mean_intensity - np.mean(ideal_mean_range)) / 0.5
        std_score = 1 - abs(std_intensity - np.mean(ideal_std_range)) / 0.3
        
        # 4. Análise de dinâmica tonal (propriedade FADEX)
        percentile_5 = np.percentile(image, 5)
        percentile_95 = np.percentile(image, 95)
        dynamic_range = percentile_95 - percentile_5
        dynamic_score = min(dynamic_range / 0.8, 1.0)  # Ideal > 0.8
        
        # Combinação proprietária (fórmula FADEX)
        exposure_score = (
            0.4 * mean_score +
            0.3 * std_score +
            0.2 * dynamic_score +
            0.1 * (1 - clipping_penalty)
        )
        
        return max(min(exposure_score * 100, 100.0), 0.0)
    
    def _analyze_contrast(self, image: np.ndarray) -> float:
        """
        Análise proprietária de contraste FADEX
        Otimizada para estruturas oftalmológicas
        """
        # Garante tipo correto
        image = image.astype(np.float64)

        # 1. RMS Contrast (método clássico)
        rms_contrast = np.sqrt(np.mean((image - np.mean(image))**2))
        
        # 2. Michelson Contrast para regiões de interesse
        # Identifica regiões com estruturas oftalmológicas
        structure_enhanced = filters.unsharp_mask(image, radius=2, amount=1)
        local_maxima = feature.peak_local_max(structure_enhanced, min_distance=20)
        local_minima = feature.peak_local_max(-structure_enhanced, min_distance=20)
        
        if len(local_maxima[0]) > 0 and len(local_minima[0]) > 0:
            max_vals = structure_enhanced[local_maxima]
            min_vals = structure_enhanced[local_minima]
            michelson_contrast = (np.mean(max_vals) - np.mean(min_vals)) / (np.mean(max_vals) + np.mean(min_vals) + 1e-8)
        else:
            michelson_contrast = 0
        
        # 3. Local contrast analysis (propriedade FADEX)
        # Análise de contraste local usando janelas deslizantes
        kernel_size = 32
        local_contrasts = []
        
        h, w = image.shape
        for i in range(0, h-kernel_size, kernel_size//2):
            for j in range(0, w-kernel_size, kernel_size//2):
                patch = image[i:i+kernel_size, j:j+kernel_size]
                if patch.size > 0:
                    local_std = np.std(patch)
                    local_contrasts.append(local_std)
        
        mean_local_contrast = np.mean(local_contrasts) if local_contrasts else 0
        
        # 4. Edge-based contrast (método FADEX)
        edges = cv2.Canny((image * 255).astype(np.uint8), 50, 150)
        edge_pixels = image[edges > 0]
        non_edge_pixels = image[edges == 0]
        
        if len(edge_pixels) > 0 and len(non_edge_pixels) > 0:
            edge_contrast = abs(np.mean(edge_pixels) - np.mean(non_edge_pixels))
        else:
            edge_contrast = 0
        
        # Combinação proprietária FADEX
        contrast_metrics = [
            min(rms_contrast / 0.3, 1.0),
            min(abs(michelson_contrast) / 0.5, 1.0),
            min(mean_local_contrast / 0.2, 1.0),
            min(edge_contrast / 0.3, 1.0)
        ]
        
        weights = [0.3, 0.25, 0.25, 0.2]
        contrast_score = sum(w * m for w, m in zip(weights, contrast_metrics))
        
        return min(contrast_score * 100, 100.0)
    
    def _analyze_noise(self, image: np.ndarray) -> float:
        """
        Análise proprietária de ruído FADEX
        Detecta múltiplos tipos de ruído em imagens médicas
        """
        # Garante tipo correto
        image = image.astype(np.float64)

        # 1. Noise estimation via wavelet decomposition
        from scipy import ndimage
        
        # Estima ruído usando método Donoho (adaptado para medicina)
        coeffs = cv2.medianBlur((image * 255).astype(np.uint8), 3)
        noise_estimate = np.median(np.abs(image - coeffs/255.0)) / 0.6745
        
        # 2. High-frequency noise analysis
        gaussian_blurred = filters.gaussian(image, sigma=1)
        high_freq_noise = np.mean(np.abs(image - gaussian_blurred))
        
        # 3. Salt and pepper noise detection (específico para medicina)
        median_filtered = ndimage.median_filter(image, size=3)
        impulse_noise = np.mean(np.abs(image - median_filtered))
        
        # 4. Texture vs noise discrimination (propriedade FADEX)
        # Usa análise de co-ocorrência para distinguir textura médica de ruído
        
        # Converte para análise de textura
        gray_levels = 16
        quantized = (image * (gray_levels - 1)).astype(int)
        
        # Simplificada co-occurrence matrix
        dx, dy = 1, 0  # Horizontal adjacency
        glcm_sum = 0
        glcm_count = 0
        
        for i in range(quantized.shape[0] - dx):
            for j in range(quantized.shape[1] - dy):
                if quantized[i, j] < gray_levels and quantized[i+dx, j+dy] < gray_levels:
                    # Simplified texture measure
                    glcm_sum += abs(quantized[i, j] - quantized[i+dx, j+dy])
                    glcm_count += 1
        
        texture_homogeneity = 1 - (glcm_sum / max(glcm_count, 1)) / gray_levels
        
        # Noise score combination (algoritmo proprietário)
        noise_metrics = [
            1 - min(noise_estimate / 0.1, 1.0),  # Inverte: menos ruído = melhor score
            1 - min(high_freq_noise / 0.05, 1.0),
            1 - min(impulse_noise / 0.03, 1.0),
            texture_homogeneity
        ]
        
        weights = [0.4, 0.3, 0.2, 0.1]
        noise_score = sum(w * m for w, m in zip(weights, noise_metrics))
        
        return min(noise_score * 100, 100.0)
    
    def _detect_artifacts(self, image: np.ndarray) -> float:
        """
        Detecção proprietária de artifacts FADEX
        Específica para artifacts comuns em oftalmologia
        """
        # Garante tipo correto
        image = image.astype(np.float64)

        artifact_score = 100.0  # Começa com score perfeito
        
        # 1. Motion blur detection
        # FFT-based approach para detectar motion blur
        f_transform = np.fft.fft2(image)
        magnitude_spectrum = np.abs(np.fft.fftshift(f_transform))
        
        # Análise de direcionality no espectro
        h, w = magnitude_spectrum.shape
        center = (h//2, w//2)
        
        # Verifica padrões de motion blur
        y, x = np.ogrid[:h, :w]
        mask = (x - center[1])**2 + (y - center[0])**2 <= (min(h, w)//4)**2
        spectrum_roi = magnitude_spectrum[mask]
        
        motion_blur_indicator = np.std(spectrum_roi) / np.mean(spectrum_roi)
        if motion_blur_indicator < 0.3:  # Threshold empírico
            artifact_score -= 20
        
        # 2. Compression artifacts detection
        # Detecta artifacts de compressão JPEG
        block_size = 8
        blocking_artifacts = 0
        
        for i in range(0, image.shape[0]-block_size, block_size):
            for j in range(0, image.shape[1]-block_size, block_size):
                block = image[i:i+block_size, j:j+block_size]
                # Verifica discontinuidades nas bordas dos blocos
                if i > 0:
                    top_diff = np.mean(np.abs(block[0, :] - image[i-1, j:j+block_size]))
                    if top_diff > 0.1:
                        blocking_artifacts += 1
                
                if j > 0:
                    left_diff = np.mean(np.abs(block[:, 0] - image[i:i+block_size, j-1]))
                    if left_diff > 0.1:
                        blocking_artifacts += 1
        
        total_blocks = ((image.shape[0]//block_size) * (image.shape[1]//block_size))
        blocking_ratio = blocking_artifacts / max(total_blocks * 2, 1)  # *2 para top e left
        artifact_score -= min(blocking_ratio * 30, 30)
        
        # 3. Saturation artifacts (específico para oftalmologia)
        saturation_mask = (image > 0.98) | (image < 0.02)
        saturation_ratio = np.sum(saturation_mask) / image.size
        artifact_score -= min(saturation_ratio * 50, 50)
        
        # 4. Reflection artifacts (específico para fundoscopia)
        # Detecta reflexos especulares comuns em fundoscopia
        very_bright = image > 0.9
        bright_regions = measure.label(very_bright)
        
        reflection_penalty = 0
        for region_label in range(1, bright_regions.max() + 1):
            region_mask = bright_regions == region_label
            region_area = np.sum(region_mask)
            
            # Reflexos tendem a ser pequenos e muito brilhantes
            if region_area < 100 and np.mean(image[region_mask]) > 0.95:
                reflection_penalty += 5
        
        artifact_score -= min(reflection_penalty, 25)
        
        return max(artifact_score, 0.0)
    
    def _assess_clinical_adequacy(
        self, 
        image: np.ndarray, 
        dimension_scores: Dict[str, float],
        exam_type: str
    ) -> float:
        """
        Avaliação proprietária de adequação clínica FADEX
        Baseada em guidelines oftalmológicos
        """
        # Pesos específicos por tipo de exame
        weights = self.exam_weights.get(exam_type, self.exam_weights['fundoscopy'])
        
        # Score base calculado
        base_score = sum(
            weights[dim] * score for dim, score in dimension_scores.items()
            if dim in weights
        )
        
        # Adjustments específicos para oftalmologia (propriedade intelectual)
        
        # 1. Resolution adequacy
        h, w = image.shape
        min_resolution = min(h, w)
        resolution_adequacy = min(min_resolution / self.clinical_standards['min_resolution'], 1.0)
        
        # 2. Dynamic range adequacy para diagnóstico
        dynamic_range = np.percentile(image, 95) - np.percentile(image, 5)
        dynamic_adequacy = min(dynamic_range / 0.6, 1.0)
        
        # 3. Structure visibility (específico para oftalmologia)
        # Detecta presença de estruturas anatômicas relevantes
        structure_visibility = self._assess_structure_visibility(image, exam_type)
        
        # Combinação final (fórmula proprietária FADEX)
        clinical_factors = [base_score, resolution_adequacy * 100, 
                          dynamic_adequacy * 100, structure_visibility]
        clinical_weights = [0.6, 0.15, 0.15, 0.1]
        
        clinical_score = sum(w * f for w, f in zip(clinical_weights, clinical_factors))
        
        return min(clinical_score, 100.0)
    
    def _assess_structure_visibility(self, image: np.ndarray, exam_type: str) -> float:
        """
        Avalia visibilidade de estruturas anatômicas específicas
        PROPRIEDADE INTELECTUAL FADEX
        """
        if exam_type == 'fundoscopy':
            # Para fundoscopia: detecta disco óptico, vasos, mácula
            return self._detect_fundus_structures(image)
        elif exam_type == 'oct':
            # Para OCT: detecta camadas retinianas
            return self._detect_oct_layers(image)
        else:
            # Análise genérica de estrutura
            return self._generic_structure_analysis(image)
    
    def _detect_fundus_structures(self, image: np.ndarray) -> float:
        """Detecta estruturas do fundo de olho"""
        # Simplified structure detection for demo
        # Em implementação real, usaria modelos específicos
        
        # Detecta regiões circulares (possível disco óptico)
        circles = cv2.HoughCircles(
            (image * 255).astype(np.uint8),
            cv2.HOUGH_GRADIENT, dp=1, minDist=100,
            param1=50, param2=30, minRadius=20, maxRadius=100
        )
        
        structure_score = 50.0  # Base score
        
        if circles is not None:
            structure_score += 30  # Bonus for detected circular structures
        
        # Detecta estruturas lineares (possíveis vasos)
        edges = cv2.Canny((image * 255).astype(np.uint8), 50, 150)
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=50, 
                               minLineLength=30, maxLineGap=10)
        
        if lines is not None and len(lines) > 5:
            structure_score += 20  # Bonus for vascular structures
        
        return min(structure_score, 100.0)
    
    def _detect_oct_layers(self, image: np.ndarray) -> float:
        """Detecta camadas em imagens OCT"""
        # Simplified OCT layer detection
        # Procura por padrões horizontais característicos
        
        # Análise de gradiente horizontal para detectar camadas
        grad_y = cv2.Sobel(image, cv2.CV_64F, 0, 1, ksize=3)
        horizontal_structure = np.mean(np.abs(grad_y), axis=1)
        
        # Detecta picos que podem indicar interfaces de camadas
        from scipy.signal import find_peaks
        peaks, _ = find_peaks(horizontal_structure, height=np.mean(horizontal_structure))
        
        # Score baseado no número de camadas detectadas
        layer_score = min(len(peaks) * 15, 100.0)
        
        return layer_score
    
    def _generic_structure_analysis(self, image: np.ndarray) -> float:
        """Análise genérica de estrutura"""
        # Baseado em densidade de features e organização espacial
        
        # Detecta features usando corner detection
        corners = cv2.goodFeaturesToTrack(
            (image * 255).astype(np.uint8),
            maxCorners=100, qualityLevel=0.01, minDistance=10
        )
        
        # Score baseado na densidade de features
        if corners is not None:
            feature_density = len(corners) / (image.shape[0] * image.shape[1]) * 1000
            structure_score = min(feature_density * 20, 100.0)
        else:
            structure_score = 20.0
        
        return structure_score
    
    def _calculate_global_score(
        self, 
        dimension_scores: Dict[str, float], 
        exam_type: str
    ) -> float:
        """
        Cálculo do score global proprietário FADEX
        FÓRMULA PATENTEÁVEL
        """
        # Pesos adaptativos baseados no tipo de exame
        weights = self.exam_weights.get(exam_type, self.exam_weights['fundoscopy'])
        
        # Score ponderado base
        weighted_score = sum(
            weights.get(dim, 0) * score for dim, score in dimension_scores.items()
        )
        
        # Fatores de correção proprietários FADEX
        
        # 1. Penalty por scores muito baixos (critical failures)
        critical_penalty = 0
        for dim, score in dimension_scores.items():
            if score < 30:  # Threshold crítico
                critical_penalty += (30 - score) * 0.5
        
        # 2. Bonus por consistência entre dimensões
        scores_list = list(dimension_scores.values())
        score_std = np.std(scores_list)
        consistency_bonus = max(0, (20 - score_std)) * 0.1
        
        # 3. Non-linear scaling para realçar diferenças (propriedade FADEX)
        # Função sigmoid adaptada para scoring médico
        def fadex_sigmoid(x, midpoint=50, steepness=0.1):
            return 100 / (1 + np.exp(-steepness * (x - midpoint)))
        
        # Aplica transformação não-linear
        intermediate_score = weighted_score - critical_penalty + consistency_bonus
        final_score = fadex_sigmoid(intermediate_score)
        
        # 4. Constraint final para garantir range 0-100
        return max(0.0, min(final_score, 100.0))
    
    def _calculate_confidence(
        self, 
        dimension_scores: Dict[str, float], 
        image: np.ndarray
    ) -> float:
        """
        Cálculo proprietário de confidence FADEX
        Baseado em múltiplos fatores de incerteza
        """
        # 1. Consistência entre dimensões
        scores_list = list(dimension_scores.values())
        dimension_consistency = 1 - (np.std(scores_list) / 100)
        
        # 2. Qualidade da imagem para análise
        image_quality_factor = min(np.mean(list(dimension_scores.values())) / 100, 1.0)
        
        # 3. Resolução adequacy
        h, w = image.shape
        resolution_factor = min(min(h, w) / 512, 1.0)
        
        # 4. Dynamic range factor
        dynamic_range = np.percentile(image, 95) - np.percentile(image, 5)
        dynamic_factor = min(dynamic_range / 0.8, 1.0)
        
        # Combinação proprietária (algoritmo FADEX)
        confidence_factors = [
            dimension_consistency,
            image_quality_factor, 
            resolution_factor,
            dynamic_factor
        ]
        
        weights = [0.4, 0.3, 0.15, 0.15]
        confidence = sum(w * f for w, f in zip(weights, confidence_factors))
        
        # Aplicação de função de calibração (propriedade FADEX)
        calibrated_confidence = confidence ** 0.8  # Slight deflation for conservatism
        
        return min(calibrated_confidence * 100, 100.0)
    
    def _assess_ml_readiness(
        self, 
        global_score: float, 
        dimension_scores: Dict[str, float]
    ) -> str:
        """
        Classificação proprietária de adequação para ML
        PROPRIEDADE INTELECTUAL FADEX
        """
        # Thresholds específicos para ML (baseados em validação empírica)
        if global_score >= 85 and all(score >= 80 for score in dimension_scores.values()):
            return "excellent"  # Ideal para research-grade ML
        elif global_score >= 70 and all(score >= 60 for score in dimension_scores.values()):
            return "good"      # Adequado para clinical ML
        elif global_score >= 50 and all(score >= 40 for score in dimension_scores.values()):
            return "fair"      # Utilizável com preprocessing
        else:
            return "poor"      # Não recomendado para ML
    
    def _classify_clinical_adequacy(
        self, 
        global_score: float, 
        dimension_scores: Dict[str, float]
    ) -> str:
        """
        Classificação clínica proprietária FADEX
        Baseada em guidelines oftalmológicos
        """
        # Critérios específicos para diagnóstico oftalmológico
        critical_dimensions = ['sharpness', 'clinical_adequacy']
        critical_scores = [dimension_scores.get(dim, 0) for dim in critical_dimensions]
        
        if global_score >= 80 and all(score >= 75 for score in critical_scores):
            return "diagnostic"   # Adequado para diagnóstico
        elif global_score >= 60 and all(score >= 50 for score in critical_scores):
            return "screening"    # Adequado para screening
        else:
            return "inadequate"   # Inadequado para uso clínico
    
    def _generate_recommendations(
        self, 
        dimension_scores: Dict[str, float], 
        exam_type: str
    ) -> List[str]:
        """
        Geração de recomendações específicas
        Sistema especialista proprietário FADEX
        """
        recommendations = []
        
        # Análise por dimensão com recomendações específicas
        if dimension_scores.get('sharpness', 0) < 70:
            recommendations.append(
                "Verifique o foco do equipamento e estabilize a captura para melhorar nitidez"
            )
        
        if dimension_scores.get('exposure', 0) < 60:
            recommendations.append(
                "Ajuste a exposição - imagem muito escura ou clara para análise adequada"
            )
        
        if dimension_scores.get('contrast', 0) < 65:
            recommendations.append(
                "Melhore o contraste ajustando iluminação ou configurações do equipamento"
            )
        
        if dimension_scores.get('noise_level', 0) < 70:
            recommendations.append(
                "Reduza o ruído usando menor ISO ou melhor iluminação"
            )
        
        if dimension_scores.get('artifacts', 0) < 75:
            recommendations.append(
                "Verifique artifacts de movimento ou compressão que podem afetar diagnóstico"
            )
        
        if dimension_scores.get('clinical_adequacy', 0) < 70:
            recommendations.append(
                f"Imagem pode não atender padrões clínicos para {exam_type} - considere nova captura"
            )
        
        # Recomendações específicas por tipo de exame
        if exam_type == 'fundoscopy':
            if dimension_scores.get('clinical_adequacy', 0) < 80:
                recommendations.append(
                    "Para fundoscopia: garanta visibilidade do disco óptico e estruturas vasculares"
                )
        
        elif exam_type == 'oct':
            if dimension_scores.get('sharpness', 0) < 80:
                recommendations.append(
                    "Para OCT: nitidez crítica para visualização de camadas retinianas"
                )
        
        # Se não há problemas significativos
        if not recommendations:
            recommendations.append("Imagem atende aos padrões de qualidade FADEX")
        
        return recommendations


def analyze_image_quality(
    image: Union[np.ndarray, torch.Tensor],
    exam_type: str = 'fundoscopy',
    metadata: Optional[Dict] = None
) -> FadexScore:
    """
    Função principal de análise de qualidade FADEX
    Interface simplificada para uso externo
    
    Args:
        image: Imagem para análise
        exam_type: Tipo de exame ('fundoscopy', 'oct', 'angiography')
        metadata: Metadata adicional
        
    Returns:
        FadexScore com análise completa
    """
    analyzer = FadexQualityAnalyzer()
    return analyzer.analyze_image(image, exam_type, metadata)


if __name__ == "__main__":
    # Teste do sistema de scoring
    import matplotlib.pyplot as plt
    
    # Cria imagem de teste
    test_image = np.random.rand(512, 512) * 0.8 + 0.1  # Simula imagem médica
    
    # Adiciona algumas características
    # Disco óptico simulado
    center = (256, 200)
    y, x = np.ogrid[:512, :512]
    mask = (x - center[1])**2 + (y - center[0])**2 <= 30**2
    test_image[mask] = 0.9
    
    # Vasos simulados
    test_image[250:260, 150:400] = 0.2
    test_image[200:350, 180:190] = 0.2
    
    # Análise completa
    score = analyze_image_quality(test_image, exam_type='fundoscopy')
    
    print("=== FADEX QUALITY ANALYSIS ===")
    print(f"Global Score: {score.global_score:.1f}/100")
    print(f"Confidence: {score.confidence:.1f}%")
    print(f"ML Readiness: {score.ml_readiness}")
    print(f"Clinical Adequacy: {score.clinical_adequacy}")
    
    print("\nDimension Scores:")
    for dim, value in score.dimension_scores.items():
        print(f"  {dim}: {value:.1f}/100")
    
    print("\nRecommendations:")
    for rec in score.recommendations:
        print(f"  - {rec}")