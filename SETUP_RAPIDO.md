# ⚡ Setup Rápido - SNPQIM

## 🎯 Problema: "ModuleNotFoundError: No module named 'fastapi'"

**Causa**: Conflito entre ambientes Python (Anaconda vs sistema)

**Solução**: Usar ambiente virtual dedicado

---

## ✅ Solução em 3 Passos

### **Passo 1: Configurar Ambiente Virtual**

Clique duas vezes em:
```
scripts\setup_env.bat
```

Ou execute no terminal:
```bash
cd c:\Users\jvict\OneDrive\Documents\GitHub\fadex_medicina_projeto1
python -m venv venv
venv\Scripts\activate
pip install -r requirements-backend.txt
```

Aguarde a instalação (pode levar 2-5 minutos).

### **Passo 2: Iniciar Backend**

Clique duas vezes em:
```
scripts\start_backend.bat
```

Você verá:
```
Ativando ambiente virtual...
✅ Módulo fadex_core importado com sucesso
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### **Passo 3: Iniciar WebApp**

Em outro terminal:
```bash
cd webapp
npm install  # Apenas primeira vez
npm run dev
```

Acesse: http://localhost:3000

---

## 🔍 Por que isso resolve?

### Problema Original:
```
Sistema:
  ├─ Python do Anaconda (E:\trabalho\anaconda\)
  │  └─ fastapi instalado aqui ✓
  └─ Python do Windows (C:\Users\...\WindowsApps\)
     └─ python3 usa este ✗

Resultado: pip3 instala em um lugar, python3 roda em outro!
```

### Solução com venv:
```
Projeto:
  └─ venv\ (ambiente isolado)
     ├─ Python próprio
     ├─ pip próprio
     └─ fastapi + todas deps ✓

Resultado: Tudo no mesmo lugar!
```

---

## 🛠️ Troubleshooting

### ❌ "python não é reconhecido"

**Solução**: Instale Python de https://www.python.org/downloads/

Durante instalação, marque:
- ✅ **Add Python to PATH**

### ❌ Setup falha ao instalar pacotes

**Solução 1 - Anaconda**:
```bash
# Use conda para criar ambiente
conda create -n snpqim python=3.10
conda activate snpqim
pip install -r requirements-backend.txt
```

**Solução 2 - Sem PyTorch**:
```bash
# Instale só o essencial
pip install fastapi uvicorn python-multipart
pip install numpy opencv-python scikit-image scipy Pillow
```

### ❌ "Access Denied" ao criar venv

**Solução**: Execute PowerShell como Administrador

### ❌ Ainda dá erro de módulo

**Solução**: Verifique qual Python está usando:
```bash
# No terminal com venv ativado:
where python
# Deve mostrar: ...\venv\Scripts\python.exe

python -c "import fastapi; print('OK')"
# Deve mostrar: OK
```

---

## 🚀 Atalho - Tudo de Uma Vez

### Windows:
```bash
# 1. Setup
scripts\setup_env.bat

# 2. Iniciar tudo
scripts\start_all.bat
```

### Linux/Mac:
```bash
# 1. Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements-backend.txt

# 2. Terminal 1 - Backend
source venv/bin/activate
python src/backend/main.py

# 3. Terminal 2 - WebApp
cd webapp
npm install
npm run dev
```

---

## 📦 O que está sendo instalado?

### requirements-backend.txt (Leve - ~200MB):
- ✅ FastAPI + Uvicorn (Backend)
- ✅ NumPy, OpenCV, SciPy (Análise de imagens)
- ✅ Pillow, scikit-image (Processamento)

### requirements.txt (Completo - ~2GB):
- Tudo acima +
- PyTorch (Deep Learning)
- PostgreSQL, MongoDB, Redis (Databases)
- MLflow, TensorBoard (Experiment tracking)
- Pytest (Testing)

**Recomendação**: Use `requirements-backend.txt` primeiro para testar!

---

## ✅ Verificando se Funcionou

### 1. Backend está rodando?
```bash
curl http://localhost:8000/health
```

Deve retornar:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "service": "FADEX Quality Analysis"
}
```

### 2. WebApp conecta?
- Acesse http://localhost:3000
- Veja **"API Online"** (verde) no topo
- Se estiver verde ✅ = Tudo funcionando!

### 3. Análise funciona?
1. Upload uma imagem
2. Clique "Analisar Qualidade"
3. Aguarde 2-5 segundos
4. Veja o score aparecer

---

## 🎓 Entendendo Ambientes Python

### Sem venv (Problemático):
```
Sistema Global
├─ Anaconda
│  └─ Pacotes do Anaconda
├─ Python Sistema
│  └─ Pacotes do Sistema
└─ Python Windows Store
   └─ Pacotes isolados

❌ Conflitos entre versões
❌ Difícil debugar
❌ Pode quebrar outros projetos
```

### Com venv (Recomendado):
```
Projeto SNPQIM
└─ venv/
   ├─ Python 3.10
   ├─ pip
   └─ Pacotes do projeto
      ├─ fastapi
      ├─ numpy
      └─ opencv-python

✅ Isolado de outros projetos
✅ Fácil debugar
✅ Reproduzível
```

---

## 🆘 Ainda com Problemas?

### Opção 1: Docker (Mais Fácil)
```bash
docker-compose up
```

### Opção 2: Use Anaconda
```bash
conda create -n snpqim python=3.10
conda activate snpqim
pip install -r requirements-backend.txt
python src/backend/main.py
```

### Opção 3: Peça Ajuda
Abra issue com:
- Output de `python --version`
- Output de `where python`
- Mensagem de erro completa
- Sistema operacional

---

**Última atualização**: Outubro 2025
**Versão**: 2.1 - Com ambiente virtual
