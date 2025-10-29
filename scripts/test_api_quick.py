#!/usr/bin/env python3
"""
WingsAI - Script de Teste Rápido da API
Diagnostica problemas na API sem precisar do frontend
"""

import requests
import sys


def test_api():
    """Testa API WingsAI rapidamente"""

    base_url = "http://localhost:8000"

    print("="*60)
    print("🧪 WingsAI API - Teste Rápido de Diagnóstico")
    print("="*60)
    print()

    # Teste 1: Health Check
    print("1️⃣  Testando Health Check...")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("   ✅ Health check OK")
            print(f"   Response: {response.json()}")
        else:
            print(f"   ❌ Status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Não conectou à API em {base_url}")
        print(f"   💡 Inicie a API: python3 src/backend/main.py")
        return False
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

    print()

    # Teste 2: Debug Endpoint
    print("2️⃣  Testando Debug Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/v1/debug", timeout=30)
        data = response.json()

        if response.status_code == 200 and data.get('success'):
            print("   ✅ Algoritmo funcionando")
            print(f"   Score teste: {data['test_result']['global_score']}")
            print(f"   ML Readiness: {data['test_result']['ml_readiness']}")
        else:
            print(f"   ❌ Debug falhou")
            print(f"   Response: {data}")
            if 'error' in data:
                print(f"   Erro: {data['error']}")
            return False
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

    print()

    # Teste 3: Upload de Imagem (se houver examples/)
    print("3️⃣  Testando Upload de Imagem...")
    from pathlib import Path
    examples = list(Path("examples").glob("*.png")) if Path("examples").exists() else []

    if not examples:
        print("   ⚠️  Sem imagens em examples/ para testar")
        print("   💡 Execute: python3 scripts/create_test_images.py")
        print()
        print("="*60)
        print("✅ API funcionando (2/3 testes OK)")
        print("="*60)
        return True

    test_image = examples[0]
    print(f"   Usando: {test_image.name}")

    try:
        with open(test_image, 'rb') as f:
            files = {'file': (test_image.name, f, 'image/png')}
            data = {'exam_type': 'fundoscopy'}

            response = requests.post(
                f"{base_url}/api/v1/analyze",
                files=files,
                data=data,
                timeout=60
            )

        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                score = result['result']['global_score']
                print(f"   ✅ Upload e análise OK")
                print(f"   Score: {score:.1f}/100")
                print(f"   ML Readiness: {result['result']['ml_readiness']}")
            else:
                print(f"   ❌ Análise falhou")
                print(f"   Response: {result}")
                return False
        else:
            print(f"   ❌ Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False

    except Exception as e:
        print(f"   ❌ Erro: {e}")
        import traceback
        print(f"   Traceback: {traceback.format_exc()}")
        return False

    print()
    print("="*60)
    print("🎉 TODOS OS TESTES PASSARAM!")
    print("="*60)
    print()
    print("✅ API funcionando perfeitamente")
    print("✅ Algoritmo operacional")
    print("✅ Upload e processamento OK")
    print()
    print("Próximo passo:")
    print("  Abra src/frontend/index.html no navegador")
    print("  e teste o upload via interface")
    print()

    return True


if __name__ == "__main__":
    success = test_api()
    sys.exit(0 if success else 1)
