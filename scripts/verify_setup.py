#!/usr/bin/env python3
"""
FADEX - Script de Verificação de Setup
Verifica se todos os componentes estão prontos para uso
"""

import sys
import os
from pathlib import Path
import importlib.util


class SetupVerifier:
    """Verifica setup do FADEX"""

    def __init__(self):
        self.checks_passed = 0
        self.checks_total = 0
        self.warnings = []

    def check(self, name: str, condition: bool, error_msg: str = "", warning: bool = False):
        """Executa uma verificação"""
        self.checks_total += 1
        if condition:
            print(f"✅ {name}")
            self.checks_passed += 1
            return True
        else:
            if warning:
                print(f"⚠️  {name} (opcional)")
                self.warnings.append(error_msg)
            else:
                print(f"❌ {name}")
                if error_msg:
                    print(f"   {error_msg}")
            return False

    def verify_python_version(self):
        """Verifica versão do Python"""
        version = sys.version_info
        is_valid = version.major == 3 and version.minor >= 9
        self.check(
            "Python 3.9+",
            is_valid,
            f"Python {version.major}.{version.minor} encontrado. Necessário 3.9+"
        )

    def verify_file_exists(self, filepath: str, description: str):
        """Verifica se arquivo existe"""
        exists = Path(filepath).exists()
        self.check(description, exists, f"Arquivo não encontrado: {filepath}")
        return exists

    def verify_directory_exists(self, dirpath: str, description: str, optional: bool = False):
        """Verifica se diretório existe"""
        exists = Path(dirpath).exists()
        self.check(
            description,
            exists,
            f"Diretório não encontrado: {dirpath}",
            warning=optional
        )
        return exists

    def verify_module(self, module_name: str, description: str, optional: bool = False):
        """Verifica se módulo Python está instalado"""
        try:
            spec = importlib.util.find_spec(module_name)
            exists = spec is not None
        except (ImportError, ModuleNotFoundError):
            exists = False

        self.check(
            description,
            exists,
            f"Execute: pip install {module_name}",
            warning=optional
        )
        return exists

    def verify_all(self):
        """Executa todas as verificações"""

        print("="*60)
        print("🔍 FADEX - Verificação de Setup")
        print("="*60)
        print()

        # 1. Python version
        print("📋 Verificando Ambiente Python...")
        self.verify_python_version()
        print()

        # 2. Core files
        print("📁 Verificando Arquivos Core...")
        self.verify_file_exists("src/ml/scoring/fadex_core.py", "Algoritmo FADEX")
        self.verify_file_exists("test_fadex.py", "Script de teste")
        self.verify_file_exists("create_test_images.py", "Gerador de imagens")
        self.verify_file_exists("requirements.txt", "Requirements completo")
        self.verify_file_exists("requirements-minimal.txt", "Requirements mínimo")
        print()

        # 3. Backend files
        print("🔧 Verificando Backend...")
        self.verify_file_exists("src/backend/main.py", "API FastAPI")
        self.verify_file_exists("test_api.py", "Testes da API")
        print()

        # 4. Frontend files
        print("🎨 Verificando Frontend...")
        self.verify_file_exists("src/frontend/index.html", "Interface Web")
        print()

        # 5. Docker files
        print("🐳 Verificando Docker...")
        self.verify_file_exists("Dockerfile", "Dockerfile")
        self.verify_file_exists("docker-compose.yml", "Docker Compose")
        print()

        # 6. Documentation
        print("📚 Verificando Documentação...")
        self.verify_file_exists("README.md", "README principal")
        self.verify_file_exists("QUICKSTART.md", "Guia rápido")
        self.verify_file_exists("SETUP.md", "Guia de setup")
        self.verify_file_exists("MVP_SUMMARY.md", "Resumo do MVP")
        print()

        # 7. Tests
        print("🧪 Verificando Testes...")
        self.verify_file_exists("tests/test_fadex_core.py", "Testes unitários")
        print()

        # 8. Dependencies - Core (required)
        print("📦 Verificando Dependências Core (obrigatórias)...")
        self.verify_module("numpy", "NumPy")
        self.verify_module("cv2", "OpenCV (opencv-python)")
        self.verify_module("scipy", "SciPy")
        self.verify_module("skimage", "scikit-image")
        print()

        # 9. Dependencies - Optional
        print("📦 Verificando Dependências Opcionais...")
        self.verify_module("torch", "PyTorch", optional=True)
        self.verify_module("fastapi", "FastAPI", optional=True)
        self.verify_module("pytest", "pytest", optional=True)
        print()

        # 10. Generated directories (optional)
        print("📂 Verificando Diretórios Gerados (opcionais)...")
        has_examples = self.verify_directory_exists("examples", "Imagens de teste", optional=True)
        has_results = self.verify_directory_exists("results", "Resultados", optional=True)
        print()

        # Suggestions
        if not has_examples:
            print("💡 Execute: python create_test_images.py")
        if not has_results:
            print("💡 Diretório results/ será criado automaticamente na primeira execução")
        print()

        # Summary
        print("="*60)
        print("📊 RESUMO DA VERIFICAÇÃO")
        print("="*60)

        percentage = (self.checks_passed / self.checks_total) * 100
        print(f"✅ Passou: {self.checks_passed}/{self.checks_total} ({percentage:.0f}%)")

        if self.warnings:
            print(f"⚠️  Avisos: {len(self.warnings)} (componentes opcionais)")

        print()

        if self.checks_passed == self.checks_total:
            print("🎉 SETUP COMPLETO! Sistema pronto para uso.")
            print()
            print("Próximos passos:")
            print("  1. python create_test_images.py  # Gera imagens de teste")
            print("  2. python test_fadex.py examples/ --batch  # Testa algoritmo")
            print("  3. python src/backend/main.py  # Inicia API")
            print("  4. Abra src/frontend/index.html no navegador")
            return True

        elif percentage >= 80:
            print("⚠️  Setup quase completo. Alguns componentes opcionais faltando.")
            print()
            print("Para setup mínimo funcional:")
            print("  pip install -r requirements-minimal.txt")
            print()
            print("Para setup completo:")
            print("  pip install -r requirements.txt")
            return True

        else:
            print("❌ Setup incompleto. Instale as dependências necessárias:")
            print("  pip install -r requirements-minimal.txt")
            return False


def main():
    """Função principal"""
    verifier = SetupVerifier()
    success = verifier.verify_all()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
