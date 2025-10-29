'use client'

import React from 'react'
import { ExternalLink, FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SwaggerUI() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-8">
        <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
          <FileText className="w-8 h-8" />
          {t.swagger.title}
        </h2>
        <p className="text-slate-600 mb-4">
          {t.swagger.subtitle}
        </p>
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all"
        >
          {t.swagger.openInNewTab}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Embedded Swagger */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{t.swagger.interactive}</h3>
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
          <h4 className="text-lg font-bold text-slate-800 mb-3">{t.swagger.mainEndpoints.title}</h4>
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
          <h4 className="text-lg font-bold text-slate-800 mb-3">{t.swagger.resources.title}</h4>
          <div className="space-y-2">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              • {t.swagger.resources.swaggerUI}
            </a>
            <a
              href="http://localhost:8000/redoc"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              • {t.swagger.resources.redoc}
            </a>
            <a
              href="http://localhost:8000/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              • {t.swagger.resources.openapi}
            </a>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="glass-effect rounded-2xl p-6">
        <h4 className="text-lg font-bold text-slate-800 mb-3">{t.swagger.howToUse.title}</h4>
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            <strong className="text-slate-800">1.</strong> {t.swagger.howToUse.step1}
          </p>
          <p>
            <strong className="text-slate-800">2.</strong> {t.swagger.howToUse.step2}
          </p>
          <p>
            <strong className="text-slate-800">3.</strong> {t.swagger.howToUse.step3}
          </p>
          <p>
            <strong className="text-slate-800">4.</strong> {t.swagger.howToUse.step4}
          </p>
          <p>
            <strong className="text-slate-800">5.</strong> {t.swagger.howToUse.step5}
          </p>
        </div>
      </div>
    </div>
  )
}
