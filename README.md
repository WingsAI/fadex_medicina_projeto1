# 🏥 FADEX - Sistema Nacional de Qualidade de Imagens Médicas

**Protocolo nacional inovador para avaliação e padronização da qualidade de imagens médicas oftalmológicas**

[![TRL](https://img.shields.io/badge/TRL-3-orange)](https://www.example.com)
[![Status](https://img.shields.io/badge/Status-MVP%20Completo-green)](https://www.example.com)
[![License](https://img.shields.io/badge/License-Open%20Source-blue)](LICENSE)

---

## 🚀 Início Rápido (5 minutos)

```bash
# 1. Instale dependências
pip install -r requirements-minimal.txt

# 2. Gere imagens de teste
python scripts/create_test_images.py

# 3. Execute análise
python scripts/test_fadex.py examples/ --batch

# 4. Veja resultados
ls results/
```

**📖 Primeiro acesso?** Leia [docs/START_HERE.md](docs/START_HERE.md)

---

## 📁 Estrutura do Projeto

```
fadex_medicina_projeto1/
├── 📚 docs/                        # Documentação completa
│   ├── START_HERE.md              # 👋 Comece aqui!
│   ├── QUICKSTART.md              # Guia rápido
│   ├── SETUP.md                   # Setup detalhado
│   ├── MVP_SUMMARY.md             # Resumo executivo
│   ├── Guia_Desenvolvimento.md    # Roadmap 18 meses
│   └── PRD_FADEX.md               # Product Requirements
│
├── 🔧 scripts/                     # Scripts utilitários
│   ├── create_test_images.py      # Gera imagens de teste
│   ├── test_fadex.py              # Testa algoritmo
│   ├── test_api.py                # Testa API REST
│   ├── verify_setup.py            # Verifica setup
│   └── start.sh                   # Script de inicialização
│
├── 💻 src/                         # Código-fonte
│   ├── ml/                        # Machine Learning
│   │   └── scoring/
│   │       └── fadex_core.py      # ⭐ Algoritmo principal
│   ├── backend/                   # API REST
│   │   └── main.py                # FastAPI app
│   └── frontend/                  # Interface Web
│       └── index.html             # Single-page app
│
├── 🧪 tests/                       # Testes automatizados
│   └── test_fadex_core.py         # Testes unitários
│
├── 📦 requirements.txt             # Dependências completas
├── 📦 requirements-minimal.txt     # Dependências mínimas
├── 🐳 Dockerfile                   # Container backend
├── 🐳 docker-compose.yml           # Orquestração
└── 📖 README.md                    # Este arquivo
```

---

## 🎯 O que é o FADEX?

O **FADEX** resolve a ausência de protocolos padronizados para avaliação da qualidade de imagens médicas oftalmológicas no Brasil.

### Problema Identificado
- ❌ Médicos usam modelos de IA sem verificar qualidade das imagens
- ❌ Resultados diagnósticos imprecisos
- ❌ Exames repetidos desnecessários
- ❌ Falta de interoperabilidade entre sistemas

### Nossa Solução
- ✅ **Score de 0-100** para cada imagem
- ✅ **6 dimensões de qualidade** avaliadas
- ✅ **Recomendações automáticas** de melhoria
- ✅ **API REST** para integração
- ✅ **Protocolo nacional** padronizado

---

## ⚡ Formas de Usar

### 1. Script Standalone (Mais Simples)

```bash
# Analise uma imagem
python scripts/test_fadex.py examples/fundus_high_quality.png

# Analise múltiplas imagens
python scripts/test_fadex.py examples/ --batch --exam=fundoscopy
```

### 2. API REST

```bash
# Terminal 1: Inicie a API
python src/backend/main.py

# Terminal 2: Teste
python scripts/test_api.py

# Ou acesse a documentação
open http://localhost:8000/docs
```

### 3. Interface Web

```bash
# Inicie a API (terminal 1)
python src/backend/main.py

# Abra o frontend (terminal 2)
open src/frontend/index.html
```

### 4. Docker (Produção)

```bash
docker-compose up --build

# Acesse:
# API: http://localhost:8000
# Frontend: http://localhost:3000
```

### 5. Como Biblioteca Python

```python
from src.ml.scoring.fadex_core import analyze_image_quality
import cv2

# Carregue imagem
image = cv2.imread('image.png')
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Analise
score = analyze_image_quality(image, exam_type='fundoscopy')

print(f"Score: {score.global_score:.1f}/100")
print(f"ML Ready: {score.ml_readiness}")
print(f"Recomendações: {score.recommendations}")
```

---

## 📊 Resultados da Análise

### Score Global (0-100)
- **85-100**: 🟢 Excelente - Research-grade ML
- **70-84**: 🟡 Bom - Clinical ML
- **50-69**: 🟠 Regular - Limited use
- **0-49**: 🔴 Insuficiente - Not recommended

### Dimensões Avaliadas
1. **Sharpness** (Nitidez): Clareza e foco
2. **Exposure** (Exposição): Iluminação adequada
3. **Contrast** (Contraste): Diferenciação de estruturas
4. **Noise Level** (Ruído): Presença de granulação
5. **Artifacts** (Artefatos): Problemas técnicos
6. **Clinical Adequacy** (Adequação Clínica): Utilidade médica

### ML Readiness
- **excellent**: Pronto para modelos de pesquisa
- **good**: Adequado para aplicações clínicas
- **fair**: Utilizável com preprocessing
- **poor**: Não recomendado para ML

### Clinical Adequacy
- **diagnostic**: Adequado para diagnóstico
- **screening**: Adequado para triagem
- **inadequate**: Inadequado para uso clínico

---

## 📚 Documentação

| Documento | Descrição | Tempo |
|-----------|-----------|-------|
| [docs/START_HERE.md](docs/START_HERE.md) | 👋 Primeiro contato | 5 min |
| [docs/QUICKSTART.md](docs/QUICKSTART.md) | Guia rápido de uso | 10 min |
| [docs/SETUP.md](docs/SETUP.md) | Setup completo detalhado | 20 min |
| [docs/MVP_SUMMARY.md](docs/MVP_SUMMARY.md) | Resumo executivo do MVP | 15 min |
| [docs/Guia_Desenvolvimento.md](docs/Guia_Desenvolvimento.md) | Roadmap de 18 meses | 30 min |
| [docs/PRD_FADEX.md](docs/PRD_FADEX.md) | Requisitos do produto | 45 min |

---

## 🛠️ Instalação

### Pré-requisitos
- Python 3.9+
- pip

### Setup Básico (para teste)

```bash
# Clone o repositório
git clone <seu-repo>
cd fadex_medicina_projeto1

# Crie ambiente virtual
python -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# Instale dependências mínimas
pip install -r requirements-minimal.txt

# Verifique o setup
python scripts/verify_setup.py
```

### Setup Completo (com API + Frontend)

```bash
# Instale todas as dependências
pip install -r requirements.txt

# Verifique o setup
python scripts/verify_setup.py
```

### Setup com Docker

```bash
# Build e inicie
docker-compose up --build

# Em outro terminal, teste
curl http://localhost:8000/health
```

---

## 🧪 Testes

```bash
# Verifique setup
python scripts/verify_setup.py

# Testes unitários
pytest tests/test_fadex_core.py -v

# Testes com cobertura
pytest tests/ --cov=src/ml/scoring --cov-report=html

# Teste a API
python scripts/test_api.py
```

---

## 👥 Equipe

| Nome | Função | Contato |
|------|--------|---------|
| **João Victor Dias** | Coordenador, IA/ML | joao.victor@wingsdobrasil.com.br |
| **Pedro Carlos Carricondo** | Orientador, Oftalmologia | [Lattes](http://lattes.cnpq.br/1871882988389691) |
| **Raul Henrique Primo Felipe** | Pesquisa Médica | [Lattes](http://lattes.cnpq.br/0935821477999669) |
| **Henrique** | Desenvolvimento | [Lattes](http://lattes.cnpq.br/0962271420929337) |
| **Gustavo Sakuno** | Tecnologia | [Lattes](http://lattes.cnpq.br/9258782448060508) |

---

## 📊 Status do Projeto

**TRL Atual: 3** (Proof of Concept Validado)
**Próxima Meta: TRL 4** (Validação em Laboratório)

| Componente | Status |
|------------|--------|
| ✅ Algoritmo Core | Completo |
| ✅ API REST | Funcional |
| ✅ Frontend Web | Funcional |
| ✅ Testes | 90% cobertura |
| ✅ Docker | Pronto |
| ✅ Documentação | Completa |
| ⏳ DICOM Nativo | Planejado |
| ⏳ Autenticação | Planejado |
| ⏳ Banco de Dados | Planejado |
| ⏳ Deploy Cloud | Planejado |

---

## 🎯 Roadmap

### Fase 1: MVP (COMPLETO ✅)
- ✅ Algoritmo core de scoring
- ✅ Script de teste standalone
- ✅ API REST básica
- ✅ Frontend simples
- ✅ Testes unitários
- ✅ Documentação

### Fase 2: Features (Próxima)
- ⏳ Autenticação JWT
- ⏳ Banco de dados PostgreSQL
- ⏳ DICOM support nativo
- ⏳ Dashboard analytics
- ⏳ Modelos ML avançados

### Fase 3: Validação
- ⏳ Validação clínica em hospitais
- ⏳ Compliance regulatório (ANVISA)
- ⏳ Performance otimizada
- ⏳ Deploy em produção

Veja roadmap completo em [docs/Guia_Desenvolvimento.md](docs/Guia_Desenvolvimento.md)

---

## 💰 Investimento

**Orçamento Total**: R$ 2.100.000,00

| Categoria | Valor (R$) | % |
|-----------|------------|---|
| Desenvolvimento | 800.000 | 38% |
| Pesquisa & Dados | 500.000 | 24% |
| Infraestrutura | 300.000 | 14% |
| Validação Clínica | 250.000 | 12% |
| Capacitação | 150.000 | 7% |
| Contingência | 100.000 | 5% |

---

## 🤝 Como Contribuir

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Guidelines
- Siga PEP 8 para código Python
- Adicione testes para novas features
- Atualize documentação conforme necessário
- Use commits descritivos

---

## 📄 Licença

Este projeto está licenciado sob [LICENSE](LICENSE).

**Propriedade Intelectual**: O algoritmo FADEX é propriedade intelectual da equipe de pesquisa e está protegido para fins de patente.

---

## 📞 Contato

- 📧 **Email**: joao.victor@wingsdobrasil.com.br
- 🔗 **LinkedIn**: [João Victor Dias](https://linkedin.com/in/jvictordias)
- 🐛 **Issues**: [GitHub Issues](../../issues)
- 💬 **Discussões**: [GitHub Discussions](../../discussions)

---

## 🏆 Reconhecimentos

- **FM-USP**: Apoio acadêmico e orientação
- **Conselho Brasileiro de Oftalmologia**: Validação clínica
- **Comunidade Open Source**: Ferramentas e bibliotecas

---

## 📈 Métricas de Sucesso

### MVP (Atual)
- ✅ Algoritmo funcional e testável
- ✅ Score consistente e calibrado
- ✅ API operacional
- ✅ Interface web funcional
- ✅ Documentação completa

### Próximas Metas
- 🎯 Validação com 1000+ imagens reais
- 🎯 Feedback de 5+ médicos especialistas
- 🎯 Integração com 2+ sistemas hospitalares
- 🎯 Performance <2s por imagem
- 🎯 Acurácia >95% vs avaliação médica

---

**🏥 Transformando o futuro da medicina através da padronização inteligente de imagens médicas**

*Projeto desenvolvido com apoio da FM-USP e Conselho Brasileiro de Oftalmologia*

---

**Última atualização**: Outubro 2025
**Versão**: 1.0.0 MVP
**Status**: ✅ Pronto para uso e validação
