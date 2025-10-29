"""
Testes Unitários para WingsAI Core
Valida funcionamento do algoritmo de scoring
"""

import pytest
import numpy as np
import sys
import os

# Adiciona src ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from ml.scoring.wingsai_core import (
    WingsAIQualityAnalyzer,
    analyze_image_quality,
    WingsAIScore,
    QualityDimension
)


class TestWingsAIQualityAnalyzer:
    """Testes para a classe WingsAIQualityAnalyzer"""

    @pytest.fixture
    def analyzer(self):
        """Fixture que cria um analyzer para testes"""
        return WingsAIQualityAnalyzer()

    @pytest.fixture
    def sample_image_high_quality(self):
        """Cria imagem sintética de alta qualidade"""
        np.random.seed(42)
        image = np.ones((512, 512)) * 0.5
        # Adiciona estruturas
        y, x = np.ogrid[:512, :512]
        center = (256, 256)
        mask = (x - center[1])**2 + (y - center[0])**2 <= 50**2
        image[mask] = 0.8
        # Ruído mínimo
        noise = np.random.normal(0, 0.01, image.shape)
        image = np.clip(image + noise, 0, 1)
        return image

    @pytest.fixture
    def sample_image_low_quality(self):
        """Cria imagem sintética de baixa qualidade"""
        np.random.seed(42)
        image = np.ones((256, 256)) * 0.3
        # Ruído alto
        noise = np.random.normal(0, 0.15, image.shape)
        image = np.clip(image + noise, 0, 1)
        # Blur pesado
        from scipy.ndimage import gaussian_filter
        image = gaussian_filter(image, sigma=3)
        return image

    def test_analyzer_initialization(self, analyzer):
        """Testa inicialização do analyzer"""
        assert analyzer is not None
        assert analyzer.clinical_standards is not None
        assert analyzer.exam_weights is not None
        assert 'fundoscopy' in analyzer.exam_weights
        assert 'oct' in analyzer.exam_weights

    def test_analyze_high_quality_image(self, analyzer, sample_image_high_quality):
        """Testa análise de imagem de alta qualidade"""
        score = analyzer.analyze_image(sample_image_high_quality, exam_type='fundoscopy')

        assert isinstance(score, WingsAIScore)
        assert 0 <= score.global_score <= 100
        assert score.global_score > 50  # Deve ter score razoável
        assert 0 <= score.confidence <= 100
        assert score.ml_readiness in ['excellent', 'good', 'fair', 'poor']
        assert score.clinical_adequacy in ['diagnostic', 'screening', 'inadequate']
        assert len(score.dimension_scores) > 0
        assert len(score.recommendations) > 0

    def test_analyze_low_quality_image(self, analyzer, sample_image_low_quality):
        """Testa análise de imagem de baixa qualidade"""
        score = analyzer.analyze_image(sample_image_low_quality, exam_type='fundoscopy')

        assert isinstance(score, WingsAIScore)
        assert 0 <= score.global_score <= 100
        # Imagem de baixa qualidade deve ter score baixo
        assert score.global_score < 70
        assert score.ml_readiness in ['fair', 'poor']

    def test_dimension_scores_range(self, analyzer, sample_image_high_quality):
        """Testa se todos os scores de dimensão estão no range correto"""
        score = analyzer.analyze_image(sample_image_high_quality)

        for dim, value in score.dimension_scores.items():
            assert 0 <= value <= 100, f"Dimension {dim} score out of range: {value}"

    def test_different_exam_types(self, analyzer, sample_image_high_quality):
        """Testa análise com diferentes tipos de exame"""
        exam_types = ['fundoscopy', 'oct', 'angiography']

        for exam_type in exam_types:
            score = analyzer.analyze_image(sample_image_high_quality, exam_type=exam_type)
            assert isinstance(score, WingsAIScore)
            # Scores podem variar por tipo de exame devido a pesos diferentes
            assert 0 <= score.global_score <= 100

    def test_sharpness_analysis(self, analyzer):
        """Testa análise de nitidez especificamente"""
        # Imagem sharp
        sharp_image = np.random.rand(512, 512)
        sharp_image[100:150, 100:150] = 1.0  # Bordas definidas

        # Imagem blur
        from scipy.ndimage import gaussian_filter
        blurred_image = gaussian_filter(sharp_image.copy(), sigma=5)

        sharp_score = analyzer._analyze_sharpness(sharp_image)
        blur_score = analyzer._analyze_sharpness(blurred_image)

        # Imagem sharp deve ter score maior
        assert sharp_score > blur_score
        assert 0 <= sharp_score <= 100
        assert 0 <= blur_score <= 100

    def test_exposure_analysis(self, analyzer):
        """Testa análise de exposição"""
        # Imagem bem exposta
        good_exposure = np.ones((512, 512)) * 0.5

        # Imagem super exposta
        overexposed = np.ones((512, 512)) * 0.95

        # Imagem sub exposta
        underexposed = np.ones((512, 512)) * 0.05

        good_score = analyzer._analyze_exposure(good_exposure)
        over_score = analyzer._analyze_exposure(overexposed)
        under_score = analyzer._analyze_exposure(underexposed)

        # Boa exposição deve ter melhor score
        assert good_score > over_score
        assert good_score > under_score

    def test_contrast_analysis(self, analyzer):
        """Testa análise de contraste"""
        # Alto contraste
        high_contrast = np.zeros((512, 512))
        high_contrast[::2, ::2] = 1.0

        # Baixo contraste
        low_contrast = np.ones((512, 512)) * 0.5

        high_score = analyzer._analyze_contrast(high_contrast)
        low_score = analyzer._analyze_contrast(low_contrast)

        # Alto contraste deve ter melhor score
        assert high_score > low_score

    def test_noise_analysis(self, analyzer):
        """Testa análise de ruído"""
        np.random.seed(42)

        # Imagem limpa
        clean_image = np.ones((512, 512)) * 0.5

        # Imagem ruidosa
        noisy_image = clean_image + np.random.normal(0, 0.2, clean_image.shape)
        noisy_image = np.clip(noisy_image, 0, 1)

        clean_score = analyzer._analyze_noise(clean_image)
        noisy_score = analyzer._analyze_noise(noisy_image)

        # Imagem limpa deve ter melhor score
        assert clean_score > noisy_score

    def test_artifacts_detection(self, analyzer):
        """Testa detecção de artifacts"""
        # Imagem sem artifacts
        clean_image = np.ones((512, 512)) * 0.5

        # Imagem com saturação
        saturated_image = clean_image.copy()
        saturated_image[100:200, 100:200] = 1.0

        clean_score = analyzer._detect_artifacts(clean_image)
        artifact_score = analyzer._detect_artifacts(saturated_image)

        # Imagem limpa deve ter melhor score
        assert clean_score >= artifact_score

    def test_ml_readiness_classification(self, analyzer):
        """Testa classificação de ML readiness"""
        # Score excelente
        excellent_scores = {
            'sharpness': 90,
            'exposure': 85,
            'contrast': 88,
            'noise_level': 92,
            'artifacts': 90,
            'clinical_adequacy': 87
        }

        # Score pobre
        poor_scores = {
            'sharpness': 30,
            'exposure': 25,
            'contrast': 35,
            'noise_level': 20,
            'artifacts': 30,
            'clinical_adequacy': 28
        }

        excellent_readiness = analyzer._assess_ml_readiness(90, excellent_scores)
        poor_readiness = analyzer._assess_ml_readiness(30, poor_scores)

        assert excellent_readiness in ['excellent', 'good']
        assert poor_readiness == 'poor'

    def test_clinical_adequacy_classification(self, analyzer):
        """Testa classificação de adequação clínica"""
        # Adequado para diagnóstico
        diagnostic_scores = {
            'sharpness': 85,
            'exposure': 80,
            'contrast': 82,
            'noise_level': 85,
            'artifacts': 88,
            'clinical_adequacy': 85
        }

        # Inadequado
        inadequate_scores = {
            'sharpness': 40,
            'exposure': 35,
            'contrast': 38,
            'noise_level': 42,
            'artifacts': 40,
            'clinical_adequacy': 35
        }

        diagnostic = analyzer._classify_clinical_adequacy(85, diagnostic_scores)
        inadequate = analyzer._classify_clinical_adequacy(40, inadequate_scores)

        assert diagnostic in ['diagnostic', 'screening']
        assert inadequate == 'inadequate'

    def test_recommendations_generation(self, analyzer):
        """Testa geração de recomendações"""
        # Scores baixos em dimensões específicas
        poor_sharpness_scores = {
            'sharpness': 50,
            'exposure': 80,
            'contrast': 75,
            'noise_level': 80,
            'artifacts': 85,
            'clinical_adequacy': 70
        }

        recommendations = analyzer._generate_recommendations(
            poor_sharpness_scores,
            'fundoscopy'
        )

        assert len(recommendations) > 0
        # Deve recomendar algo sobre nitidez
        assert any('nitidez' in rec.lower() or 'foco' in rec.lower()
                  for rec in recommendations)

    def test_confidence_calculation(self, analyzer, sample_image_high_quality):
        """Testa cálculo de confidence"""
        # Scores consistentes devem ter alta confidence
        consistent_scores = {
            'sharpness': 85,
            'exposure': 82,
            'contrast': 87,
            'noise_level': 84,
            'artifacts': 86,
            'clinical_adequacy': 83
        }

        # Scores inconsistentes devem ter baixa confidence
        inconsistent_scores = {
            'sharpness': 90,
            'exposure': 30,
            'contrast': 85,
            'noise_level': 25,
            'artifacts': 88,
            'clinical_adequacy': 75
        }

        consistent_conf = analyzer._calculate_confidence(
            consistent_scores,
            sample_image_high_quality
        )
        inconsistent_conf = analyzer._calculate_confidence(
            inconsistent_scores,
            sample_image_high_quality
        )

        assert 0 <= consistent_conf <= 100
        assert 0 <= inconsistent_conf <= 100
        assert consistent_conf > inconsistent_conf


class TestAnalyzeImageQuality:
    """Testes para a função helper analyze_image_quality"""

    def test_function_interface(self):
        """Testa interface da função principal"""
        np.random.seed(42)
        test_image = np.random.rand(512, 512)

        score = analyze_image_quality(test_image)

        assert isinstance(score, WingsAIScore)
        assert score.global_score >= 0
        assert score.confidence >= 0

    def test_with_metadata(self):
        """Testa análise com metadata"""
        test_image = np.random.rand(512, 512)
        metadata = {
            'patient_id': 'TEST001',
            'exam_date': '2025-10-08',
            'device': 'Test Device'
        }

        score = analyze_image_quality(test_image, metadata=metadata)

        assert score.metadata == metadata


class TestQualityDimension:
    """Testes para enum QualityDimension"""

    def test_dimensions_exist(self):
        """Testa se todas as dimensões esperadas existem"""
        expected_dimensions = [
            'SHARPNESS',
            'EXPOSURE',
            'CONTRAST',
            'NOISE_LEVEL',
            'ARTIFACTS',
            'CLINICAL_ADEQUACY'
        ]

        for dim in expected_dimensions:
            assert hasattr(QualityDimension, dim)


class TestEdgeCases:
    """Testes para casos extremos"""

    @pytest.fixture
    def analyzer(self):
        return WingsAIQualityAnalyzer()

    def test_empty_image(self, analyzer):
        """Testa com imagem vazia (todos zeros)"""
        empty_image = np.zeros((512, 512))
        score = analyzer.analyze_image(empty_image)

        assert isinstance(score, WingsAIScore)
        assert 0 <= score.global_score <= 100

    def test_saturated_image(self, analyzer):
        """Testa com imagem saturada (todos uns)"""
        saturated_image = np.ones((512, 512))
        score = analyzer.analyze_image(saturated_image)

        assert isinstance(score, WingsAIScore)
        # Deve detectar baixa qualidade
        assert score.global_score < 80

    def test_very_small_image(self, analyzer):
        """Testa com imagem muito pequena"""
        tiny_image = np.random.rand(64, 64)
        score = analyzer.analyze_image(tiny_image)

        assert isinstance(score, WingsAIScore)

    def test_very_large_image(self, analyzer):
        """Testa com imagem grande"""
        large_image = np.random.rand(2048, 2048)
        score = analyzer.analyze_image(large_image)

        assert isinstance(score, WingsAIScore)

    def test_rectangular_image(self, analyzer):
        """Testa com imagem retangular (não quadrada)"""
        rect_image = np.random.rand(512, 1024)
        score = analyzer.analyze_image(rect_image)

        assert isinstance(score, WingsAIScore)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
