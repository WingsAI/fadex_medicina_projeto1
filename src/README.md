# 💻 FADEX - Source Code Structure

**Organização modular e escalável do código-fonte**

---

## 📂 **ESTRUTURA DE PASTAS**

```
src/
├── 📱 frontend/                 # Aplicação web React/Next.js
│   ├── components/             # Componentes reutilizáveis
│   ├── pages/                  # Páginas e routing
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utilitários frontend
│   ├── styles/                 # CSS/styled-components
│   └── public/                 # Assets estáticos
├── 🔧 backend/                  # API REST FastAPI
│   ├── api/                    # Endpoints e routers
│   ├── core/                   # Configurações e settings
│   ├── models/                 # Modelos SQLAlchemy/Pydantic
│   ├── services/               # Lógica de negócio
│   ├── utils/                  # Utilitários backend
│   └── tests/                  # Testes automatizados
├── 🧠 ml/                       # Machine Learning pipeline
│   ├── models/                 # Modelos treinados
│   ├── training/               # Scripts de treinamento
│   ├── inference/              # Inferência e serving
│   ├── data/                   # Processamento de dados
│   └── notebooks/              # Jupyter notebooks
├── 📱 mobile/                   # App React Native
│   ├── src/                    # Código-fonte mobile
│   ├── android/                # Configurações Android
│   ├── ios/                    # Configurações iOS
│   └── assets/                 # Assets mobile
├── 🐳 docker/                   # Containerização
│   ├── backend/                # Dockerfile backend
│   ├── frontend/               # Dockerfile frontend
│   ├── ml/                     # Dockerfile ML services
│   └── nginx/                  # Reverse proxy config
├── 🚀 infra/                    # Infrastructure as Code
│   ├── terraform/              # AWS infrastructure
│   ├── k8s/                    # Kubernetes manifests
│   ├── helm/                   # Helm charts
│   └── scripts/                # Deployment scripts
├── 📊 data/                     # Datasets e samples
│   ├── raw/                    # Dados brutos
│   ├── processed/              # Dados processados
│   ├── annotations/            # Anotações médicas
│   └── synthetic/              # Dados sintéticos
└── 📚 docs/                     # Documentação técnica
    ├── api/                    # API documentation
    ├── user/                   # Manuais de usuário
    ├── dev/                    # Guias de desenvolvimento
    └── architecture/           # Diagramas e specs
```

## 🎯 **CONVENÇÕES DE CÓDIGO**

### **Nomenclatura**:
- **Arquivos**: snake_case para Python, kebab-case para JS/TS
- **Classes**: PascalCase
- **Variáveis**: camelCase (JS) / snake_case (Python)
- **Constantes**: UPPER_CASE
- **Componentes**: PascalCase

### **Estrutura de Commits**:
```
type(scope): description

feat(api): add image quality endpoint
fix(ui): resolve upload progress bug
docs(readme): update installation guide
test(ml): add unit tests for quality models
```

### **Branching Strategy**:
- **main**: Código em produção
- **develop**: Integração de features
- **feature/**: Novas funcionalidades
- **bugfix/**: Correções de bugs
- **hotfix/**: Correções urgentes

---

**Próxima atualização**: Estrutura detalhada por módulo