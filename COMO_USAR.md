# 🚀 Como Usar o SNPQIM - Guia Rápido

## ⚡ Método Mais Fácil (Windows)

### **Opção 1: Iniciar Tudo de Uma Vez**

1. Navegue até a pasta `scripts/`
2. Clique duas vezes em **`start_all.bat`**
3. Aguarde as duas janelas abrirem:
   - **Janela 1**: Backend API (porta 8000)
   - **Janela 2**: WebApp (porta 3000)
4. Aguarde alguns segundos para compilar
5. Acesse: **http://localhost:3000**

### **Opção 2: Iniciar Separadamente**

#### Backend (Terminal 1):
```bash
# Clique duas vezes em:
scripts\start_backend.bat

# Ou execute no terminal:
python src\backend\main.py
```

Você verá:
```
✅ Módulo fadex_core importado com sucesso
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### WebApp (Terminal 2):
```bash
# Clique duas vezes em:
scripts\start_webapp.bat

# Ou execute no terminal:
cd webapp
npm run dev
```

Você verá:
```
▲ Next.js 14.2.33
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

---

## 🐧 Linux/Mac

### Backend:
```bash
cd fadex_medicina_projeto1
python3 src/backend/main.py
```

### WebApp:
```bash
cd fadex_medicina_projeto1/webapp
npm install  # Apenas na primeira vez
npm run dev
```

---

## ✅ Verificando se Está Funcionando

### 1. **Backend API**
Abra: http://localhost:8000

Deve mostrar:
```json
{
  "name": "FADEX API",
  "version": "1.0.0",
  "status": "operational"
}
```

### 2. **WebApp**
Abra: http://localhost:3000

Você deve ver:
- ✅ **Indicador verde "API Online"** no topo
- ✅ Interface WingsAI com container arredondado
- ✅ Área de upload de imagem

❌ Se aparecer **"API Offline"** em vermelho:
- O backend não está rodando
- Inicie o backend primeiro (veja acima)
- Clique em "Retentar" após iniciar

---

## 📤 Como Analisar uma Imagem

### No WebApp:

1. **Certifique-se que vê "API Online" (verde) no topo**
2. Arraste uma imagem médica para a área de upload
3. Ou clique para selecionar
4. Clique em **"Analisar Qualidade"**
5. Aguarde alguns segundos
6. Veja o resultado:
   - **Score Global** (0-100)
   - **Confiança** da análise
   - **ML Readiness** (excellent, good, fair, poor)
   - **Adequação Clínica** (diagnostic, screening, inadequate)
   - **Scores por dimensão** (nitidez, exposição, contraste, etc.)
   - **Recomendações** de melhoria

### Via CLI (Terminal):

```bash
# Gerar imagens de teste
python scripts/create_test_images.py

# Analisar uma imagem
python scripts/test_fadex.py examples/test_high_quality.jpg

# Analisar pasta inteira
python scripts/test_fadex.py examples/ --batch
```

### Via API (cURL):

```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -F "file=@examples/test.jpg" \
  -F "exam_type=fundoscopy"
```

---

## 🔧 Problemas Comuns

### ❌ Erro: "API Offline"

**Causa**: Backend não está rodando

**Solução**:
```bash
# Inicie o backend
python src\backend\main.py

# Ou use o script
scripts\start_backend.bat
```

### ❌ Erro: "Module not found 'ml'"

**Causa**: Executando de pasta errada

**Solução**:
```bash
# Sempre execute da RAIZ do projeto
cd c:\Users\jvict\OneDrive\Documents\GitHub\fadex_medicina_projeto1
python src\backend\main.py
```

### ❌ Erro: "Port 8000 already in use"

**Causa**: Backend já está rodando ou outra aplicação usa a porta

**Solução**:
```bash
# Pare o backend anterior (CTRL+C)
# Ou mude a porta em src/backend/main.py:
uvicorn.run(app, host="0.0.0.0", port=8001)  # Mude para 8001
```

### ❌ Erro: "Port 3000 already in use"

**Causa**: WebApp já está rodando

**Solução**:
```bash
# Pare o webapp anterior (CTRL+C)
# Ou use porta alternativa:
cd webapp
npm run dev -- -p 3001  # Usa porta 3001
```

### ❌ Erro: "NumPy incompatível"

**Solução**:
```bash
# Use o script de correção
.\scripts\fix_numpy.sh

# Ou manual:
pip uninstall numpy -y
pip install "numpy<2"
pip install -r requirements-minimal.txt
```

---

## 📊 Exemplos de Uso

### Exemplo 1: Análise Rápida no WebApp

1. Inicie sistema: `scripts\start_all.bat`
2. Acesse: http://localhost:3000
3. Veja "API Online" verde ✅
4. Arraste imagem de retinografia
5. Clique "Analisar Qualidade"
6. Veja score: **87.3/100**
7. Veja recomendações

### Exemplo 2: Batch Processing via CLI

```bash
# Analisar 100 imagens de uma vez
python scripts/test_fadex.py dataset/ --batch --output results.json

# Ver resumo
cat results.json
```

### Exemplo 3: Integração com Sistema Externo

```python
import requests

# Upload de imagem via API
with open("retina.jpg", "rb") as f:
    response = requests.post(
        "http://localhost:8000/api/v1/analyze",
        files={"file": f},
        data={"exam_type": "fundoscopy"}
    )

result = response.json()
score = result["result"]["global_score"]

if score < 60:
    print("⚠️ Qualidade insuficiente - refazer exame")
else:
    print(f"✅ Qualidade adequada: {score}/100")
```

---

## 🎯 Fluxo Completo

```
┌─────────────────────────────────────────────┐
│  1. Iniciar Backend (porta 8000)            │
│     python src/backend/main.py              │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  2. Iniciar WebApp (porta 3000)             │
│     cd webapp && npm run dev                │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  3. Acessar http://localhost:3000           │
│     Ver indicador "API Online" verde        │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  4. Upload de Imagem                        │
│     Arrastar ou clicar para selecionar      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  5. Clicar "Analisar Qualidade"             │
│     WebApp → Backend API → fadex_core.py    │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  6. Ver Resultado                           │
│     Score, confiança, recomendações         │
└─────────────────────────────────────────────┘
```

---

## 📚 Documentação Adicional

- **Integração Completa**: [INTEGRACAO.md](INTEGRACAO.md)
- **Múltiplas Versões**: [VERSOES.md](VERSOES.md)
- **Solução de Problemas**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Guia de Desenvolvimento**: [docs/Guia_Desenvolvimento.md](docs/Guia_Desenvolvimento.md)
- **Início Rápido**: [docs/START_HERE.md](docs/START_HERE.md)

---

## 🆘 Ainda com Problemas?

Execute o verificador de setup:
```bash
python scripts/verify_setup.py
```

Ou abra uma issue no GitHub com:
- Seu sistema operacional
- Mensagem de erro completa
- Output do `python --version` e `node --version`

---

**Última atualização**: Outubro 2025
**Versão**: 2.0 - Com scripts automatizados e indicador de API
