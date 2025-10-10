# 🔧 Correção Rápida - Incompatibilidade NumPy 2.x

## ⚠️ Problema

Se você viu este erro:

```
A module that was compiled using NumPy 1.x cannot be run in
NumPy 2.2.6 as it may crash.
```

Ou este erro do OpenCV:

```
cv2.error: OpenCV(4.12.0) ... Unsupported combination of source format
```

É porque o NumPy 2.x não é compatível com o PyTorch atual.

---

## ✅ Solução Rápida

Execute estes comandos:

```bash
# Desinstale NumPy 2.x
pip uninstall numpy -y

# Instale NumPy 1.x compatível
pip install "numpy>=1.24.0,<2.0.0"

# Reinstale dependências (garante compatibilidade)
pip install -r requirements-minimal.txt --force-reinstall
```

Ou de forma ainda mais simples:

```bash
# Uma linha resolve tudo
pip install "numpy<2" --force-reinstall && pip install -r requirements-minimal.txt
```

---

## 🧪 Teste Se Funcionou

```bash
# Deve executar sem erros agora
python3 scripts/test_fadex.py examples/fundus_high_quality.png
```

Se funcionar, você verá:

```
✓ Imagem carregada: (512, 512, 3)
⚙️  Executando análise FADEX...

📊 RESULTADOS FADEX
────────────────────
🎯 Score Global: XX.X/100
...
```

---

## 🔍 Verificar Versão

```bash
python3 -c "import numpy; print(f'NumPy: {numpy.__version__}')"
```

Deve mostrar algo como `NumPy: 1.26.4` (qualquer 1.x está OK)

---

## 📝 O Que Foi Corrigido

Os arquivos `requirements.txt` e `requirements-minimal.txt` agora especificam:

```
numpy>=1.24.0,<2.0.0
```

Isso força o uso do NumPy 1.x que é compatível com PyTorch e OpenCV.

---

## 🚀 Próximos Passos

Depois da correção:

```bash
# 1. Teste o algoritmo
python3 scripts/test_fadex.py examples/ --batch

# 2. Veja os resultados
ls results/

# 3. Continue usando normalmente!
```

---

## ❓ Ainda Com Problemas?

### Erro: "No module named numpy"

```bash
pip install numpy==1.26.4
```

### Erro: "Could not find version that satisfies"

```bash
# Use versão específica conhecida
pip install numpy==1.26.4 opencv-python==4.8.1.78 scikit-image==0.22.0
```

### Limpar Tudo e Recomeçar

```bash
# Remove tudo
pip uninstall numpy scipy scikit-image opencv-python torch -y

# Reinstala do zero
pip install -r requirements-minimal.txt
```

---

## 💡 Por Que Isso Aconteceu?

- NumPy 2.0 foi lançado em 2024 com mudanças incompatíveis
- PyTorch e OpenCV ainda não suportam totalmente NumPy 2.x
- A comunidade científica Python está migrando gradualmente
- Por enquanto, NumPy 1.x é a versão estável para ML

---

**Status**: ✅ Corrigido nos requirements. Apenas reinstale as dependências.

**Tempo estimado**: 2 minutos

**Complexidade**: Baixa - comando único resolve
