#!/usr/bin/env python3
"""
WingsAI - Script de Teste da API
Testa endpoints da API REST
"""

import requests
import json
from pathlib import Path
import sys


class FadexAPITester:
    """Testa API WingsAI"""

    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url

    def test_health(self):
        """Testa endpoint de health check"""
        print("\n🏥 Testando Health Check...")
        try:
            response = requests.get(f"{self.base_url}/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ API está saudável!")
                print(f"   Status: {data['status']}")
                print(f"   Timestamp: {data['timestamp']}")
                return True
            else:
                print(f"❌ Health check falhou: {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            print(f"❌ Não foi possível conectar à API em {self.base_url}")
            print(f"   Certifique-se de que o servidor está rodando:")
            print(f"   python src/backend/main.py")
            return False

    def test_root(self):
        """Testa endpoint raiz"""
        print("\n📋 Testando Endpoint Raiz...")
        response = requests.get(f"{self.base_url}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Endpoint raiz OK")
            print(f"   Nome: {data['name']}")
            print(f"   Versão: {data['version']}")
            return True
        return False

    def test_info(self):
        """Testa endpoint de informações"""
        print("\n📊 Testando Endpoint Info...")
        response = requests.get(f"{self.base_url}/api/v1/info")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Info endpoint OK")
            print(f"   Algoritmo: {data['algorithm']}")
            print(f"   Formatos suportados: {', '.join(data['supported_formats'])}")
            print(f"   Tipos de exame: {', '.join(data['supported_exam_types'])}")
            return True
        return False

    def test_analyze_single(self, image_path: str, exam_type: str = "fundoscopy"):
        """Testa análise de imagem única"""
        print(f"\n🔬 Testando Análise de Imagem: {Path(image_path).name}")

        if not Path(image_path).exists():
            print(f"❌ Arquivo não encontrado: {image_path}")
            return False

        try:
            with open(image_path, 'rb') as f:
                files = {'file': (Path(image_path).name, f, 'image/png')}
                data = {'exam_type': exam_type}

                response = requests.post(
                    f"{self.base_url}/api/v1/analyze",
                    files=files,
                    data=data
                )

            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    r = result['result']
                    print(f"✅ Análise concluída com sucesso!")
                    print(f"\n📊 Resultados:")
                    print(f"   Score Global: {r['global_score']:.1f}/100")
                    print(f"   Confiança: {r['confidence']:.1f}%")
                    print(f"   ML Readiness: {r['ml_readiness'].upper()}")
                    print(f"   Adequação Clínica: {r['clinical_adequacy'].upper()}")

                    print(f"\n   Dimensões:")
                    for dim, score in r['dimension_scores'].items():
                        print(f"     • {dim}: {score:.1f}")

                    print(f"\n   Recomendações:")
                    for i, rec in enumerate(r['recommendations'], 1):
                        print(f"     {i}. {rec}")

                    return True
            else:
                print(f"❌ Erro na análise: {response.status_code}")
                print(f"   {response.text}")
                return False

        except Exception as e:
            print(f"❌ Erro ao testar análise: {e}")
            return False

    def test_analyze_batch(self, images_dir: str, pattern: str = "*.png"):
        """Testa análise em batch"""
        print(f"\n📦 Testando Análise em Batch...")

        images_path = Path(images_dir)
        image_files = list(images_path.glob(pattern))[:5]  # Limita a 5 para teste

        if not image_files:
            print(f"❌ Nenhuma imagem encontrada em {images_dir}")
            return False

        print(f"   Analisando {len(image_files)} imagens...")

        try:
            files = []
            for img_file in image_files:
                files.append(
                    ('files', (img_file.name, open(img_file, 'rb'), 'image/png'))
                )

            data = {'exam_type': 'fundoscopy'}

            response = requests.post(
                f"{self.base_url}/api/v1/analyze/batch",
                files=files,
                data=data
            )

            # Fecha arquivos
            for _, (_, f, _) in files:
                f.close()

            if response.status_code == 200:
                result = response.json()
                stats = result['statistics']

                print(f"✅ Análise em batch concluída!")
                print(f"\n📊 Estatísticas:")
                print(f"   Total: {stats['total_images']}")
                print(f"   Sucesso: {stats['successful']}")
                print(f"   Falhas: {stats['failed']}")

                if stats['successful'] > 0:
                    print(f"   Score Médio: {stats['mean_score']:.1f}")
                    print(f"   Desvio Padrão: {stats['std_score']:.1f}")
                    print(f"   Range: {stats['min_score']:.1f} - {stats['max_score']:.1f}")

                    print(f"\n   Resultados por imagem:")
                    for r in result['results'][:3]:  # Mostra primeiras 3
                        print(f"     • {r['filename']}: {r['global_score']:.1f} ({r['ml_readiness']})")

                return True
            else:
                print(f"❌ Erro no batch: {response.status_code}")
                return False

        except Exception as e:
            print(f"❌ Erro ao testar batch: {e}")
            return False


def main():
    """Função principal"""

    print("="*60)
    print("🧪 WingsAI API - Testes Automatizados")
    print("="*60)

    # Inicializa tester
    tester = FadexAPITester()

    # Testes básicos
    tests_passed = 0
    tests_total = 0

    # 1. Health Check
    tests_total += 1
    if tester.test_health():
        tests_passed += 1
    else:
        print("\n⚠️  API não está rodando. Inicie com:")
        print("   python src/backend/main.py")
        return

    # 2. Root endpoint
    tests_total += 1
    if tester.test_root():
        tests_passed += 1

    # 3. Info endpoint
    tests_total += 1
    if tester.test_info():
        tests_passed += 1

    # 4. Análise de imagem única
    examples_dir = Path("examples")
    if examples_dir.exists():
        example_images = list(examples_dir.glob("fundus_*.png"))

        if example_images:
            tests_total += 1
            if tester.test_analyze_single(str(example_images[0])):
                tests_passed += 1

            # 5. Análise em batch
            tests_total += 1
            if tester.test_analyze_batch("examples"):
                tests_passed += 1
        else:
            print("\n⚠️  Imagens de exemplo não encontradas")
            print("   Execute: python scripts/create_test_images.py")
    else:
        print("\n⚠️  Diretório examples/ não encontrado")
        print("   Execute: python scripts/create_test_images.py")

    # Resumo
    print("\n" + "="*60)
    print("📊 RESUMO DOS TESTES")
    print("="*60)
    print(f"✅ Passou: {tests_passed}/{tests_total}")
    print(f"❌ Falhou: {tests_total - tests_passed}/{tests_total}")

    if tests_passed == tests_total:
        print("\n🎉 Todos os testes passaram! API funcionando perfeitamente.")
    else:
        print("\n⚠️  Alguns testes falharam. Verifique os logs acima.")

    print("="*60)


if __name__ == "__main__":
    main()
