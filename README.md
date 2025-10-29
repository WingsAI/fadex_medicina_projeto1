# 🏥 SNPQIM - Sistema Nacional para Padronização da Qualidade de Imagens Médicas

**Protocolo nacional inovador para avaliação e padronização da qualidade de imagens médicas oftalmológicas**

[![TRL](https://img.shields.io/badge/TRL-2--3-orange)](https://www.example.com)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)](https://www.example.com)
[![License](https://img.shields.io/badge/License-Open%20Source-green)](https://www.example.com)

---

## 🎯 **VISÃO GERAL**

O **SNPQIM** é um sistema revolucionário que visa resolver a ausência de protocolos padronizados para avaliação da qualidade de imagens médicas oftalmológicas no Brasil. Nossa plataforma oferece um **score de 0 a 100** para cada imagem, garantindo que médicos e pesquisadores utilizem dados de alta qualidade em modelos de IA.

### **Problema Identificado**
- ❌ Médicos e pesquisadores usam modelos de IA sem verificar qualidade das imagens
- ❌ Resultados diagnósticos imprecisos devido a imagens de baixa qualidade  
- ❌ Exames repetidos desnecessários gerando custos ao sistema de saúde
- ❌ Falta de interoperabilidade entre sistemas no Brasil

### **Nossa Solução**
- ✅ **Protocolo nacional** padronizado e interoperável
- ✅ **Plataforma web** com API RESTful para análise automatizada
- ✅ **Score de qualidade** (0-100) para cada imagem médica
- ✅ **Recomendações ML** otimizadas baseadas na qualidade
- ✅ **Integração DICOM/PACS** para workflow clínico

---

## 🏗️ **ARQUITETURA DO SISTEMA**

```
┌─────────────────────────────────────────────────────────────┐
│                    SNPQIM ECOSYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│  🌐 Frontend Web App (React/Next.js)                       │
│  ├── Dashboard Médico                                      │
│  ├── Interface Pesquisador                                 │
│  └── Portal Administrativo                                 │
├─────────────────────────────────────────────────────────────┤
│  🔗 API RESTful (FastAPI/Python)                          │
│  ├── Upload & Processing                                    │
│  ├── Quality Assessment Engine                             │
│  ├── ML Model Recommendations                              │
│  └── DICOM Integration                                      │
├─────────────────────────────────────────────────────────────┤
│  🧠 AI/ML Core (PyTorch/TensorFlow)                       │
│  ├── Image Quality Classifiers                             │
│  ├── Automated Annotation System                           │
│  ├── Pattern Recognition Models                            │
│  └── Continuous Learning Pipeline                          │
├─────────────────────────────────────────────────────────────┤
│  💾 Data Layer                                            │
│  ├── PostgreSQL (Metadata & Users)                         │
│  ├── MongoDB (Medical Images)                              │
│  ├── MinIO (Object Storage)                                │
│  └── Redis (Cache & Sessions)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 **FUNCIONALIDADES PRINCIPAIS**

### **1. Análise de Qualidade Automatizada**
- **Upload batch** de imagens DICOM/JPG/PNG
- **Processamento IA** para avaliação de qualidade
- **Score detalhado** com justificativas técnicas
- **Relatórios** em PDF/JSON bilíngue (PT/EN)

### **2. Recomendações Inteligentes**
- **Sugestão de modelos ML** baseados na qualidade da imagem
- **Parâmetros otimizados** para cada tipo de análise
- **Alertas** para imagens inadequadas para IA
- **Guidelines** de melhoria de qualidade

### **3. Integração Clínica**
- **API DICOM** para PACS existentes
- **Webhook system** para notificações em tempo real
- **SDK** para integração em softwares médicos
- **Compliance** com normas brasileiras e internacionais

### **4. Dashboard Analítico**
- **Métricas institucionais** de qualidade
- **Comparativo temporal** de melhoria
- **Benchmarking** entre instituições
- **Relatórios** executivos automatizados

---

## 👥 **EQUIPE DE PESQUISA**

| Pesquisador | Especialidade | Lattes |
|-------------|---------------|---------|
| **João Victor Dias** | IA/ML, Ciência de Dados | Coordenador Principal |
| **Pedro Carlos Carricondo** | Oftalmologia, Orientador | [Lattes](http://lattes.cnpq.br/1871882988389691) |
| **Raul Henrique Primo Felipe** | Pesquisa Médica | [Lattes](http://lattes.cnpq.br/0935821477999669) |
| **Henrique** | Desenvolvimento | [Lattes](http://lattes.cnpq.br/0962271420929337) |
| **Gustavo Sakuno** | Tecnologia | [Lattes](http://lattes.cnpq.br/9258782448060508) |
| **Andreia Silva** | Especialista Clínica | Em atualização |

---

## 📊 **STATUS DO PROJETO (TRL)**

| Componente | TRL Atual | Meta 2025 | Descrição |
|------------|-----------|-----------|-----------|
| **Protocolo Nacional** | TRL 2 | TRL 5 | Conceito validado → Protótipo |
| **Plataforma Web** | TRL 1 | TRL 4 | Pesquisa básica → Validação lab |
| **JSON Bilíngue** | TRL 2 | TRL 6 | Conceito → Demonstração |
| **Modelos ML** | TRL 3 | TRL 6 | Prova conceito → Piloto |
| **Integração DICOM** | TRL 2 | TRL 5 | Conceito → Protótipo |

**Meta Geral**: Alcançar **TRL 6** em 18 meses (validação clínica e integração piloto)

---

## 🚀 **ROADMAP DE DESENVOLVIMENTO**

### **FASE 1: Fundação (Meses 1-6)**
- [ ] **Setup inicial** da infraestrutura
- [ ] **Desenvolvimento** do protocolo core
- [ ] **Coleta** de dataset inicial (1000+ imagens)
- [ ] **MVP** da plataforma web
- [ ] **Modelos básicos** de classificação

### **FASE 2: Desenvolvimento (Meses 7-12)**
- [ ] **API RESTful** completa
- [ ] **Integração DICOM** funcional
- [ ] **Sistema de anotação** automatizado
- [ ] **Dashboard** analítico
- [ ] **Testes** em ambiente controlado

### **FASE 3: Validação (Meses 13-18)**
- [ ] **Validação clínica** em hospitais parceiros
- [ ] **Integração piloto** com PACS
- [ ] **Compliance** regulatório
- [ ] **Performance** otimizada
- [ ] **Documentação** completa

### **FASE 4: Comercialização (Meses 19-24)**
- [ ] **Spin-off** estabelecida
- [ ] **Go-to-market** strategy
- [ ] **Parcerias** comerciais
- [ ] **Escalabilidade** para outras especialidades
- [ ] **Expansão** internacional

---

## 💰 **INVESTIMENTO E RECURSOS**

### **Orçamento Total**: R$ 2.100.000,00

| Categoria | Valor (R$) | % Total | Descrição |
|-----------|------------|---------|-----------|
| **Desenvolvimento** | 800.000 | 38% | Equipe técnica, infra cloud |
| **Pesquisa & Dados** | 500.000 | 24% | Coleta, anotação, validação |
| **Infraestrutura** | 300.000 | 14% | Servidores, storage, AI compute |
| **Validação Clínica** | 250.000 | 12% | Estudos, certificações |
| **Capacitação** | 150.000 | 7% | Treinamentos, workshops |
| **Contingência** | 100.000 | 5% | Riscos e imprevistos |

---

## 🏢 **MERCADO E OPORTUNIDADES**

### **Mercado Nacional**
- **🏥 Empresas interessadas**: Dasa, Fleury, Philips Brasil
- **📈 Potencial**: R$ 50M+ mercado oftalmologia digital
- **🎯 Target inicial**: 500+ clínicas oftalmológicas
- **🌟 Diferencial**: Primeiro protocolo nacional

### **Mercado Internacional**  
- **🌍 Players globais**: Zeiss, Topcon, Canon Medical
- **💡 Big Tech**: Google Health, IBM Watson Health
- **📊 Market size**: $2B+ medical imaging AI
- **🚀 Opportunity**: Standard global para emerging markets

---

## 🎯 **IMPACTO ESPERADO**

### **Social**
- 🏥 **Melhoria diagnóstica** em hospitais SUS
- ⚡ **Redução** de exames repetidos
- 🎓 **Capacitação** de profissionais
- 🌎 **Democratização** de IA médica

### **Econômico**
- 💰 **Economia** R$ 100M+ em exames desnecessários
- 🏭 **Criação** de 50+ empregos especializados
- 📈 **Atração** de investimento estrangeiro
- 🚀 **Posicionamento** do Brasil como hub de inovação

### **Tecnológico**
- 🧠 **Avanço** em IA médica nacional
- 🔗 **Interoperabilidade** internacional
- 📊 **Padronização** técnica
- 🎯 **Referência** para outras especialidades

---

## 📄 **PROPRIEDADE INTELECTUAL**

### **Patentes Planejadas**
- 🔐 **Algoritmo** de scoring de qualidade
- 🔐 **Protocolo** de padronização DICOM-JSON
- 🔐 **Sistema** de recomendação ML
- 🔐 **Framework** de integração PACS


## 🤝 **APOIO INSTITUCIONAL**

### **Parcerias Acadêmicas**
- 🏛️ **FM-USP**: Validação científica e orientação
- 📚 **Tese doutorado**: Base acadêmica estabelecida
- 🎓 **Publicações**: Pipeline de papers científicos

### **Apoio Profissional**
- 👁️ **CBO**: Conselho Brasileiro de Oftalmologia
- 🏥 **AMB**: Associação Médica Brasileira
- 🔬 **Sociedades**: Oftalmológicas regionais

---

## 💻 **EXECUTANDO O WEBAPP LOCALMENTE**

### **Pré-requisitos**
- Node.js 18+ instalado ([Download](https://nodejs.org/))
- npm (incluído com Node.js)
- Git instalado

### **Instalação e Execução**

1. **Clone o repositório** (se ainda não clonou):
```bash
git clone https://github.com/seu-usuario/snpqim_medicina_projeto1.git
cd snpqim_medicina_projeto1
```

2. **Entre no diretório do webapp**:
```bash
cd webapp
```

3. **Instale as dependências**:
```bash
npm install
```

4. **Inicie o servidor de desenvolvimento**:
```bash
npm run dev
```

5. **Acesse no navegador**:
   - Abra [http://localhost:3000](http://localhost:3000)
   - O webapp será recarregado automaticamente ao editar arquivos

### **Scripts Disponíveis**

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (hot reload) |
| `npm run build` | Cria build otimizado para produção |
| `npm start` | Inicia servidor de produção |
| `npm run lint` | Executa verificação de código |

### **Estrutura do Webapp**

```
webapp/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout principal da aplicação
│   │   ├── page.tsx         # Página inicial (Dashboard)
│   │   └── globals.css      # Estilos globais e utilitários
│   └── components/
│       ├── Sidebar.tsx           # Navegação lateral com menu
│       ├── Header.tsx            # Cabeçalho com perfil usuário
│       ├── DNAVisualization.tsx  # Animação DNA interativa
│       ├── StatsCard.tsx         # Cards de estatísticas
│       ├── HeartRateCard.tsx     # Visualização frequência cardíaca
│       └── ResearchCard.tsx      # Timeline de pesquisas
├── public/                   # Arquivos estáticos
├── package.json             # Dependências do projeto
├── tsconfig.json            # Configuração TypeScript
├── tailwind.config.js       # Configuração Tailwind CSS
└── next.config.js           # Configuração Next.js
```

### **Tecnologias Utilizadas no Frontend**

- **[Next.js 14](https://nextjs.org/)** - Framework React com SSR
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones moderna
- **Canvas API** - Animações customizadas (DNA, gráficos)

### **Componentes Principais**

#### **DNAVisualization**
Visualização 3D interativa de DNA usando Canvas API. Renderiza hélice dupla animada com:
- Partículas em movimento
- Gradientes roxos e azuis
- Efeitos de brilho e profundidade
- Controles interativos

#### **Dashboard Analytics**
Interface completa com:
- Cards de estatísticas em tempo real
- Gráfico de frequência cardíaca animado
- Timeline de pesquisas e análises
- Sistema de notificações
- Perfis conectados

### **Personalização**

#### Modificar cores do tema:
Edite `webapp/tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#8b5cf6',  // Roxo principal
    600: '#7c3aed',
  },
}
```

#### Adicionar novos componentes:
```bash
# Crie em webapp/src/components/
touch src/components/MeuComponente.tsx
```

### **Próximas Integrações**

A interface já está preparada para integração com:
- [ ] **Backend FastAPI** - Endpoints REST
- [ ] **Autenticação JWT** - Login seguro
- [ ] **Upload DICOM** - Processamento de imagens
- [ ] **WebSocket** - Atualizações em tempo real
- [ ] **API ML** - Análise de qualidade

### **Troubleshooting**

**Erro de porta em uso:**
```bash
# Use porta alternativa
npm run dev -- -p 3001
```

**Erro de dependências:**
```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

**Erro de TypeScript:**
```bash
# Verifique tipos
npm run build
```

---

## 📞 **CONTATO E COLABORAÇÃO**

**Coordenador do Projeto**  
📧 **Email**: joao.victor@wingsdobrasil.com.br  
🔗 **LinkedIn**: [João Victor Dias](https://linkedin.com/in/jvictordias)  


**Para Parcerias**  
📝 **Proposals**: Envie carta de interesse  
🤝 **Colaborações**: Abertas a instituições e empresas  
💰 **Investimento**: Captação ativa para aceleração

---

## 📊 **MÉTRICAS DE SUCESSO**

### **Técnicas**
- ✅ **Accuracy >95%** na classificação de qualidade
- ⚡ **<5s** tempo de processamento por imagem
- 🔗 **100%** compatibilidade DICOM
- 📱 **99.9%** uptime da plataforma

### **Clínicas**
- 🏥 **20+ hospitais** usando o sistema
- 👨‍⚕️ **500+ médicos** capacitados
- 🖼️ **100k+ imagens** processadas
- 📊 **85%** satisfação dos usuários

### **Negócio**
- 💰 **Break-even** em 24 meses
- 🚀 **Spin-off** estabelecida e operacional
- 🌎 **Reconhecimento** internacional
- 📈 **ROI >300%** para investidores

---

**🏆 Transformando o futuro da medicina através da padronização inteligente de imagens médicas**

*Projeto desenvolvido com apoio da FM-USP e Conselho Brasileiro de Oftalmologia*