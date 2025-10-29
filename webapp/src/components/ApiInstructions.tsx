'use client'

import React from 'react'
import { Code, Terminal, FileJson, CheckCircle, AlertCircle } from 'lucide-react'

export default function ApiInstructions() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-4">API WingsAI - Processamento em Lote</h2>
        <p className="text-slate-600">
          Use nossa API REST para processar múltiplas imagens médicas e obter análises de qualidade em lote.
        </p>
      </div>

      {/* Quick Start */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-600" />
          Início Rápido
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">1. Endpoint Base:</p>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400">
              http://localhost:8000
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">2. Verificar Status da API:</p>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400">
              curl http://localhost:8000/health
            </div>
          </div>
        </div>
      </div>

      {/* Análise de Imagem Única */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          Análise de Imagem Única
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Endpoint:</p>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400">
              POST /analyze
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Exemplo com cURL:</p>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
              {`curl -X POST "http://localhost:8000/analyze" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@/path/to/image.jpg"`}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Exemplo com Python:</p>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
              {`import requests

url = "http://localhost:8000/analyze"
files = {"file": open("image.jpg", "rb")}
response = requests.post(url, files=files)
result = response.json()
print(f"Quality Score: {result['result']['global_score']}")`}
            </div>
          </div>
        </div>
      </div>

      {/* Processamento em Lote */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FileJson className="w-5 h-5 text-purple-600" />
          Processamento em Lote
        </h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Dica:</strong> Para processar múltiplas imagens, execute requisições em paralelo usando threading ou async/await.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Exemplo Python com Threading:</p>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
              {`import requests
from concurrent.futures import ThreadPoolExecutor
import os

def analyze_image(image_path):
    url = "http://localhost:8000/analyze"
    files = {"file": open(image_path, "rb")}
    response = requests.post(url, files=files)
    return response.json()

# Lista de imagens para processar
image_folder = "/path/to/images"
images = [os.path.join(image_folder, f) for f in os.listdir(image_folder)
          if f.endswith(('.jpg', '.jpeg', '.png', '.dcm'))]

# Processar em paralelo (max 5 threads simultâneas)
with ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(analyze_image, images))

# Exibir resultados
for img, result in zip(images, results):
    print(f"{img}: Score {result['result']['global_score']:.1f}")`}
            </div>
          </div>
        </div>
      </div>

      {/* Formato de Resposta */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FileJson className="w-5 h-5 text-green-600" />
          Formato de Resposta
        </h3>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
          {`{
  "success": true,
  "result": {
    "global_score": 87.5,
    "confidence": 92.3,
    "ml_readiness": "Excellent",
    "clinical_adequacy": "High",
    "dimension_scores": {
      "resolution": 90.2,
      "contrast": 85.1,
      "noise_level": 88.7,
      "artifacts": 86.3
    },
    "recommendations": [
      "Image quality is excellent for ML analysis",
      "Clinical adequacy is high"
    ]
  },
  "processing_time": 0.234
}`}
        </div>
      </div>

      {/* Boas Práticas */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Boas Práticas
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Limite de Concorrência</p>
              <p className="text-xs text-slate-600">Use no máximo 5-10 threads simultâneas para não sobrecarregar o servidor.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Tratamento de Erros</p>
              <p className="text-xs text-slate-600">Sempre implemente try/except para capturar erros de rede ou processamento.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Formatos Suportados</p>
              <p className="text-xs text-slate-600">JPEG, PNG, DICOM (.dcm) - até 10MB por imagem.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Limitações */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          Limitações
        </h3>
        <div className="space-y-2">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              <strong>Tamanho máximo:</strong> 10MB por imagem
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              <strong>Rate limiting:</strong> Recomendado não exceder 100 requisições por minuto
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              <strong>Timeout:</strong> Cada requisição tem timeout de 30 segundos
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
