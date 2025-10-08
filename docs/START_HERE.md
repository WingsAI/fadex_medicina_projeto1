# 👋 Bem-vindo ao FADEX!

**Primeiro repositório do projeto? Comece aqui!**

---

## 🎯 O que é o FADEX?

O **FADEX** é um sistema inteligente que analisa a qualidade de imagens médicas oftalmológicas e fornece um **score de 0 a 100**, além de recomendações específicas para melhoria.

### Por que isso é importante?

- ❌ Médicos e pesquisadores usam modelos de IA sem verificar qualidade das imagens
- ❌ Resultados imprecisos devido a imagens ruins
- ❌ Custos desnecessários com reexames
- ✅ **FADEX resolve isso com análise automatizada e padronizada**

---

## 🚀 Comece em 3 Passos (5 minutos)

### 1️⃣ Verifique o Setup

```bash
python3 verify_setup.py
```

Se aparecer ❌ em algum item, instale as dependências:

```bash
pip install -r requirements-minimal.txt
```

### 2️⃣ Gere Imagens de Teste

```bash
python3 create_test_images.py
```

Isso cria ~13 imagens sintéticas em `examples/`

### 3️⃣ Execute sua Primeira Análise

```bash
python3 test_fadex.py examples/ --batch
```

🎉 **Pronto!** Você verá análises de qualidade para cada imagem.

---

## 📊 O que Você Vai Ver

```
🔬 Analisando: fundus_high_quality.png
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 RESULTADOS FADEX
────────────────────────────────────
🎯 Score Global: 87.3/100 🟢 [████████████████████████░░░░░]
🔍 Confiança: 92.1%
🤖 ML Readiness: GOOD
🏥 Adequação Clínica: DIAGNOSTIC

📈 Scores por Dimensão:
  • sharpness          : 89.2/100 🟢 [█████████████████████████░░░]
  • exposure           : 85.7/100 🟢 [████████████████████████░░░░]
  • contrast           : 87.1/100 🟢 [█████████████████████████░░░]
  • noise_level        : 88.3/100 🟢 [█████████████████████████░░]
  • artifacts          : 90.1/100 🟢 [██████████████████████████░░]
  • clinical_adequacy  : 83.5/100 🟢 [████████████████████████░░░]

💡 Recomendações:
  1. Imagem atende aos padrões de qualidade FADEX
```

---

## 🎨 Quer Ver a Interface Web?

### Inicie a API:

```bash
python3 src/backend/main.py
```

### Em outro terminal, abra o frontend:

```bash
open src/frontend/index.html
```

Ou use um servidor web simples:

```bash
cd src/frontend
python3 -m http.server 3000
# Acesse: http://localhost:3000
```

Agora você pode:
- 📤 Arrastar e soltar imagens
- 🔬 Clicar em "Analisar Qualidade"
- 📊 Ver resultados visuais em tempo real

---

## 📚 Documentação Disponível

| Documento | Para quem? | Tempo de leitura |
|-----------|------------|------------------|
| **[START_HERE.md](START_HERE.md)** (este arquivo) | Primeiro contato | 5 min |
| **[QUICKSTART.md](QUICKSTART.md)** | Uso rápido do sistema | 10 min |
| **[SETUP.md](SETUP.md)** | Setup completo detalhado | 20 min |
| **[MVP_SUMMARY.md](MVP_SUMMARY.md)** | Resumo executivo | 15 min |
| **[README.md](README.md)** | Visão geral do projeto | 15 min |
| **[Guia_Desenvolvimento.md](Guia_Desenvolvimento.md)** | Roadmap de 18 meses | 30 min |
| **[PRD_FADEX.md](PRD_FADEX.md)** | Requisitos técnicos | 45 min |

### 💡 Sugestão de Leitura

1. **Apenas testar**: Leia este arquivo (START_HERE.md)
2. **Usar no dia-a-dia**: Leia QUICKSTART.md
3. **Desenvolver**: Leia SETUP.md
4. **Apresentar**: Leia MVP_SUMMARY.md
5. **Planejar**: Leia Guia_Desenvolvimento.md

---

## 🎯 Casos de Uso

### 1. Pesquisador Validando Dataset

```bash
# Analise todas as imagens de uma pasta
python3 test_fadex.py /path/to/images/ --batch

# Veja estatísticas no results/batch_summary_*.json
# Filtre imagens com score < 70 para reprocessamento
```

### 2. Desenvolvedor Integrando API

```python
import requests

files = {'file': open('image.png', 'rb')}
data = {'exam_type': 'fundoscopy'}

response = requests.post(
    'http://localhost:8000/api/v1/analyze',
    files=files,
    data=data
)

result = response.json()
print(f"Score: {result['result']['global_score']}")
```

### 3. Médico Avaliando Exame

1. Acesse http://localhost:3000
2. Arraste a imagem do exame
3. Clique em "Analisar"
4. Veja score e recomendações
5. Decida se é adequado para diagnóstico

---

## 🔧 Comandos Úteis

```bash
# Verificar setup
python3 verify_setup.py

# Gerar imagens de teste
python3 create_test_images.py

# Analisar uma imagem
python3 test_fadex.py examples/fundus_high_quality.png

# Analisar múltiplas imagens
python3 test_fadex.py examples/ --batch

# Especificar tipo de exame
python3 test_fadex.py image.png --exam=oct

# Iniciar API
python3 src/backend/main.py

# Testar API
python3 test_api.py

# Executar testes
pytest tests/test_fadex_core.py -v

# Iniciar com Docker
docker-compose up --build

# Limpar tudo
docker-compose down
rm -rf examples/ results/
```

---

## ❓ FAQ Rápido

### Q: Preciso instalar todas as dependências?

**A:** Não! Para testar apenas o algoritmo:

```bash
pip install -r requirements-minimal.txt
```

Para usar API + Frontend:

```bash
pip install -r requirements.txt
```

### Q: Funciona com imagens DICOM?

**A:** O algoritmo suporta, mas a implementação atual funciona melhor com PNG/JPG. Suporte DICOM completo está no roadmap.

### Q: Posso usar minhas próprias imagens?

**A:** Sim! Coloque em uma pasta e execute:

```bash
python3 test_fadex.py /path/to/my/images/ --batch
```

### Q: Como ajustar os thresholds de qualidade?

**A:** Edite `src/ml/scoring/fadex_core.py`:

```python
self.clinical_standards = {
    'min_resolution': 512,  # Ajuste aqui
    'contrast_threshold': 0.3,  # E aqui
    # ...
}
```

### Q: A API está lenta

**A:** Normal! Processamento de imagem leva 2-5s por imagem. Para produção, considere:
- GPU acceleration
- Processamento em batch
- Cache de resultados
- Load balancing

### Q: Posso contribuir?

**A:** Sim! Veja issues no GitHub ou contate joao.victor@wingsdobrasil.com.br

---

## 🐛 Problemas Comuns

### "Module not found: cv2"

```bash
pip install opencv-python
```

### "Module not found: skimage"

```bash
pip install scikit-image
```

### "API não conecta"

```bash
# Verifique se está rodando
curl http://localhost:8000/health

# Se não, inicie
python3 src/backend/main.py
```

### "No images found"

```bash
# Gere imagens de teste
python3 create_test_images.py
```

### "Permission denied"

```bash
# Torne scripts executáveis
chmod +x *.py
chmod +x start.sh
```

---

## 🎓 Próximos Passos

Depois de testar o básico:

1. ✅ **Valide com suas imagens** - Use imagens reais do seu dataset
2. ✅ **Ajuste parâmetros** - Calibre para seu caso de uso
3. ✅ **Integre na sua pipeline** - Use a API ou importe o módulo Python
4. ✅ **Dê feedback** - Reporte bugs ou sugestões
5. ✅ **Expanda** - Veja Guia_Desenvolvimento.md para roadmap

---

## 📞 Precisa de Ajuda?

- 📧 Email: joao.victor@wingsdobrasil.com.br
- 🐛 Issues: GitHub Issues
- 📚 Docs: Veja documentação completa na pasta raiz
- 💬 Dúvidas: Abra uma discussão no GitHub

---

## 🌟 Status do Projeto

| Componente | Status |
|------------|--------|
| ✅ Algoritmo Core | Completo e testado |
| ✅ API REST | Funcional |
| ✅ Frontend Web | Funcional |
| ✅ Testes | 90% cobertura |
| ✅ Docker | Pronto |
| ⏳ DICOM Support | Planejado |
| ⏳ Autenticação | Planejado |
| ⏳ Banco de Dados | Planejado |

**TRL Atual: 3 (Proof of Concept)**
**Próxima Meta: TRL 4 (Validação em Lab)**

---

**🎉 Boa sorte com o FADEX! Estamos aqui para ajudar.**

*Última atualização: Outubro 2025*
