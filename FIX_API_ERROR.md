# 🔧 Correção do Erro 500 na API FADEX

## ✅ O Que Foi Corrigido

Implementei várias melhorias no backend para resolver o erro 500:

### 1. **Import Path Corrigido** ✅
- Caminho relativo agora funciona independente de onde a API é executada
- Adicionado logging para verificar imports
- Tratamento de erro se módulo não carregar

### 2. **Logging Detalhado** ✅
- Logs em cada etapa do processamento
- Stacktrace completo em caso de erro
- Facilita identificar exatamente onde falha

### 3. **Endpoint de Debug** ✅
- Novo endpoint `/api/v1/debug`
- Testa algoritmo sem precisar de upload
- Útil para diagnosticar problemas

### 4. **Error Handling Melhorado** ✅
- Frontend mostra erro detalhado do servidor
- Console.log para debug
- Mensagens mais claras para o usuário

### 5. **Script de Teste Rápido** ✅
- `scripts/test_api_quick.py`
- Testa todos os endpoints automaticamente
- Identifica problema rapidamente

---

## 🚀 Como Testar Agora

### Passo 1: Reinicie a API

```bash
# Se estiver rodando, pare com CTRL+C
# Depois reinicie:
python3 src/backend/main.py
```

**Você deve ver:**
```
INFO:     Started server process
INFO:__main__:Adicionado ao path: /Users/jv/.../src
INFO:__main__:✅ Módulo fadex_core importado com sucesso
INFO:     Application startup complete.
```

Se você ver `✅ Módulo fadex_core importado com sucesso`, o import está OK!

---

### Passo 2: Teste o Debug Endpoint

**Opção A: Pelo navegador**
```
http://localhost:8000/api/v1/debug
```

**Opção B: Por curl**
```bash
curl http://localhost:8000/api/v1/debug
```

**Deve retornar:**
```json
{
  "success": true,
  "message": "Algoritmo funcionando corretamente",
  "test_result": {
    "global_score": 29.6,
    "ml_readiness": "poor",
    "confidence": 69.7
  }
}
```

Se funcionar, o algoritmo está OK! ✅

---

### Passo 3: Execute o Script de Teste

```bash
python3 scripts/test_api_quick.py
```

Isso testa:
- ✅ Health check
- ✅ Debug endpoint (algoritmo)
- ✅ Upload de imagem real

**Output esperado:**
```
🧪 FADEX API - Teste Rápido de Diagnóstico
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  Testando Health Check...
   ✅ Health check OK

2️⃣  Testando Debug Endpoint...
   ✅ Algoritmo funcionando
   Score teste: 29.6

3️⃣  Testando Upload de Imagem...
   ✅ Upload e análise OK
   Score: 6.6/100

🎉 TODOS OS TESTES PASSARAM!
```

---

### Passo 4: Teste no Frontend

```bash
# Abra o frontend
open src/frontend/index.html
```

**Ou com servidor local:**
```bash
cd src/frontend
python3 -m http.server 3000
# Acesse: http://localhost:3000
```

1. Arraste uma imagem de `examples/`
2. Clique em "Analisar Qualidade"
3. Aguarde ~30 segundos
4. Veja os resultados!

---

## 🔍 Se Ainda Houver Erro

### Verifique os Logs da API

Quando você clicar em "Analisar" no frontend, olhe o terminal da API.

Você deve ver algo como:
```
INFO:__main__:📥 Recebido arquivo: fundus_high_quality.png, tipo: image/png
INFO:__main__:📖 Lendo arquivo...
INFO:__main__:✓ Arquivo lido: 397155 bytes
INFO:__main__:✓ Imagem decodificada: (512, 512, 3)
INFO:__main__:🔬 Iniciando análise FADEX...
INFO:__main__:✅ Análise concluída! Score: 6.6/100
```

### Possíveis Problemas e Soluções

#### ❌ Erro: "Module 'ml' not found"
```bash
# Verifique se está executando da raiz do projeto
pwd  # Deve mostrar .../fadex_medicina_projeto1

# Execute novamente
python3 src/backend/main.py
```

#### ❌ Erro: "OpenCV error: Unsupported combination"
Já corrigimos isso no `fadex_core.py`, mas se ainda aparecer:
```bash
# Verifique versões
python3 -c "import numpy; print(numpy.__version__)"  # Deve ser 1.x
python3 -c "import cv2; print(cv2.__version__)"      # Deve ser 4.x
```

#### ❌ Erro: "Failed to fetch" no frontend
A API não está rodando. Certifique-se:
```bash
# Terminal 1
python3 src/backend/main.py

# Terminal 2
curl http://localhost:8000/health
```

#### ❌ Timeout no processamento
Normal para imagens grandes. Aguarde até ~60 segundos.

---

## 📊 Entendendo os Logs

### Logs Normais (Tudo OK):
```
INFO:__main__:📥 Recebido arquivo: test.png
INFO:__main__:✓ Arquivo lido: 500000 bytes
INFO:__main__:✓ Imagem decodificada: (512, 512, 3)
INFO:__main__:🔬 Iniciando análise FADEX...
INFO:__main__:✅ Análise concluída! Score: 45.2/100
INFO:     127.0.0.1:53140 - "POST /api/v1/analyze HTTP/1.1" 200 OK
```

### Logs com Erro:
```
ERROR:__main__:❌ Erro ao processar imagem: {...}
ERROR:__main__:   Traceback: [stacktrace completo]
INFO:     127.0.0.1:53140 - "POST /api/v1/analyze HTTP/1.1" 500 Internal Server Error
```

Se você ver isso, copie o traceback completo e me envie.

---

## 🎯 Checklist de Verificação

Antes de testar no frontend, verifique:

- [ ] API rodando (`python3 src/backend/main.py`)
- [ ] Vê mensagem `✅ Módulo fadex_core importado com sucesso`
- [ ] `/api/v1/debug` retorna success=true
- [ ] `scripts/test_api_quick.py` passa todos os testes
- [ ] Imagens de teste existem em `examples/`

Se todos ✅, o frontend deve funcionar!

---

## 💡 Dicas

1. **Use o Debug Endpoint primeiro** - Mais rápido que testar upload
2. **Veja os logs da API** - Essenciais para diagnosticar problemas
3. **Console do navegador** - Aperte F12 e veja aba Console
4. **Teste com imagem pequena** - Mais rápido para debug

---

## 📞 Se Nada Funcionar

Execute este comando e me envie o output:

```bash
python3 << 'EOF'
import sys
print(f"Python: {sys.version}")

try:
    import numpy
    print(f"✅ NumPy: {numpy.__version__}")
except:
    print("❌ NumPy não instalado")

try:
    import cv2
    print(f"✅ OpenCV: {cv2.__version__}")
except:
    print("❌ OpenCV não instalado")

try:
    sys.path.insert(0, 'src')
    from ml.scoring.fadex_core import analyze_image_quality
    print("✅ fadex_core importa OK")

    img = numpy.random.rand(128, 128)
    score = analyze_image_quality(img)
    print(f"✅ Algoritmo funciona! Score: {score.global_score:.1f}")
except Exception as e:
    print(f"❌ Erro: {e}")
    import traceback
    traceback.print_exc()
EOF
```

---

**Status**: ✅ Correções implementadas e testadas
**Próximo passo**: Testar no seu ambiente
