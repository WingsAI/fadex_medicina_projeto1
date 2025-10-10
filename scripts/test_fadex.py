#!/usr/bin/env python3
"""
FADEX - Script de Teste Standalone
Testa o algoritmo de scoring de qualidade sem necessidade de infraestrutura
"""

import sys
import os
import json
from pathlib import Path
import numpy as np
import cv2
from datetime import datetime
from typing import Optional

# Adiciona src ao path (subindo um nível de scripts/ para raiz, depois entrando em src/)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from ml.scoring.fadex_core import analyze_image_quality, FadexScore


class FadexTester:
    """Classe para facilitar testes do sistema FADEX"""

    def __init__(self, output_dir: str = "results"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

    def load_image(self, image_path: str) -> Optional[np.ndarray]:
        """Carrega imagem de arquivo"""
        try:
            image = cv2.imread(image_path)
            if image is None:
                print(f"❌ Erro ao carregar: {image_path}")
                return None

            # Converte BGR para RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            return image
        except Exception as e:
            print(f"❌ Erro ao carregar {image_path}: {e}")
            return None

    def analyze_single_image(
        self,
        image_path: str,
        exam_type: str = 'fundoscopy',
        save_results: bool = True
    ) -> Optional[FadexScore]:
        """Analisa uma única imagem"""

        print(f"\n{'='*60}")
        print(f"🔬 Analisando: {Path(image_path).name}")
        print(f"{'='*60}")

        # Carrega imagem
        image = self.load_image(image_path)
        if image is None:
            return None

        print(f"✓ Imagem carregada: {image.shape}")

        # Metadata
        metadata = {
            'filename': Path(image_path).name,
            'shape': image.shape,
            'exam_type': exam_type,
            'timestamp': datetime.now().isoformat()
        }

        # Análise FADEX
        print("⚙️  Executando análise FADEX...")
        score = analyze_image_quality(image, exam_type, metadata)

        # Exibe resultados
        self._print_results(score)

        # Salva resultados
        if save_results:
            self._save_results(score, Path(image_path).stem)

        return score

    def analyze_batch(
        self,
        images_dir: str,
        exam_type: str = 'fundoscopy',
        pattern: str = "*.png"
    ):
        """Analisa múltiplas imagens de um diretório"""

        images_path = Path(images_dir)
        image_files = list(images_path.glob(pattern))

        if not image_files:
            print(f"❌ Nenhuma imagem encontrada em {images_dir} com padrão {pattern}")
            return

        print(f"\n🔍 Encontradas {len(image_files)} imagens para análise")

        results = []
        for img_file in image_files:
            score = self.analyze_single_image(str(img_file), exam_type, save_results=True)
            if score:
                results.append({
                    'filename': img_file.name,
                    'global_score': score.global_score,
                    'ml_readiness': score.ml_readiness,
                    'clinical_adequacy': score.clinical_adequacy
                })

        # Salva resumo do batch
        self._save_batch_summary(results)

    def _print_results(self, score: FadexScore):
        """Imprime resultados formatados"""

        print(f"\n📊 RESULTADOS FADEX")
        print(f"{'─'*60}")

        # Score global com indicador visual
        score_bar = self._get_score_bar(score.global_score)
        print(f"🎯 Score Global: {score.global_score:.1f}/100 {score_bar}")
        print(f"🔍 Confiança: {score.confidence:.1f}%")
        print(f"🤖 ML Readiness: {score.ml_readiness.upper()}")
        print(f"🏥 Adequação Clínica: {score.clinical_adequacy.upper()}")

        # Scores por dimensão
        print(f"\n📈 Scores por Dimensão:")
        for dim, value in score.dimension_scores.items():
            bar = self._get_score_bar(value, width=20)
            print(f"  • {dim:20s}: {value:5.1f}/100 {bar}")

        # Recomendações
        print(f"\n💡 Recomendações:")
        for i, rec in enumerate(score.recommendations, 1):
            print(f"  {i}. {rec}")

        print(f"{'─'*60}\n")

    def _get_score_bar(self, score: float, width: int = 30) -> str:
        """Gera barra visual de score"""
        filled = int((score / 100) * width)
        empty = width - filled

        if score >= 85:
            color = "🟢"
        elif score >= 70:
            color = "🟡"
        elif score >= 50:
            color = "🟠"
        else:
            color = "🔴"

        bar = "█" * filled + "░" * empty
        return f"{color} [{bar}]"

    def _save_results(self, score: FadexScore, filename_base: str):
        """Salva resultados em JSON"""

        output_file = self.output_dir / f"{filename_base}_results.json"

        results_dict = {
            'global_score': score.global_score,
            'confidence': score.confidence,
            'ml_readiness': score.ml_readiness,
            'clinical_adequacy': score.clinical_adequacy,
            'dimension_scores': score.dimension_scores,
            'recommendations': score.recommendations,
            'metadata': score.metadata,
            'analysis_timestamp': datetime.now().isoformat()
        }

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results_dict, f, indent=2, ensure_ascii=False)

        print(f"💾 Resultados salvos em: {output_file}")

    def _save_batch_summary(self, results: list):
        """Salva resumo do batch"""

        output_file = self.output_dir / f"batch_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

        summary = {
            'total_images': len(results),
            'timestamp': datetime.now().isoformat(),
            'statistics': {
                'mean_score': np.mean([r['global_score'] for r in results]),
                'std_score': np.std([r['global_score'] for r in results]),
                'min_score': min([r['global_score'] for r in results]),
                'max_score': max([r['global_score'] for r in results]),
            },
            'ml_readiness_distribution': self._count_categories(results, 'ml_readiness'),
            'clinical_adequacy_distribution': self._count_categories(results, 'clinical_adequacy'),
            'results': results
        }

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)

        print(f"\n📊 Resumo do batch salvo em: {output_file}")
        print(f"\n📈 Estatísticas:")
        print(f"  • Score médio: {summary['statistics']['mean_score']:.1f}")
        print(f"  • Desvio padrão: {summary['statistics']['std_score']:.1f}")
        print(f"  • Range: {summary['statistics']['min_score']:.1f} - {summary['statistics']['max_score']:.1f}")

    def _count_categories(self, results: list, key: str) -> dict:
        """Conta distribuição de categorias"""
        counts = {}
        for r in results:
            category = r[key]
            counts[category] = counts.get(category, 0) + 1
        return counts


def main():
    """Função principal para testes via CLI"""

    print("="*60)
    print("🏥 FADEX - Sistema de Análise de Qualidade de Imagens")
    print("="*60)

    # Inicializa tester
    tester = FadexTester()

    # Verifica argumentos
    if len(sys.argv) < 2:
        print("\n📝 Uso:")
        print("  python scripts/test_fadex.py <imagem>              # Analisa uma imagem")
        print("  python scripts/test_fadex.py <diretório> --batch   # Analisa múltiplas imagens")
        print("\nExemplos:")
        print("  python scripts/test_fadex.py examples/fundus_01.png")
        print("  python scripts/test_fadex.py examples/ --batch")

        # Se não há argumentos, tenta usar imagens de exemplo
        examples_dir = Path("examples")
        if examples_dir.exists():
            print(f"\n💡 Encontrado diretório examples/, executando análise batch...")
            tester.analyze_batch("examples", pattern="*.png")
        else:
            print(f"\n⚠️  Diretório examples/ não encontrado. Crie imagens de teste primeiro.")
            print(f"    Execute: python scripts/create_test_images.py")

        return

    # Processa argumentos
    path = sys.argv[1]
    is_batch = "--batch" in sys.argv
    exam_type = "fundoscopy"  # Default

    # Verifica tipo de exame
    for arg in sys.argv:
        if arg.startswith("--exam="):
            exam_type = arg.split("=")[1]

    # Executa análise
    if is_batch:
        tester.analyze_batch(path, exam_type=exam_type)
    else:
        if not os.path.exists(path):
            print(f"❌ Arquivo não encontrado: {path}")
            return

        tester.analyze_single_image(path, exam_type=exam_type)


if __name__ == "__main__":
    main()
