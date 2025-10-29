# 🔧 SNPQIM - Solução de Problemas

Guia rápido e completo para resolver problemas nas três versões do sistema.

---

## 🎯 Navegação Rápida

- [Problemas no Webapp (Next.js)](#webapp-nextjs)
- [Problemas no Backend (FastAPI)](#backend-fastapi)
- [Problemas na CLI](#cli-linha-de-comando)
- [Problemas com Dependências](#dependências)

---

## 🌐 Webapp (Next.js)

### ❌ Erro: "Module not found: Can't resolve..."

**Sintoma**:
```
Module not found: Can't resolve '@/components/...'
```

**Solução**:
```bash
cd webapp
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### ❌ Erro: Porta 3000 em uso

**Sintoma**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solução**:
```bash
# Use porta alternativa
npm run dev -- -p 3001
```

### ❌ Build falha com erro de TypeScript

**Solução**:
```bash
cd webapp
npm run build -- --no-lint
```

Se persistir, verifique [tsconfig.json](webapp/tsconfig.json)

---

## 🔌 Backend (FastAPI)

### ❌ Erro 500 ao analisar imagem

**Sintoma**: API retorna erro 500 ao fazer POST em `/api/v1/analyze`

**Causa comum**: Problema com imports ou imagem inválida

**Solução**:
```bash
# 1. Teste o endpoint de debug
curl http://localhost:8000/api/v1/debug

# 2. Verifique logs do servidor
# Procure por stacktrace detalhado

# 3. Teste com imagem de teste válida
python scripts/create_test_images.py
python scripts/test_api.py
```

### ❌ ModuleNotFoundError: No module named 'ml'

**Sintoma**:
```
ModuleNotFoundError: No module named 'ml'
```

**Causa**: Executando de diretório errado

**Solução**:
```bash
# Sempre execute da raiz do projeto
cd /caminho/para/fadex_medicina_projeto1
python src/backend/main.py
```

### ❌ CORS Error no Frontend

**Sintoma**: Frontend não consegue fazer requisições

**Solução**: Backend já está configurado com CORS. Verifique se a URL está correta no frontend.

---

## 🖥️ CLI (Linha de Comando)

### ❌ Script não encontrado

**Sintoma**:
```
python: can't open file 'test_fadex.py'
```

**Solução**:
```bash
# Execute da raiz do projeto
cd /caminho/para/fadex_medicina_projeto1
python scripts/test_fadex.py examples/ --batch
```

### ❌ Nenhuma imagem encontrada

**Sintoma**: "No images found in directory"

**Solução**:
```bash
# Gere imagens de teste
python scripts/create_test_images.py

# Analise
python scripts/test_fadex.py examples/ --batch
```

---

## 📦 Dependências

### ❌ NumPy 2.x Incompatível com PyTorch

**Sintoma**:
```
A module that was compiled using NumPy 1.x cannot be run in NumPy 2.2.6
```

**Solução Automática**:
```bash
./scripts/fix_numpy.sh
```

**Solução Manual**:
```bash
pip uninstall numpy -y
pip install "numpy<2"
pip install -r requirements-minimal.txt --force-reinstall
```

### ❌ OpenCV Error: Unsupported format

**Sintoma**:
```
cv2.error: OpenCV(4.12.0) ... Unsupported combination of source format
```

**Causa**: NumPy 2.x incompatível

**Solução**: Mesma do NumPy acima

### ❌ Pillow/PIL Errors

**Solução**:
```bash
pip uninstall Pillow PIL -y
pip install Pillow==10.2.0
```

### ❌ Erro ao instalar PyTorch

**Sintoma**: Instalação falha ou muito lenta

**Solução**:
```bash
# Use apenas CPU (mais rápido)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Para GPU (CUDA)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

---

## 🐳 Docker

### ❌ Container não inicia

**Solução**:
```bash
# Reconstrua a imagem
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### ❌ Porta em uso

**Solução**: Edite `docker-compose.yml` para mudar portas

---

## 💡 Problemas Comuns Gerais

### ❌ Permissão Negada

**Linux/Mac**:
```bash
chmod +x scripts/*.sh
```

### ❌ Git line ending warnings

**Solução**: Configure git (Windows):
```bash
git config --global core.autocrlf true
```

### ❌ Python não encontrado

**Windows**: Use `python` ou `py`
**Linux/Mac**: Use `python3`

```bash
# Verifique versão
python --version
# Deve ser >= 3.9
```

---

## 🆘 Ainda com Problemas?

### Verificação Completa do Setup

Execute o script de verificação:
```bash
python scripts/verify_setup.py
```

Este script verifica:
- ✅ Versão do Python
- ✅ Dependências instaladas
- ✅ Estrutura de diretórios
- ✅ Permissões de arquivos

### Logs Detalhados

#### Backend
```bash
python src/backend/main.py 2>&1 | tee backend.log
```

#### CLI
```bash
python scripts/test_fadex.py examples/ --verbose > cli.log 2>&1
```

### Teste Rápido de Tudo

```bash
# 1. Teste dependências
python scripts/verify_setup.py

# 2. Teste algoritmo core
python scripts/test_fadex.py examples/ --batch

# 3. Teste API
python scripts/test_api_quick.py

# 4. Teste webapp
cd webapp && npm run build
```

---

## 📚 Documentação Adicional

- **Setup Inicial**: [docs/SETUP.md](docs/SETUP.md)
- **Guia Rápido**: [docs/QUICKSTART.md](docs/QUICKSTART.md)
- **Múltiplas Versões**: [VERSOES.md](VERSOES.md)
- **Início**: [docs/START_HERE.md](docs/START_HERE.md)

---

## 🔍 Debug Avançado

### Ativar Logs Detalhados

**Backend**:
```python
# Em src/backend/main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

**CLI**:
```bash
python scripts/test_fadex.py examples/ --verbose --debug
```

### Testar Componentes Isoladamente

```bash
# Teste apenas o algoritmo core
python -c "from src.ml.scoring.fadex_core import analyze_image_quality; print('OK')"

# Teste imports do webapp
cd webapp && npm run build -- --debug
```

---

**Última atualização**: Outubro 2025
**Versão**: 2.0 - Consolidado e atualizado para SNPQIM
