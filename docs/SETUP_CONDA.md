# 🐍 Setup com Conda - SNPQIM

## ✅ Você já tem Conda? Perfeito!

Este guia é para quem usa **Anaconda** ou **Miniconda**.

---

## 🚀 Método 1: Usar Scripts Automatizados

### **Passo 1: Configurar Ambiente (Uma Vez)**

Clique duas vezes em:
```
scripts\setup_env.bat
```

Isso vai:
- ✅ Criar ambiente Conda `snpqim` com Python 3.11
- ✅ Instalar todas as dependências
- ✅ Deixar tudo pronto

### **Passo 2: Iniciar Backend**

Clique duas vezes em:
```
scripts\start_backend.bat
```

### **Passo 3: Iniciar WebApp**

```bash
cd webapp
npm install  # Apenas primeira vez
npm run dev
```

### **Passo 4: Acessar**

http://localhost:3000

---

## 🛠️ Método 2: Manual (PowerShell/CMD)

### **Setup Inicial (Uma Vez)**

```bash
cd c:\Users\jvict\OneDrive\Documents\GitHub\fadex_medicina_projeto1

# Cria ambiente com Python 3.11
conda create -n snpqim python=3.11 -y

# Ativa ambiente
conda activate snpqim

# Instala dependências
pip install -r requirements-backend.txt
```

### **Toda Vez que For Usar**

```bash
# Terminal 1 - Backend
conda activate snpqim
python src\backend\main.py

# Terminal 2 - WebApp
cd webapp
npm run dev
```

---

## 📋 Comandos Úteis do Conda

### Ver todos os ambientes:
```bash
conda env list
```

### Ativar ambiente:
```bash
conda activate snpqim
```

### Desativar ambiente:
```bash
conda deactivate
```

### Ver pacotes instalados:
```bash
conda activate snpqim
pip list
```

### Deletar ambiente (se quiser recomeçar):
```bash
conda deactivate
conda env remove -n snpqim
```

### Exportar ambiente (para compartilhar):
```bash
conda activate snpqim
conda env export > environment.yml
```

---

## 🔍 Verificando se Está Tudo OK

### 1. Verifica Conda:
```bash
conda --version
# Deve mostrar: conda 23.x.x
```

### 2. Verifica ambiente snpqim:
```bash
conda env list
# Deve ter 'snpqim' na lista
```

### 3. Ativa e testa imports:
```bash
conda activate snpqim
python -c "import fastapi, cv2, scipy, numpy; print('Tudo OK!')"
```

### 4. Testa backend:
```bash
python src\backend\main.py
```

Deve mostrar:
```
✅ Módulo fadex_core importado com sucesso
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## ✨ Vantagens do Conda

### vs venv (Python padrão):
- ✅ **Mais rápido** para instalar pacotes científicos
- ✅ **Gerencia** não só Python, mas C/C++ também
- ✅ **Melhor** para NumPy, SciPy, OpenCV
- ✅ **Isolamento** completo de ambientes

### vs pip global:
- ✅ **Sem conflitos** entre projetos
- ✅ **Reproduzível** em outras máquinas
- ✅ **Fácil** de deletar e recriar

---

## 🎯 Estrutura de Ambientes

```
Anaconda/Miniconda Base
├─ base (padrão)
│  └─ Python X.X + pacotes gerais
│
├─ snpqim (nosso projeto)
│  ├─ Python 3.11
│  ├─ FastAPI + Uvicorn
│  ├─ NumPy, SciPy, OpenCV
│  └─ Scikit-Image, Pillow
│
└─ outros_projetos
   └─ cada um com suas deps
```

---

## 🔧 Troubleshooting

### ❌ "conda não é reconhecido"

**Causa**: Conda não está no PATH

**Solução**:
```bash
# Abra Anaconda Prompt (não PowerShell comum)
# Ou adicione Conda ao PATH:

# Encontre onde está o Conda:
C:\Users\seu_usuario\Anaconda3\Scripts\conda.exe

# Execute pelo caminho completo
C:\Users\seu_usuario\Anaconda3\Scripts\conda.exe activate snpqim
```

### ❌ "environment not found: snpqim"

**Solução**: Execute `scripts\setup_env.bat` primeiro

### ❌ Pacotes não instalam

**Solução 1** - Use canal conda-forge:
```bash
conda activate snpqim
conda install -c conda-forge fastapi uvicorn numpy opencv scipy
```

**Solução 2** - Instale via pip:
```bash
conda activate snpqim
pip install -r requirements-backend.txt
```

### ❌ "DLL load failed" ou "ImportError"

**Causa**: Versões incompatíveis

**Solução**:
```bash
# Recrie ambiente
conda deactivate
conda env remove -n snpqim
conda create -n snpqim python=3.11 -y
conda activate snpqim

# Instale via conda primeiro, pip depois
conda install -c conda-forge numpy scipy opencv
pip install fastapi uvicorn python-multipart scikit-image pillow
```

---

## 📦 Dependências Instaladas

### Backend (requirements-backend.txt):
```
fastapi>=0.104.0          # Framework web
uvicorn[standard]>=0.24.0 # Servidor ASGI
python-multipart>=0.0.6   # Upload de arquivos

numpy>=1.24.0,<2.0.0      # Arrays numéricos
opencv-python>=4.8.0       # Processamento de imagens
scipy>=1.11.0              # Algoritmos científicos
scikit-image>=0.21.0       # Análise de imagens
Pillow>=10.0.0             # Manipulação de imagens
python-dotenv>=1.0.0       # Variáveis de ambiente
```

---

## 🆘 Ainda com Problemas?

### Verifique versões:
```bash
conda activate snpqim
python --version       # Deve ser 3.11.x
pip --version         # Deve mostrar caminho do snpqim
conda list            # Mostra todos os pacotes
```

### Log de erro completo:
```bash
conda activate snpqim
python src\backend\main.py 2> error.log
type error.log
```

---

**Última atualização**: Outubro 2025
**Versão**: 3.0 - Suporte completo para Conda
