# 📦 Guia de Dependências - WingsAI

Este projeto possui diferentes arquivos `requirements.txt` para diferentes cenários de uso.

## 📋 Arquivos Disponíveis

### 1️⃣ `requirements.txt` - **Instalação Completa** ⭐

**Quando usar**: Desenvolvimento completo do projeto

**Inclui**:
- ✅ Algoritmo WingsAI (PyTorch, OpenCV, NumPy)
- ✅ Backend API (FastAPI, Uvicorn)
- ✅ Banco de dados (PostgreSQL, MongoDB, Redis)
- ✅ Processamento de dados (Pandas, PyArrow)
- ✅ Suporte DICOM (PyDICOM, NiBabel)
- ✅ Testes (Pytest, Coverage)
- ✅ Code Quality (Black, Flake8, MyPy)
- ✅ Monitoramento (Loguru, Sentry)

**Instalação**:
```bash
pip install -r requirements.txt
```

**Tamanho aproximado**: ~2GB de dependências

---

### 2️⃣ `requirements-backend.txt` - **Backend Essencial** 🎯

**Quando usar**: Rodar apenas o backend API + análise de imagens

**Inclui**:
- ✅ Algoritmo WingsAI (PyTorch, OpenCV, NumPy)
- ✅ Backend API (FastAPI, Uvicorn)
- ✅ Processamento de imagens

**NÃO inclui**:
- ❌ Bancos de dados
- ❌ Testes
- ❌ Code quality tools

**Instalação**:
```bash
pip install -r requirements-backend.txt
```

**Tamanho aproximado**: ~800MB de dependências

**Ideal para**:
- Desenvolvimento rápido do backend
- Deploy em produção (mínimo necessário)
- Testes de API

---

### 3️⃣ `requirements-minimal.txt` - **Algoritmo Core** ⚡

**Quando usar**: Testar apenas o algoritmo WingsAI sem API/Backend

**Inclui**:
- ✅ NumPy, OpenCV, SciPy
- ✅ PyTorch (para modelos ML)
- ✅ Matplotlib (para visualizações)

**NÃO inclui**:
- ❌ FastAPI/Uvicorn
- ❌ Bancos de dados
- ❌ Outros serviços

**Instalação**:
```bash
pip install -r requirements-minimal.txt
```

**Tamanho aproximado**: ~600MB de dependências

**Ideal para**:
- Testar o algoritmo core
- Desenvolvimento do motor de análise
- Scripts standalone
- Notebooks de análise

**Como usar**:
```bash
python scripts/test_wingsai.py examples/
```

---

### 4️⃣ `requirements-backend-py38.txt` - **Python 3.8** 🐍

**Quando usar**: Ambiente com Python 3.8 (compatibilidade legada)

**Diferenças**: Versões específicas compatíveis com Python 3.8
- SciPy <1.11.0 (versões mais novas requerem Python 3.9+)

**Instalação**:
```bash
pip install -r requirements-backend-py38.txt
```

**Nota**: Recomendamos usar Python 3.10+ sempre que possível.

---

## 🚀 Guia de Instalação Rápida

### Para Iniciantes (Testar Rápido)

```bash
# 1. Criar ambiente virtual
python -m venv venv

# 2. Ativar ambiente
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 3. Instalar dependências mínimas
pip install -r requirements-minimal.txt

# 4. Testar
python scripts/test_wingsai.py examples/
```

### Para Desenvolvimento do Backend

```bash
# 1. Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows

# 2. Instalar dependências do backend
pip install -r requirements-backend.txt

# 3. Rodar backend
python src/backend/main.py
```

### Para Desenvolvimento Completo

```bash
# 1. Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows

# 2. Instalar tudo
pip install -r requirements.txt

# 3. Rodar testes
pytest tests/

# 4. Rodar backend
python src/backend/main.py
```

---

## 🐳 Usando Docker (Recomendado)

Se preferir não gerenciar dependências manualmente:

```bash
# Subir tudo com Docker
docker-compose up

# Backend disponível em: http://localhost:8000
# Frontend disponível em: http://localhost:3000
```

---

## ⚠️ Problemas Comuns

### NumPy Incompatível

**Erro**: `numpy.dtype size changed`

**Solução**:
```bash
pip uninstall numpy -y
pip install "numpy<2.0.0"
```

### PyTorch muito grande

Se PyTorch (~2GB) é muito pesado para você:

**Opção 1**: Use versão CPU-only (menor)
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

**Opção 2**: Remova PyTorch temporariamente
- Edite o arquivo requirements e comente as linhas do torch
- Nota: Algumas funcionalidades ML avançadas não funcionarão

### Conflitos de Dependências

```bash
# Limpar e reinstalar
pip uninstall -y -r requirements.txt
pip install -r requirements.txt
```

---

## 📊 Comparação Rápida

| Arquivo | Tamanho | Backend | Algoritmo | Testes | DB | Ideal Para |
|---------|---------|---------|-----------|--------|-------|------------|
| `requirements.txt` | ~2GB | ✅ | ✅ | ✅ | ✅ | Desenvolvimento completo |
| `requirements-backend.txt` | ~800MB | ✅ | ✅ | ❌ | ❌ | Backend + API |
| `requirements-minimal.txt` | ~600MB | ❌ | ✅ | ❌ | ❌ | Algoritmo core |
| `requirements-backend-py38.txt` | ~800MB | ✅ | ✅ | ❌ | ❌ | Python 3.8 |

---

## 🔄 Atualizando Dependências

Para atualizar todas as dependências para as versões mais recentes:

```bash
pip install --upgrade -r requirements.txt
```

Para gerar um novo requirements com versões exatas:

```bash
pip freeze > requirements-lock.txt
```

---

## 📚 Mais Informações

- **Setup Rápido**: [docs/SETUP_RAPIDO.md](docs/SETUP_RAPIDO.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **Setup com Conda**: [docs/SETUP_CONDA.md](docs/SETUP_CONDA.md)

---

**Última Atualização**: Outubro 2025
**Versão**: 2.0
