'use client'

import React, { useState } from 'react'
import { X, Zap, Sun, Contrast, Sparkles, Maximize2, Filter, Check } from 'lucide-react'

interface PreProcessingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PreProcessingModal({ isOpen, onClose }: PreProcessingModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['illumination', 'noise'])
  const [processing, setProcessing] = useState(false)

  if (!isOpen) return null

  const techniques = [
    {
      id: 'illumination',
      name: 'Correção de Iluminação',
      description: 'Equaliza a iluminação não uniforme em fundoscopias',
      icon: <Sun className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      improvement: '+18% qualidade',
      demo: { before: 'Sombras irregulares', after: 'Iluminação uniforme' }
    },
    {
      id: 'artifacts',
      name: 'Remoção de Artefatos',
      description: 'Remove reflexos, cílios e bordas de lentes',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      improvement: '+12% clareza',
      demo: { before: 'Reflexos presentes', after: 'Imagem limpa' }
    },
    {
      id: 'histogram',
      name: 'Equalização de Histograma',
      description: 'CLAHE adaptativo para melhor contraste',
      icon: <Contrast className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      improvement: '+22% contraste',
      demo: { before: 'Baixo contraste', after: 'Alto contraste' }
    },
    {
      id: 'noise',
      name: 'Redução de Ruído',
      description: 'Filtro bilateral preservando bordas',
      icon: <Filter className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      improvement: '+15% nitidez',
      demo: { before: 'Ruído visível', after: 'Imagem suave' }
    },
    {
      id: 'super_resolution',
      name: 'Super-resolução',
      description: 'Upscaling com IA para maior definição',
      icon: <Maximize2 className="w-6 h-6" />,
      color: 'from-red-500 to-pink-500',
      improvement: '+35% resolução',
      demo: { before: '512x512', after: '2048x2048' }
    }
  ]

  const toggleOption = (id: string) => {
    setSelectedOptions(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    )
  }

  const handleProcess = () => {
    setProcessing(true)
    // Simulate processing
    setTimeout(() => {
      setProcessing(false)
    }, 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-6xl max-h-[95vh] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Pré-processamento Automático</h2>
                <p className="text-slate-500 text-sm mt-1">Melhoria automática da qualidade de imagens médicas</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-200">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] px-8 py-6">
          {/* Preview Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Visualização Antes/Depois</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Imagem Original
                </div>
                <div className="aspect-square bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 text-white text-center">
                    <div className="text-6xl mb-2">👁️</div>
                    <div className="text-sm opacity-80">Fundoscopia Original</div>
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    Score: 68
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Após Processamento
                </div>
                <div className="aspect-square bg-gradient-to-br from-emerald-300 to-green-400 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-green-200/30"></div>
                  <div className="relative z-10 text-white text-center">
                    <div className="text-6xl mb-2">✨</div>
                    <div className="text-sm opacity-90 font-semibold">Imagem Otimizada</div>
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                    Score: 94
                  </div>
                  {processing && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3"></div>
                        <div className="text-sm font-semibold text-slate-700">Processando...</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedOptions.length > 0 && !processing && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-green-900 mb-1">Melhoria Estimada</div>
                    <div className="text-xs text-green-700">{selectedOptions.length} técnicas selecionadas</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">+26</div>
                    <div className="text-xs text-green-700">pontos de qualidade</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Techniques Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Técnicas Disponíveis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techniques.map((technique) => {
                const isSelected = selectedOptions.includes(technique.id)
                return (
                  <div
                    key={technique.id}
                    onClick={() => toggleOption(technique.id)}
                    className={`group relative cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                      isSelected
                        ? 'border-green-400 bg-green-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${technique.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                        {technique.icon}
                      </div>

                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{technique.name}</h4>
                        <p className="text-sm text-slate-600 mb-3">{technique.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-green-600">{technique.improvement}</div>
                          <div className="text-xs text-slate-500">
                            {technique.demo.before} → {technique.demo.after}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Processing Options */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Configurações de Processamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-sm font-medium text-slate-700 mb-2">Modo</div>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">
                  <option>Automático</option>
                  <option>Conservador</option>
                  <option>Agressivo</option>
                </select>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-sm font-medium text-slate-700 mb-2">Formato de Saída</div>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">
                  <option>JPEG (original)</option>
                  <option>PNG (lossless)</option>
                  <option>TIFF (16-bit)</option>
                </select>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-sm font-medium text-slate-700 mb-2">Resolução</div>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">
                  <option>Manter original</option>
                  <option>2x (Super-res)</option>
                  <option>4x (Super-res)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleProcess}
                disabled={selectedOptions.length === 0 || processing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                {processing ? 'Processando...' : 'Aplicar Processamento'}
              </button>
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                Salvar Preset
              </button>
            </div>
          </div>

          <div className="h-6"></div>
        </div>
      </div>
    </div>
  )
}
