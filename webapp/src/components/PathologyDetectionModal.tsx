'use client'

import React, { useState } from 'react'
import { X, Eye, AlertTriangle, CheckCircle2, AlertCircle, Upload, Scan, Brain } from 'lucide-react'

interface PathologyDetectionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Detection {
  pathology: string
  confidence: number
  severity: 'normal' | 'mild' | 'moderate' | 'severe'
  location: string
  color: string
}

export default function PathologyDetectionModal({ isOpen, onClose }: PathologyDetectionModalProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [hasResults, setHasResults] = useState(true) // Set to true to show demo results

  if (!isOpen) return null

  // Mock detection results
  const detections: Detection[] = [
    {
      pathology: 'Retinopatia Diabética',
      confidence: 94.2,
      severity: 'moderate',
      location: 'Quadrante superior direito',
      color: 'from-orange-500 to-red-500'
    },
    {
      pathology: 'Microaneurismas',
      confidence: 89.7,
      severity: 'mild',
      location: 'Região macular',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      pathology: 'Exsudatos Duros',
      confidence: 87.3,
      severity: 'mild',
      location: 'Periferia temporal',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      pathology: 'Hemorragias Puntiformes',
      confidence: 91.5,
      severity: 'moderate',
      location: 'Múltiplas regiões',
      color: 'from-red-400 to-red-600'
    }
  ]

  const overallRisk = {
    level: 'Moderado',
    score: 68,
    recommendation: 'Acompanhamento oftalmológico em 3 meses. Controle glicêmico rigoroso recomendado.'
  }

  const getSeverityConfig = (severity: string) => {
    const configs = {
      normal: { label: 'Normal', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-4 h-4" /> },
      mild: { label: 'Leve', color: 'bg-yellow-100 text-yellow-700', icon: <AlertCircle className="w-4 h-4" /> },
      moderate: { label: 'Moderado', color: 'bg-orange-100 text-orange-700', icon: <AlertTriangle className="w-4 h-4" /> },
      severe: { label: 'Grave', color: 'bg-red-100 text-red-700', icon: <AlertTriangle className="w-4 h-4" /> }
    }
    return configs[severity as keyof typeof configs]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-6xl max-h-[95vh] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
                <Eye className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Detecção de Patologias</h2>
                <p className="text-slate-500 text-sm mt-1">Análise automática por IA de condições oftalmológicas</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-200">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] px-8 py-6">
          {/* Upload Area */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Imagem Analisada</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all">
                <Upload className="w-4 h-4" />
                Nova Análise
              </button>
            </div>

            {/* Image Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <Eye className="w-24 h-24 text-slate-400" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700">
                  fundus_exam_patient_042.jpg
                </div>
              </div>

              {/* Heatmap */}
              <div className="aspect-square bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <Scan className="w-24 h-24 text-orange-500" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700">
                  Mapa de Atenção IA
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-700 font-medium">Baixo</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-slate-700 font-medium">Médio</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-slate-700 font-medium">Alto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Risk Assessment */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 shadow-lg mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-slate-900">Avaliação de Risco: {overallRisk.level}</h3>
                  <div className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
                    {overallRisk.score}%
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">{overallRisk.recommendation}</p>
                <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-1000"
                    style={{ width: `${overallRisk.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Detections List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Detecções Identificadas ({detections.length})</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                <Brain className="w-4 h-4" />
                Powered by AI
              </div>
            </div>

            <div className="space-y-4">
              {detections.map((detection, index) => {
                const severityConfig = getSeverityConfig(detection.severity)
                return (
                  <div key={index} className="group bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-300 transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${detection.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                        <Eye className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-bold text-slate-900">{detection.pathology}</h4>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${severityConfig.color}`}>
                            {severityConfig.icon}
                            {severityConfig.label}
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-3">
                          <span className="font-medium">Localização:</span> {detection.location}
                        </p>

                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-slate-500">Confiança da IA</span>
                              <span className="text-sm font-bold text-slate-900">{detection.confidence}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${detection.color} rounded-full transition-all duration-1000`}
                                style={{ width: `${detection.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Models Used */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Modelos de IA Utilizados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="text-sm font-semibold text-blue-900 mb-1">RetNet-Vision v2.1</div>
                <div className="text-xs text-blue-700">Detecção de retinopatia diabética</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="text-sm font-semibold text-purple-900 mb-1">VascuNet-Deep v1.8</div>
                <div className="text-xs text-purple-700">Análise vascular e hemorragias</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="text-sm font-semibold text-green-900 mb-1">MaculaNet-Pro v2.0</div>
                <div className="text-xs text-green-700">Detecção de exsudatos e edema</div>
              </div>
            </div>
          </div>

          <div className="h-6"></div>
        </div>
      </div>
    </div>
  )
}
