# 🏥 SNPQIM - Sistema Nacional para Padronização da Qualidade de Imagens Médicas

**Powered by WingsAI Technology**

[![TRL](https://img.shields.io/badge/TRL-2--3-orange)](https://www.example.com)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)](https://www.example.com)
[![License](https://img.shields.io/badge/License-Open%20Source-green)](https://www.example.com)

---

## 🎯 Visão Geral

O **SNPQIM** é um sistema revolucionário que visa resolver a ausência de protocolos padronizados para avaliação da qualidade de imagens médicas oftalmológicas no Brasil. Nossa plataforma oferece um **score de 0 a 100** para cada imagem, garantindo que médicos e pesquisadores utilizem dados de alta qualidade em modelos de IA.

### Problema Identificado
- ❌ Médicos e pesquisadores usam modelos de IA sem verificar qualidade das imagens
- ❌ Resultados diagnósticos imprecisos devido a imagens de baixa qualidade
- ❌ Exames repetidos desnecessários gerando custos ao sistema de saúde
- ❌ Falta de interoperabilidade entre sistemas no Brasil

### Nossa Solução
- ✅ **Protocolo nacional** padronizado e interoperável
- ✅ **Plataforma web** com API RESTful para análise automatizada
- ✅ **Score de qualidade** (0-100) para cada imagem médica
- ✅ **Recomendações ML** otimizadas baseadas na qualidade
- ✅ **Integração DICOM/PACS** para workflow clínico

---

## 🚀 Início Rápido

### Opção 1: Método Mais Fácil (Windows)
```bash
# Clique duas vezes em:
scripts\start_all.bat
```

### Opção 2: Iniciar Manualmente

**Backend (Terminal 1):**
```bash
python src/backend/main.py
# API disponível em http://localhost:8000
```

**WebApp (Terminal 2):**
```bash
cd webapp
npm install  # Apenas na primeira vez
npm run dev
# Interface disponível em http://localhost:3000
```

---

## 📚 Documentação

### Guias de Início
- **[Como Usar](docs/COMO_USAR.md)** - Guia completo de uso do sistema
- **[Setup Rápido](docs/SETUP_RAPIDO.md)** - Configuração rápida do ambiente
- **[Setup com Conda](docs/SETUP_CONDA.md)** - Configuração usando Anaconda
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Solução de problemas comuns

### Documentação Técnica
- **[Integração](docs/INTEGRACAO.md)** - Como integrar com sistemas existentes
- **[Versões do Sistema](docs/VERSOES.md)** - Diferentes versões disponíveis (CLI, API, WebApp)
- **[PRD - Product Requirements](docs/PRD_SNPQIM.md)** - Especificações completas do produto
- **[Guia de Desenvolvimento](docs/Guia_Desenvolvimento.md)** - Para desenvolvedores

### Início Rápido para Desenvolvedores
- **[Start Here](docs/START_HERE.md)** - Por onde começar
- **[MVP Summary](docs/MVP_SUMMARY.md)** - Resumo do MVP atual

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    SNPQIM ECOSYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│  🌐 Frontend Web App (Next.js/React)                       │
│  ├── Dashboard com visualizações DNA                       │
│  ├── Interface de análise de imagens                       │
│  └── Portal Administrativo                                 │
├─────────────────────────────────────────────────────────────┤
│  🔗 API RESTful (FastAPI/Python)                          │
│  ├── Upload & Processing de imagens                        │
│  ├── WingsAI Quality Assessment Engine                     │
│  ├── ML Model Recommendations                              │
│  └── DICOM Integration                                      │
├─────────────────────────────────────────────────────────────┤
│  🧠 WingsAI Core (PyTorch/OpenCV)                         │
│  ├── Algoritmo de análise de qualidade                    │
│  ├── Sistema de scoring (0-100)                           │
│  ├── Detecção de artifacts                                │
│  └── Recomendações clínicas                               │
├─────────────────────────────────────────────────────────────┤
│  💾 Data Layer                                            │
│  ├── PostgreSQL (Metadata & Users)                         │
│  ├── MongoDB (Medical Images)                              │
│  └── Redis (Cache & Sessions)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Estrutura do Projeto

```
fadex_medicina_projeto1/
│
├── 📚 docs/                    # Documentação completa
│   ├── COMO_USAR.md
│   ├── SETUP_RAPIDO.md
│   ├── INTEGRACAO.md
│   ├── TROUBLESHOOTING.md
│   └── ...
│
├── 💻 src/                     # Código-fonte principal
│   ├── backend/                # API FastAPI
│   │   └── main.py
│   ├── frontend/               # Interface HTML
│   │   └── index.html
│   └── ml/scoring/             # Algoritmo WingsAI
│       └── wingsai_core.py
│
├── 🌐 webapp/                  # Aplicação Next.js moderna
│   ├── src/app/
│   └── package.json
│
├── 🔧 scripts/                 # Scripts utilitários
│   ├── start_all.bat
│   ├── test_wingsai.py
│   └── ...
│
└── 🧪 tests/                   # Testes automatizados
    └── test_wingsai_core.py
```

---

## 🎯 Funcionalidades Principais

### 1. Análise de Qualidade Automatizada
- Upload de imagens DICOM/JPG/PNG
- Processamento IA para avaliação de qualidade
- Score detalhado (0-100) com justificativas técnicas
- Relatórios em JSON

### 2. Recomendações Inteligentes
- Sugestão de modelos ML baseados na qualidade
- Parâmetros otimizados para cada tipo de análise
- Alertas para imagens inadequadas
- Guidelines de melhoria

### 3. Integração Clínica
- API REST para integração com PACS
- Webhook system para notificações
- SDK Python para integração rápida
- Compliance com DICOM 3.0

---

## 🧪 Exemplos de Uso

### Via WebApp
1. Acesse http://localhost:3000
2. Faça upload de uma imagem médica
3. Clique em "Analisar Qualidade"
4. Visualize o score e recomendações

### Via CLI
```bash
# Analisar uma imagem
python scripts/test_wingsai.py examples/retina.jpg

# Análise em lote
python scripts/test_wingsai.py examples/ --batch
```

### Via API
```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -F "file=@examples/retina.jpg" \
  -F "exam_type=fundoscopy"
```

---

## 🔧 Tecnologias Utilizadas

### Backend
- **Python 3.10+**
- **FastAPI** - Framework web moderno
- **OpenCV, NumPy, SciPy** - Processamento de imagens
- **PyTorch** - Machine Learning (opcional)

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Chart.js** - Visualizações

### Infraestrutura
- **Docker & Docker Compose** - Containerização
- **PostgreSQL** - Banco de dados relacional
- **Redis** - Cache e sessões

---

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença especificada no arquivo [LICENSE](LICENSE).

---

## 🆘 Suporte

- 📧 Email: suporte@snpqim.com.br
- 📚 Documentação: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/fadex_medicina_projeto1/issues)

---

## 📊 Status do Projeto

- **TRL Atual**: 2-3 (Concept Validation)
- **Versão**: 2.0 MVP
- **Última Atualização**: Outubro 2025

**WingsAI** - Transformando qualidade de imagens médicas com inteligência artificial 🚀
