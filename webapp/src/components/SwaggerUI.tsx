'use client'

import React from 'react'
import { ExternalLink, FileText } from 'lucide-react'

export default function SwaggerUI() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
          <FileText className="w-8 h-8" />
          Documentação Interativa da API
        </h2>
        <p className="text-slate-600 mb-4">
          Explore e teste todos os endpoints da API WingsAI usando a interface Swagger UI.
        </p>
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all"
        >
          Abrir Swagger em Nova Aba
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Embedded Swagger */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Interface Interativa</h3>
        <div className="relative w-full bg-white rounded-lg overflow-hidden shadow-lg" style={{ height: '600px' }}>
          <iframe
            src="http://localhost:8000/docs"
            className="w-full h-full border-0"
            title="Swagger UI"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-effect rounded-2xl p-6">
          <h4 className="text-lg font-bold text-slate-800 mb-3">Endpoints Principais</h4>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="inline-block bg-green-100 text-green-700 font-mono text-xs px-2 py-1 rounded">GET</span>
              <span className="ml-2 text-slate-700 font-mono">/health</span>
            </div>
            <div className="text-sm">
              <span className="inline-block bg-blue-100 text-blue-700 font-mono text-xs px-2 py-1 rounded">POST</span>
              <span className="ml-2 text-slate-700 font-mono">/analyze</span>
            </div>
            <div className="text-sm">
              <span className="inline-block bg-green-100 text-green-700 font-mono text-xs px-2 py-1 rounded">GET</span>
              <span className="ml-2 text-slate-700 font-mono">/docs</span>
            </div>
            <div className="text-sm">
              <span className="inline-block bg-green-100 text-green-700 font-mono text-xs px-2 py-1 rounded">GET</span>
              <span className="ml-2 text-slate-700 font-mono">/redoc</span>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <h4 className="text-lg font-bold text-slate-800 mb-3">Recursos</h4>
          <div className="space-y-2">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              • Swagger UI (Interativo)
            </a>
            <a
              href="http://localhost:8000/redoc"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              • ReDoc (Documentação)
            </a>
            <a
              href="http://localhost:8000/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              • OpenAPI Schema (JSON)
            </a>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="glass-effect rounded-2xl p-6">
        <h4 className="text-lg font-bold text-slate-800 mb-3">Como Usar</h4>
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            <strong className="text-slate-800">1.</strong> Clique em qualquer endpoint para expandir seus detalhes
          </p>
          <p>
            <strong className="text-slate-800">2.</strong> Clique no botão "Try it out" para habilitar o modo de teste
          </p>
          <p>
            <strong className="text-slate-800">3.</strong> Preencha os parâmetros necessários (como upload de arquivo)
          </p>
          <p>
            <strong className="text-slate-800">4.</strong> Clique em "Execute" para fazer a requisição
          </p>
          <p>
            <strong className="text-slate-800">5.</strong> Veja a resposta completa, incluindo código de status, corpo e headers
          </p>
        </div>
      </div>
    </div>
  )
}
