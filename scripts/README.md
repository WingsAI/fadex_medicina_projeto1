# 🔧 FADEX Scripts

Scripts utilitários para testar e executar o sistema FADEX.

---

## 📜 Scripts Disponíveis

### 1. `create_test_images.py`
Gera imagens sintéticas para teste do sistema.

```bash
python scripts/create_test_images.py
```

**Output:**
- Cria pasta `examples/` com ~13 imagens
- Imagens de alta, média e baixa qualidade
- Imagens com artifacts específicos

---

### 2. `test_fadex.py`
Testa o algoritmo de scoring sem necessidade de infraestrutura.

```bash
# Analisa uma única imagem
python scripts/test_fadex.py examples/fundus_high_quality.png

# Analisa múltiplas imagens (batch)
python scripts/test_fadex.py examples/ --batch

# Especifica tipo de exame
python scripts/test_fadex.py examples/oct_high_quality.png --exam=oct
```

**Output:**
- Resultados formatados no terminal
- Arquivos JSON em `results/`
- Resumo estatístico do batch

---

### 3. `test_api.py`
Testa todos os endpoints da API REST.

```bash
# Certifique-se de que a API está rodando primeiro
python src/backend/main.py  # Em outro terminal

# Execute os testes
python scripts/test_api.py
```

**Testa:**
- Health check
- Endpoints de info
- Análise de imagem única
- Análise em batch

---

### 4. `verify_setup.py`
Verifica se o ambiente está configurado corretamente.

```bash
python scripts/verify_setup.py
```

**Verifica:**
- Versão do Python
- Arquivos essenciais
- Dependências instaladas
- Estrutura de pastas

---

### 5. `start.sh`
Script interativo de inicialização.

```bash
./scripts/start.sh
```

**Opções:**
1. Teste Local - Apenas algoritmo
2. API + Frontend - Sistema completo
3. Docker - Ambiente containerizado

---

## 💡 Fluxo Recomendado

### Primeira Vez

```bash
# 1. Verifique o setup
python scripts/verify_setup.py

# 2. Gere imagens de teste
python scripts/create_test_images.py

# 3. Teste o algoritmo
python scripts/test_fadex.py examples/ --batch

# 4. Veja os resultados
ls results/
cat results/batch_summary_*.json
```

### Uso Diário

```bash
# Análise rápida de uma imagem
python scripts/test_fadex.py path/to/image.png

# Iniciar sistema completo
./scripts/start.sh  # Escolha opção 2
```

---

## 🔍 Detalhes dos Scripts

### create_test_images.py

**Gera:**
- `fundus_high_quality.png` - Fundoscopia excelente
- `fundus_medium_quality.png` - Fundoscopia boa
- `fundus_low_quality.png` - Fundoscopia ruim
- `fundus_high_res.png` - Alta resolução (1024x1024)
- `fundus_low_res.png` - Baixa resolução (256x256)
- `oct_*.png` - Imagens OCT em diferentes qualidades
- `artifact_*.png` - Imagens com artifacts específicos

**Tecnologia:**
- NumPy para geração de arrays
- OpenCV para desenho de estruturas
- Simula disco óptico, vasos, mácula

---

### test_fadex.py

**Features:**
- Suporta PNG, JPG, JPEG
- Batch processing com paralelização potencial
- Barra de progresso visual
- Estatísticas agregadas
- Export para JSON

**Classes:**
- `FadexTester` - Orquestra testes
- Métodos para single/batch analysis
- Sistema de relatórios

---

### test_api.py

**Features:**
- Testes automatizados de todos endpoints
- Upload de arquivos real
- Validação de responses
- Estatísticas de sucesso/falha

**Classes:**
- `FadexAPITester` - Framework de teste
- Métodos para cada endpoint
- Resumo final de testes

---

### verify_setup.py

**Features:**
- Checklist completo de requisitos
- Diferencia obrigatório de opcional
- Sugere comandos de correção
- Score final de prontidão

**Classes:**
- `SetupVerifier` - Motor de verificação
- Sistema de checks com contadores
- Relatório formatado

---

### start.sh

**Features:**
- Menu interativo
- Configuração automática de venv
- Instalação de dependências
- Geração de imagens se necessário
- Múltiplos modos de execução

---

## ⚠️ Notas Importantes

### Caminhos
Todos os scripts devem ser executados **da raiz do projeto**, não de dentro da pasta `scripts/`:

```bash
# ✅ Correto
cd fadex_medicina_projeto1
python scripts/test_fadex.py examples/ --batch

# ❌ Errado
cd fadex_medicina_projeto1/scripts
python test_fadex.py examples/ --batch  # Vai falhar!
```

### Imports
Os scripts usam caminhos relativos para importar módulos:

```python
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))
```

Isso permite importar de `src/` independente de onde o script está.

---

## 🐛 Solução de Problemas

### "Module not found: ml"

Você está executando de dentro de `scripts/`. Execute da raiz:

```bash
cd ..  # Volta para raiz
python scripts/test_fadex.py examples/ --batch
```

### "No images found"

```bash
python scripts/create_test_images.py
```

### "API not running"

```bash
# Terminal 1
python src/backend/main.py

# Terminal 2
python scripts/test_api.py
```

### "Permission denied" no start.sh

```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

---

## 📚 Documentação Relacionada

- [docs/START_HERE.md](../docs/START_HERE.md) - Primeiro contato
- [docs/QUICKSTART.md](../docs/QUICKSTART.md) - Guia rápido
- [docs/SETUP.md](../docs/SETUP.md) - Setup detalhado
- [README.md](../README.md) - Documentação principal

---

**Dúvidas?** Veja a documentação completa em `docs/` ou abra uma issue.
