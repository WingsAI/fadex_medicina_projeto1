# 🔧 FADEX - Solução de Problemas

Guia rápido para resolver problemas comuns.

---

## 🚨 Problema: NumPy 2.x Incompatível

### Sintomas
```
A module that was compiled using NumPy 1.x cannot be run in NumPy 2.2.6
```

ou

```
cv2.error: OpenCV(4.12.0) ... Unsupported combination of source format
```

### ✅ Solução Automática (Recomendada)

```bash
./scripts/fix_numpy.sh
```

### ✅ Solução Manual

```bash
pip uninstall numpy -y
pip install "numpy<2"
pip install -r requirements-minimal.txt --force-reinstall
```

📖 Detalhes: [FIX_NUMPY.md](FIX_NUMPY.md)

---

## 🚨 Problema: Module not found 'ml'

### Sintomas
```
ModuleNotFoundError: No module named 'ml'
```

### ✅ Solução

Você está executando de dentro da pasta `scripts/`. Execute da raiz:

```bash
cd ..  # Volta para a raiz do projeto
python3 scripts/test_fadex.py examples/ --batch
```

**Sempre execute scripts da raiz do projeto!**

---

## 🚨 Problema: No images found

### Sintomas
```
❌ Nenhuma imagem encontrada em examples/
```

### ✅ Solução

```bash
python3 scripts/create_test_images.py
```

---

## 🚨 Problema: API não conecta

### Sintomas
```
❌ Não foi possível conectar à API em http://localhost:8000
```

### ✅ Solução

A API não está rodando. Em outro terminal:

```bash
python3 src/backend/main.py
```

Depois teste novamente:

```bash
python3 scripts/test_api.py
```

---

## 🚨 Problema: Permission denied

### Sintomas
```
-bash: ./scripts/start.sh: Permission denied
```

### ✅ Solução

```bash
chmod +x scripts/*.sh
./scripts/start.sh
```

---

## 🚨 Problema: torch import error

### Sintomas
```
ImportError: cannot import name '_C' from 'torch'
```

### ✅ Solução

PyTorch corrompido. Reinstale:

```bash
pip uninstall torch torchvision -y
pip install torch torchvision
```

---

## 🚨 Problema: opencv-python não funciona

### Sintomas
```
ImportError: libGL.so.1: cannot open shared object file
```

### ✅ Solução (Linux)

```bash
sudo apt-get install libgl1-mesa-glx libglib2.0-0
```

### ✅ Solução (macOS)

```bash
brew install opencv
```

### ✅ Solução (Windows)

Reinstale opencv-python:

```bash
pip uninstall opencv-python -y
pip install opencv-python-headless
```

---

## 🚨 Problema: Script congela/demora muito

### Sintomas
Script não responde ou leva mais de 30s por imagem.

### ✅ Solução

1. **Imagens muito grandes**: Redimensione para máximo 1024x1024px
2. **CPU lenta**: Normal levar 3-5s por imagem
3. **Sem GPU**: PyTorch usa CPU por padrão (mais lento mas funciona)

Para melhorar performance:
```bash
# Instale versão CPU otimizada do PyTorch
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

---

## 🚨 Problema: Docker build falha

### Sintomas
```
ERROR: failed to solve: process "/bin/sh -c pip install..." did not complete
```

### ✅ Solução

Limpe cache do Docker:

```bash
docker system prune -a
docker-compose build --no-cache
```

---

## 🚨 Problema: Importação no Python falha

### Sintomas
```python
from src.ml.scoring.fadex_core import analyze_image_quality
ImportError: No module named 'src'
```

### ✅ Solução

Use imports relativos ou adicione ao path:

```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / 'src'))

from ml.scoring.fadex_core import analyze_image_quality
```

---

## 🚨 Problema: Results directory não existe

### Sintomas
```
FileNotFoundError: [Errno 2] No such file or directory: 'results/'
```

### ✅ Solução

Será criado automaticamente. Ou crie manualmente:

```bash
mkdir results
```

---

## 🚨 Problema: Out of memory

### Sintomas
```
RuntimeError: [enforce fail at alloc_cpu.cpp:...] . DefaultCPUAllocator: can't allocate memory
```

### ✅ Solução

1. **Processe menos imagens por vez**:
```bash
python3 scripts/test_fadex.py examples/fundus_high_quality.png  # Uma por vez
```

2. **Reduza resolução das imagens**:
```python
import cv2
image = cv2.imread('image.png')
image = cv2.resize(image, (512, 512))  # Reduz para 512x512
```

---

## 🚨 Problema: Python version incompatível

### Sintomas
```
SyntaxError: invalid syntax
```

ou

```
requires Python >=3.9
```

### ✅ Solução

Atualize o Python:

```bash
# Verifique versão
python3 --version

# Deve ser 3.9+
# Se não, instale Python mais novo:
# macOS: brew install python@3.11
# Ubuntu: sudo apt install python3.11
# Windows: baixe do python.org
```

---

## 🔍 Diagnóstico Geral

Se nada funcionou, execute o diagnóstico completo:

```bash
python3 scripts/verify_setup.py
```

Isso verifica:
- ✅ Versão do Python
- ✅ Arquivos essenciais
- ✅ Dependências instaladas
- ✅ Estrutura de pastas

---

## 📞 Ainda Precisa de Ajuda?

### Checklist Antes de Pedir Ajuda

- [ ] Python 3.9+ instalado? (`python3 --version`)
- [ ] Dependências instaladas? (`pip list | grep numpy`)
- [ ] Executando da raiz? (`pwd` deve mostrar `.../fadex_medicina_projeto1`)
- [ ] Imagens de teste criadas? (`ls examples/`)
- [ ] Tentou `./scripts/fix_numpy.sh`?

### Como Reportar

Abra uma issue no GitHub com:

1. **Comando executado**:
```bash
python3 scripts/test_fadex.py examples/ --batch
```

2. **Erro completo** (últimas 20 linhas)

3. **Seu ambiente**:
```bash
python3 --version
pip list | grep -E "(numpy|opencv|torch)"
uname -a  # ou: systeminfo (Windows)
```

4. **O que já tentou**

---

## 📚 Documentação Adicional

- [START_HERE.md](docs/START_HERE.md) - Primeiro acesso
- [QUICKSTART.md](docs/QUICKSTART.md) - Guia rápido
- [SETUP.md](docs/SETUP.md) - Setup detalhado
- [FIX_NUMPY.md](FIX_NUMPY.md) - Problema específico do NumPy

---

**99% dos problemas são resolvidos com**:
1. `./scripts/fix_numpy.sh` (NumPy)
2. `python3 scripts/create_test_images.py` (Imagens)
3. Executar da raiz do projeto (imports)

Boa sorte! 🍀
