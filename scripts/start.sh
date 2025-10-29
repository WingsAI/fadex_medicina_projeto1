#!/bin/bash

# WingsAI - Script de Inicialização Rápida
# Execute: ./start.sh

echo "======================================"
echo "🏥 WingsAI - Sistema de Análise de Qualidade"
echo "======================================"
echo ""

# Verifica Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.9+"
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"
echo ""

# Pergunta modo de execução
echo "Escolha o modo de execução:"
echo "1) Teste Local (rápido - apenas algoritmo)"
echo "2) API + Frontend (completo - desenvolvimento)"
echo "3) Docker (produção)"
echo ""
read -p "Opção [1-3]: " option

case $option in
    1)
        echo ""
        echo "🚀 Modo: Teste Local"
        echo "━━━━━━━━━━━━━━━━━━━━"
        echo ""

        # Verifica se venv existe
        if [ ! -d "venv" ]; then
            echo "Criando ambiente virtual..."
            python3 -m venv venv
        fi

        # Ativa venv
        source venv/bin/activate

        # Instala dependências mínimas
        echo "Instalando dependências..."
        pip install -q -r requirements-minimal.txt

        # Gera imagens se não existirem
        if [ ! -d "examples" ]; then
            echo "Gerando imagens de teste..."
            python scripts/create_test_images.py
        fi

        # Execute análise
        echo ""
        echo "Executando análise em batch..."
        python scripts/test_wingsai.py examples/ --batch

        echo ""
        echo "✅ Análise concluída!"
        echo "📊 Veja resultados em: results/"
        ;;

    2)
        echo ""
        echo "🚀 Modo: API + Frontend"
        echo "━━━━━━━━━━━━━━━━━━━━"
        echo ""

        # Verifica se venv existe
        if [ ! -d "venv" ]; then
            echo "Criando ambiente virtual..."
            python3 -m venv venv
        fi

        # Ativa venv
        source venv/bin/activate

        # Instala dependências completas
        echo "Instalando dependências..."
        pip install -q -r requirements.txt

        # Gera imagens se não existirem
        if [ ! -d "examples" ]; then
            echo "Gerando imagens de teste..."
            python scripts/create_test_images.py
        fi

        echo ""
        echo "🌐 Iniciando API..."
        echo "📍 API: http://localhost:8000"
        echo "📚 Docs: http://localhost:8000/docs"
        echo ""
        echo "💡 Abra outro terminal e execute:"
        echo "   cd src/frontend && python -m http.server 3000"
        echo "   Depois acesse: http://localhost:3000"
        echo ""
        echo "⌨️  Pressione CTRL+C para parar"
        echo ""

        # Inicia API
        python src/backend/main.py
        ;;

    3)
        echo ""
        echo "🚀 Modo: Docker"
        echo "━━━━━━━━━━━━━━━━━━━━"
        echo ""

        # Verifica Docker
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker não encontrado. Instale Docker Desktop."
            exit 1
        fi

        echo "🐳 Iniciando containers..."
        docker-compose up --build

        echo ""
        echo "✅ Sistema iniciado!"
        echo "📍 API: http://localhost:8000"
        echo "🌐 Frontend: http://localhost:3000"
        ;;

    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac
