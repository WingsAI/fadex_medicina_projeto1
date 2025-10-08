# 🚀 FADEX - Guia Rápido de Início

**Comece a testar o sistema FADEX em minutos**

---

## 📋 Pré-requisitos

- Python 3.9 ou superior
- pip (gerenciador de pacotes Python)

---

## ⚡ Instalação Rápida

### 1. Clone o repositório (se ainda não fez)

```bash
git clone <seu-repositorio>
cd fadex_medicina_projeto1
```

### 2. Crie um ambiente virtual (recomendado)

```bash
python -m venv venv

# No macOS/Linux:
source venv/bin/activate

# No Windows:
venv\Scripts\activate
```

### 3. Instale as dependências mínimas

```bash
# Para testar apenas o algoritmo core
pip install -r requirements-minimal.txt

# OU para instalação completa (inclui API, testes, etc)
pip install -r requirements.txt
```

---

## 🧪 Testando o Sistema

### Passo 1: Gere imagens de teste

```bash
python create_test_images.py
```

Isso criará:
- 📁 `examples/` - Pasta com ~13 imagens de teste
- Imagens de diferentes qualidades (alta, média, baixa)
- Imagens com artifacts específicos (blur, ruído, etc)

### Passo 2: Execute a análise

#### Analisar uma única imagem:

```bash
python test_fadex.py examples/fundus_high_quality.png
```

#### Analisar todas as imagens (batch):

```bash
python test_fadex.py examples/ --batch
```

#### Especificar tipo de exame:

```bash
python test_fadex.py examples/oct_high_quality.png --exam=oct
```

### Passo 3: Verifique os resultados

Os resultados são salvos em `results/`:

```bash
ls results/
```

Você encontrará:
- `*.json` - Resultados individuais por imagem
- `batch_summary_*.json` - Resumo estatístico do batch

---

## 📊 Entendendo os Resultados

### Score Global (0-100)

- **85-100**: Excelente - Ideal para pesquisa e ML
- **70-84**: Bom - Adequado para uso clínico
- **50-69**: Regular - Utilizável com limitações
- **0-49**: Insuficiente - Não recomendado

### ML Readiness

- **excellent**: Pronto para modelos de pesquisa
- **good**: Adequado para aplicações clínicas
- **fair**: Utilizável com pré-processamento
- **poor**: Não recomendado para ML

### Clinical Adequacy

- **diagnostic**: Adequado para diagnóstico
- **screening**: Adequado para triagem
- **inadequate**: Inadequado para uso clínico

### Dimensões Avaliadas

1. **Sharpness** (Nitidez): Clareza e foco da imagem
2. **Exposure** (Exposição): Iluminação adequada
3. **Contrast** (Contraste): Diferenciação de estruturas
4. **Noise Level** (Ruído): Presença de ruído/granulação
5. **Artifacts** (Artefatos): Problemas técnicos
6. **Clinical Adequacy** (Adequação Clínica): Utilidade médica

---

## 🧪 Executando Testes Unitários

```bash
# Execute todos os testes
pytest tests/test_fadex_core.py -v

# Execute com cobertura
pytest tests/test_fadex_core.py --cov=src/ml/scoring --cov-report=html

# Execute testes específicos
pytest tests/test_fadex_core.py::TestFadexQualityAnalyzer::test_sharpness_analysis -v
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Análise Simples

```python
import numpy as np
from src.ml.scoring.fadex_core import analyze_image_quality

# Carregue sua imagem (como numpy array)
image = np.random.rand(512, 512)  # Exemplo

# Analise
score = analyze_image_quality(image, exam_type='fundoscopy')

# Resultados
print(f"Score: {score.global_score:.1f}/100")
print(f"ML Ready: {score.ml_readiness}")
print(f"Recomendações: {score.recommendations}")
```

### Exemplo 2: Análise com OpenCV

```python
import cv2
from src.ml.scoring.fadex_core import analyze_image_quality

# Carrega imagem
image = cv2.imread('minha_imagem.png')
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Analisa
score = analyze_image_quality(image, exam_type='fundoscopy')

# Verifica qualidade
if score.global_score >= 70:
    print("✅ Imagem adequada para análise")
else:
    print("⚠️ Qualidade insuficiente:")
    for rec in score.recommendations:
        print(f"  - {rec}")
```

### Exemplo 3: Integração com Pipeline

```python
import os
from pathlib import Path
from src.ml.scoring.fadex_core import analyze_image_quality
import cv2

def process_directory(input_dir, min_score=70):
    """Processa diretório e filtra por qualidade"""
    approved = []
    rejected = []

    for img_file in Path(input_dir).glob("*.png"):
        image = cv2.imread(str(img_file))
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        score = analyze_image_quality(image)

        if score.global_score >= min_score:
            approved.append((img_file, score.global_score))
        else:
            rejected.append((img_file, score.global_score))

    return approved, rejected

# Uso
approved, rejected = process_directory('my_images/', min_score=70)
print(f"Aprovadas: {len(approved)}")
print(f"Rejeitadas: {len(rejected)}")
```

---

## 🔧 Próximos Passos

Agora que o core está funcionando, você pode:

1. **Testar com suas próprias imagens** - Coloque suas imagens DICOM/PNG/JPG em uma pasta e execute a análise

2. **Ajustar parâmetros** - Modifique `clinical_standards` em `src/ml/scoring/fadex_core.py` conforme suas necessidades

3. **Implementar API REST** - Próximo passo: backend FastAPI para acesso via web

4. **Criar interface web** - Frontend simples para upload e visualização

---

## ❓ Solução de Problemas

### Erro: "Module not found"

```bash
# Certifique-se de estar no diretório correto
cd fadex_medicina_projeto1

# Reinstale dependências
pip install -r requirements-minimal.txt
```

### Erro: "No images found"

```bash
# Gere imagens de teste primeiro
python create_test_images.py
```

### Imagens muito lentas para processar

- Imagens muito grandes (>2048px) podem demorar
- Redimensione antes: `cv2.resize(image, (1024, 1024))`

### PyTorch não instalado

```bash
# Instale PyTorch conforme seu sistema
# CPU only:
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Com CUDA (GPU):
pip install torch torchvision
```

---

## 📞 Suporte

- **Issues**: Abra um issue no GitHub
- **Documentação**: Veja [README.md](README.md) e [Guia_Desenvolvimento.md](Guia_Desenvolvimento.md)
- **Email**: joao.victor@wingsdobrasil.com.br

---

## 📊 Performance Esperada

Com as imagens de teste:

- **Processamento**: ~2-5s por imagem (CPU)
- **Batch de 10 imagens**: ~20-50s
- **Precisão**: Scores consistentes e reproduzíveis

---

**✨ Pronto! Você já pode começar a testar o algoritmo FADEX.**

Para implementar a API REST e frontend, consulte os próximos passos no [Guia_Desenvolvimento.md](Guia_Desenvolvimento.md)
