# 🚀 FADEX - Setup Completo

**Guia completo para configurar e executar o sistema FADEX**

---

## 📦 O que foi implementado

✅ **Fase 1 - MVP Testável (COMPLETO)**

1. ✅ Algoritmo Core de Scoring ([fadex_core.py](src/ml/scoring/fadex_core.py))
2. ✅ Script de teste standalone ([test_fadex.py](test_fadex.py))
3. ✅ Gerador de imagens de teste ([create_test_images.py](create_test_images.py))
4. ✅ API REST com FastAPI ([src/backend/main.py](src/backend/main.py))
5. ✅ Frontend web simples ([src/frontend/index.html](src/frontend/index.html))
6. ✅ Testes unitários ([tests/test_fadex_core.py](tests/test_fadex_core.py))
7. ✅ Docker e docker-compose
8. ✅ Documentação completa

---

## 🎯 Três Formas de Testar

### Opção 1: Teste Local Rápido (Recomendado para começar)

**Mais simples - testa apenas o algoritmo core**

```bash
# 1. Instale dependências mínimas
pip install -r requirements-minimal.txt

# 2. Gere imagens de teste
python create_test_images.py

# 3. Execute análise
python test_fadex.py examples/ --batch

# 4. Veja resultados
ls results/
```

### Opção 2: API + Frontend (Desenvolvimento)

**Testa sistema completo localmente**

```bash
# 1. Instale todas as dependências
pip install -r requirements.txt

# 2. Gere imagens de teste (se ainda não fez)
python create_test_images.py

# Terminal 1 - Inicie a API
python src/backend/main.py

# Terminal 2 - Teste a API
python test_api.py

# 3. Abra o frontend
# Abra src/frontend/index.html no navegador
# Ou use um servidor local:
cd src/frontend
python -m http.server 3000
# Acesse: http://localhost:3000
```

### Opção 3: Docker (Produção)

**Sistema completo containerizado**

```bash
# 1. Build e inicie os containers
docker-compose up --build

# 2. Acesse os serviços
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
# Frontend: http://localhost:3000

# 3. Para parar
docker-compose down
```

---

## 📋 Pré-requisitos Detalhados

### Para Opção 1 (Teste Local):
- Python 3.9+
- pip
- ~500MB espaço em disco

### Para Opção 2 (API + Frontend):
- Python 3.9+
- pip
- Navegador web moderno
- ~2GB espaço em disco

### Para Opção 3 (Docker):
- Docker Desktop ou Docker Engine
- docker-compose
- ~5GB espaço em disco

---

## 🔧 Instalação Detalhada

### 1. Clone o Repositório

```bash
git clone <seu-repositorio>
cd fadex_medicina_projeto1
```

### 2. Configure Ambiente Virtual (Recomendado)

```bash
# Crie ambiente virtual
python -m venv venv

# Ative o ambiente
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 3. Instale Dependências

```bash
# Mínimas (apenas para teste local)
pip install -r requirements-minimal.txt

# OU completas (inclui API, testes, etc)
pip install -r requirements.txt
```

### 4. Gere Imagens de Teste

```bash
python create_test_images.py
```

Isso cria:
- `examples/` com ~13 imagens sintéticas
- Imagens de alta, média e baixa qualidade
- Imagens com artifacts específicos

---

## 🧪 Testando o Sistema

### Teste 1: Script Standalone

```bash
# Analise uma imagem
python test_fadex.py examples/fundus_high_quality.png

# Analise todas as imagens
python test_fadex.py examples/ --batch

# Especifique tipo de exame
python test_fadex.py examples/oct_high_quality.png --exam=oct
```

**Output esperado:**
```
🔬 Analisando: fundus_high_quality.png
✓ Imagem carregada: (512, 512, 3)
⚙️  Executando análise FADEX...

📊 RESULTADOS FADEX
────────────────────────────────────────────
🎯 Score Global: 87.3/100 🟢 [████████████████████████░░░░░]
🔍 Confiança: 92.1%
🤖 ML Readiness: GOOD
🏥 Adequação Clínica: DIAGNOSTIC
```

### Teste 2: Testes Unitários

```bash
# Execute todos os testes
pytest tests/test_fadex_core.py -v

# Com cobertura
pytest tests/test_fadex_core.py --cov=src/ml/scoring
```

**Output esperado:**
```
tests/test_fadex_core.py::TestFadexQualityAnalyzer::test_analyzer_initialization PASSED
tests/test_fadex_core.py::TestFadexQualityAnalyzer::test_analyze_high_quality_image PASSED
...
============ 25 passed in 12.34s ============
```

### Teste 3: API REST

**Terminal 1 - Inicie a API:**
```bash
python src/backend/main.py
```

**Terminal 2 - Teste os endpoints:**
```bash
# Via script de teste
python test_api.py

# OU via curl
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/info
```

**Output esperado:**
```
🧪 FADEX API - Testes Automatizados
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 Testando Health Check...
✅ API está saudável!
...
✅ Passou: 5/5
```

### Teste 4: Frontend Web

1. Abra `src/frontend/index.html` no navegador
2. Arraste uma imagem da pasta `examples/`
3. Clique em "Analisar Qualidade"
4. Veja resultados visuais

**OU use servidor local:**
```bash
cd src/frontend
python -m http.server 3000
# Acesse: http://localhost:3000
```

### Teste 5: Docker

```bash
# Build e inicie
docker-compose up --build

# Em outro terminal, teste
curl http://localhost:8000/health
open http://localhost:3000  # Abre frontend no navegador

# Veja logs
docker-compose logs -f api

# Pare os containers
docker-compose down
```

---

## 📊 Entendendo os Resultados

### Score Global (0-100)
- **85-100**: 🟢 Excelente - Research-grade
- **70-84**: 🟡 Bom - Clinical use
- **50-69**: 🟠 Regular - Limited use
- **0-49**: 🔴 Insuficiente - Not recommended

### Dimensões Avaliadas
1. **Sharpness**: Nitidez e foco
2. **Exposure**: Iluminação adequada
3. **Contrast**: Diferenciação de estruturas
4. **Noise Level**: Presença de ruído
5. **Artifacts**: Problemas técnicos
6. **Clinical Adequacy**: Utilidade médica

### ML Readiness
- **excellent**: Pronto para ML de pesquisa
- **good**: Adequado para ML clínico
- **fair**: Utilizável com preprocessing
- **poor**: Não recomendado

### Clinical Adequacy
- **diagnostic**: Adequado para diagnóstico
- **screening**: Adequado para triagem
- **inadequate**: Inadequado clinicamente

---

## 🔍 Estrutura de Arquivos

```
fadex_medicina_projeto1/
├── src/
│   ├── ml/
│   │   └── scoring/
│   │       └── fadex_core.py          # ⭐ Algoritmo principal
│   ├── backend/
│   │   └── main.py                    # 🔗 API REST
│   └── frontend/
│       └── index.html                 # 🎨 Interface web
├── tests/
│   └── test_fadex_core.py            # ✅ Testes unitários
├── examples/                          # 📁 Imagens de teste (geradas)
├── results/                           # 📊 Resultados JSON (gerados)
├── test_fadex.py                     # 🧪 Script de teste standalone
├── create_test_images.py             # 🖼️  Gerador de imagens
├── test_api.py                       # 🧪 Testes da API
├── requirements.txt                   # 📦 Dependências completas
├── requirements-minimal.txt           # 📦 Dependências mínimas
├── Dockerfile                         # 🐳 Docker backend
├── docker-compose.yml                # 🐳 Orquestração
├── QUICKSTART.md                     # 🚀 Guia rápido
└── SETUP.md                          # 📖 Este arquivo
```

---

## 🐛 Solução de Problemas

### Problema: "Module not found"

```bash
# Certifique-se de estar no diretório correto
cd fadex_medicina_projeto1
pwd

# Reinstale dependências
pip install -r requirements-minimal.txt
```

### Problema: "API não conecta"

```bash
# Verifique se a API está rodando
curl http://localhost:8000/health

# Se não, inicie manualmente
python src/backend/main.py
```

### Problema: "No images found"

```bash
# Gere as imagens de teste
python create_test_images.py

# Verifique se foram criadas
ls examples/
```

### Problema: PyTorch demora muito ou falha

```bash
# Use versão CPU (mais leve)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### Problema: OpenCV não funciona

```bash
# Instale dependências do sistema (Ubuntu/Debian)
sudo apt-get install libgl1-mesa-glx libglib2.0-0

# macOS
brew install opencv

# Windows
# Reinstale opencv-python
pip uninstall opencv-python
pip install opencv-python
```

### Problema: Docker build falha

```bash
# Limpe cache do Docker
docker system prune -a

# Build sem cache
docker-compose build --no-cache
```

---

## 📈 Próximos Passos

Agora que o MVP está funcionando, você pode:

### 1. Testar com Suas Imagens

```python
from src.ml.scoring.fadex_core import analyze_image_quality
import cv2

# Carregue sua imagem
image = cv2.imread('minha_imagem.png')
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Analise
score = analyze_image_quality(image, exam_type='fundoscopy')
print(f"Score: {score.global_score:.1f}/100")
```

### 2. Ajustar Parâmetros

Edite `src/ml/scoring/fadex_core.py`:

```python
self.clinical_standards = {
    'min_resolution': 512,     # Ajuste conforme necessário
    'optimal_resolution': 1024,
    'contrast_threshold': 0.3,
    # ...
}
```

### 3. Adicionar Autenticação

Próximo passo: implementar JWT auth na API

### 4. Integrar Banco de Dados

Próximo passo: PostgreSQL para persistir resultados

### 5. Deploy em Produção

Próximo passo: AWS/GCP deployment com Kubernetes

---

## 📞 Suporte

- **Issues**: Abra um issue no GitHub
- **Documentação**: [README.md](README.md), [QUICKSTART.md](QUICKSTART.md)
- **Email**: joao.victor@wingsdobrasil.com.br

---

## ✅ Checklist de Verificação

Antes de considerar o setup completo, verifique:

- [ ] Imagens de teste geradas (`ls examples/`)
- [ ] Script standalone funciona (`python test_fadex.py examples/ --batch`)
- [ ] Testes unitários passam (`pytest tests/ -v`)
- [ ] API inicia sem erros (`python src/backend/main.py`)
- [ ] Health check responde (`curl http://localhost:8000/health`)
- [ ] Frontend carrega (`open src/frontend/index.html`)
- [ ] Upload e análise funcionam via frontend
- [ ] Docker build completa (`docker-compose up --build`)

---

**🎉 Parabéns! Você tem um MVP funcional do FADEX.**

Para desenvolvimento avançado, consulte [Guia_Desenvolvimento.md](Guia_Desenvolvimento.md)
