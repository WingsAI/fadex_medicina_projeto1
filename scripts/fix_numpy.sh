#!/bin/bash

# WingsAI - Script de Correção Rápida do NumPy
# Resolve incompatibilidade NumPy 2.x com PyTorch/OpenCV

echo "======================================"
echo "🔧 WingsAI - Correção NumPy"
echo "======================================"
echo ""

# Verifica versão atual
echo "📊 Verificando versão atual do NumPy..."
NUMPY_VERSION=$(python3 -c "import numpy; print(numpy.__version__)" 2>/dev/null || echo "não instalado")
echo "   Versão atual: $NUMPY_VERSION"
echo ""

# Se for NumPy 2.x, precisa corrigir
if [[ $NUMPY_VERSION == 2.* ]]; then
    echo "⚠️  NumPy 2.x detectado - incompatível com PyTorch/OpenCV"
    echo ""
    echo "🔄 Aplicando correção..."
    echo ""

    # Desinstala NumPy 2.x
    echo "1️⃣  Removendo NumPy 2.x..."
    pip uninstall numpy -y -q

    # Instala NumPy 1.x
    echo "2️⃣  Instalando NumPy 1.x compatível..."
    pip install "numpy>=1.24.0,<2.0.0" -q

    # Reinstala dependências
    echo "3️⃣  Reinstalando dependências..."
    pip install -r requirements-minimal.txt --force-reinstall -q

    echo ""
    echo "✅ Correção aplicada!"

elif [[ $NUMPY_VERSION == 1.* ]]; then
    echo "✅ NumPy 1.x já instalado - versão compatível"
    echo "   Nenhuma ação necessária"

else
    echo "❌ NumPy não instalado"
    echo ""
    echo "📦 Instalando dependências..."
    pip install -r requirements-minimal.txt -q
    echo "✅ Dependências instaladas!"
fi

echo ""
echo "======================================"
echo "🧪 Testando Instalação"
echo "======================================"
echo ""

# Testa imports
echo "Testando imports..."
python3 << EOF
import sys
try:
    import numpy
    print(f"✅ NumPy {numpy.__version__}")

    import cv2
    print(f"✅ OpenCV {cv2.__version__}")

    import scipy
    print(f"✅ SciPy {scipy.__version__}")

    from skimage import __version__ as skimage_version
    print(f"✅ scikit-image {skimage_version}")

    print("\n🎉 Todas as dependências OK!")

except ImportError as e:
    print(f"❌ Erro: {e}")
    print("\nExecute: pip install -r requirements-minimal.txt")
    sys.exit(1)
EOF

RESULT=$?

if [ $RESULT -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "✅ Correção Completa!"
    echo "======================================"
    echo ""
    echo "Próximos passos:"
    echo "  1. python3 scripts/test_wingsai.py examples/fundus_high_quality.png"
    echo "  2. python3 scripts/test_wingsai.py examples/ --batch"
    echo ""
else
    echo ""
    echo "======================================"
    echo "❌ Algo deu errado"
    echo "======================================"
    echo ""
    echo "Tente manualmente:"
    echo "  pip install 'numpy<2' --force-reinstall"
    echo "  pip install -r requirements-minimal.txt"
    echo ""
fi
