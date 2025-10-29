# 🔄 Versões do Sistema SNPQIM

Este projeto contém **três versões funcionais** que coexistem e podem ser usadas de forma independente ou integrada.

## 📊 Visão Geral das Versões

### 1️⃣ **Versão CLI (Linha de Comando)**
**Localização**: `scripts/test_wingsai.py`
**Propósito**: Análise rápida de imagens via terminal
**Uso**: Desenvolvimento, testes, automação

```bash
# Executar análise
python scripts/test_wingsai.py examples/ --batch

# Gerar relatórios
python scripts/test_wingsai.py examples/ --output results/
```

**Características**:
- ✅ Análise batch de múltiplas imagens
- ✅ Exportação JSON e relatórios
- ✅ Ideal para scripts e automação
- ✅ Usa algoritmo original WingsAI

---

### 2️⃣ **Versão Backend + Frontend HTML**
**Localização**: `src/backend/main.py` + `src/frontend/index.html`
**Propósito**: API REST + interface web simples
**Uso**: Deploy rápido, integração com sistemas existentes

#### Backend (FastAPI)
```bash
# Iniciar API
python src/backend/main.py

# API disponível em http://localhost:8000
```

**Endpoints**:
- `POST /analyze` - Análise de imagem
- `GET /health` - Status do sistema
- `GET /docs` - Documentação Swagger

#### Frontend
```bash
# Abrir interface
open src/frontend/index.html
```

**Características**:
- ✅ API RESTful completa
- ✅ Interface web funcional
- ✅ Upload e visualização de resultados
- ✅ Fácil integração com outros sistemas
- ✅ Usa algoritmo original WingsAI

---

### 3️⃣ **Versão Webapp Moderno (Next.js)**
**Localização**: `webapp/`
**Propósito**: Interface profissional moderna
**Uso**: Produção, apresentações, demonstrações

```bash
# Instalar dependências
cd webapp
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

**Acesso**: [http://localhost:3000](http://localhost:3000)

**Características**:
- ✅ Design moderno inspirado em MYDNA
- ✅ Animações DNA em tempo real (Canvas)
- ✅ Dashboard interativo com métricas
- ✅ Gráfico de frequência cardíaca animado
- ✅ Timeline de pesquisas e análises
- ✅ Totalmente responsivo
- ✅ TypeScript + Tailwind CSS
- ✅ Preparado para integração com API SNPQIM

---

## 🔀 Nomenclatura: WingsAI vs SNPQIM

### WingsAI (Nome Original)
- **Arquivos mantidos**:
  - `src/ml/scoring/wingsai_core.py` - Algoritmo original
  - `scripts/test_wingsai.py` - CLI original
  - Referências em backend/frontend HTML

### SNPQIM (Novo Nome)
- **Sistema Nacional para Padronização da Qualidade de Imagens Médicas**
- **Arquivos novos**:
  - `src/ml/scoring/snpqim_core.py` - Versão renomeada do algoritmo
  - `webapp/` - Interface moderna com SNPQIM branding
  - Documentação atualizada

**Motivo**: Ambas as versões coexistem para:
- ✅ Manter compatibilidade com código existente
- ✅ Permitir transição gradual
- ✅ Facilitar comparações e testes

---

## 🎯 Quando Usar Cada Versão?

### Use a **Versão CLI** quando:
- 🔧 Desenvolvendo e testando algoritmos
- 📊 Processar lotes de imagens
- 🤖 Automatizar análises em pipelines
- 🧪 Validar mudanças rapidamente

### Use o **Backend + Frontend HTML** quando:
- 🔗 Precisar integrar com sistemas existentes
- 📡 Expor API para outros serviços
- 🚀 Deploy rápido sem complexidade
- 📱 Interface simples suficiente

### Use o **Webapp Moderno** quando:
- 🎨 Apresentar para stakeholders/investidores
- 💼 Interface profissional necessária
- 📈 Visualização rica de dados importante
- 🌐 Deploy em produção com UX moderna

---

## 🔄 Roadmap de Integração

### Fase Atual
✅ Três versões funcionando independentemente
✅ Algoritmo FADEX e SNPQIM coexistindo
✅ Webapp com design moderno completo

### Próximos Passos

#### Curto Prazo (1-2 meses)
- [ ] Conectar webapp com backend FastAPI
- [ ] Migrar algoritmo para usar snpqim_core.py
- [ ] Adicionar upload de imagens no webapp
- [ ] Implementar visualização de resultados

#### Médio Prazo (3-6 meses)
- [ ] Autenticação JWT no webapp
- [ ] Dashboard personalizado por usuário
- [ ] Histórico de análises
- [ ] Exportação de relatórios PDF
- [ ] Integração DICOM básica

#### Longo Prazo (6-12 meses)
- [ ] Deprecar versão FADEX (manter apenas SNPQIM)
- [ ] Webapp como interface principal
- [ ] API enterprise com rate limiting
- [ ] Multi-tenancy e permissões
- [ ] Analytics avançado

---

## 🛠️ Estrutura de Arquivos

```
fadex_medicina_projeto1/
│
├── 📚 docs/                        # Documentação
│   ├── START_HERE.md
│   ├── QUICKSTART.md
│   ├── PRD_SNPQIM.md
│   └── ...
│
├── 🔧 scripts/                     # CLI Tools
│   ├── test_fadex.py              # ⭐ CLI Principal
│   ├── test_api.py
│   └── ...
│
├── 💻 src/                         # Backend Original
│   ├── ml/scoring/
│   │   ├── wingsai_core.py        # ⭐ Algoritmo WingsAI
│   │   └── snpqim_core.py         # ⭐ Algoritmo SNPQIM
│   ├── backend/
│   │   └── main.py                # ⭐ API FastAPI
│   └── frontend/
│       └── index.html             # ⭐ Interface HTML
│
└── 🌐 webapp/                      # Webapp Moderno
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx           # ⭐ Dashboard
    │   │   └── layout.tsx
    │   └── components/
    │       ├── DNAVisualization.tsx
    │       ├── Sidebar.tsx
    │       └── ...
    ├── package.json
    └── tsconfig.json
```

---

## 🤝 Contribuindo

### Para CLI/Backend
```bash
# Trabalhe nos arquivos existentes
edit src/ml/scoring/wingsai_core.py
edit scripts/test_wingsai.py
```

### Para Webapp
```bash
cd webapp
npm install
npm run dev
# Edite componentes em webapp/src/
```

---

## 📞 Suporte

- **CLI Issues**: Relacionadas a `scripts/` e `src/ml/`
- **API Issues**: Relacionadas a `src/backend/`
- **Webapp Issues**: Relacionadas a `webapp/`

**Documentação Completa**: [docs/START_HERE.md](docs/START_HERE.md)

---

**Última atualização**: Outubro 2025
**Versão**: 1.0.0 - Três versões coexistindo
