'use client'

import React, { useState } from 'react'
import { X, Layers, Eye, Activity, Target, Circle, GitBranch, Droplet } from 'lucide-react'

interface SegmentationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SegmentationModal({ isOpen, onClose }: SegmentationModalProps) {
  const [selectedStructures, setSelectedStructures] = useState<string[]>(['optic_disc', 'vessels'])
  const [segmenting, setSegmenting] = useState(false)

  if (!isOpen) return null

  const structures = [
    {
      id: 'optic_disc',
      name: 'Disco Óptico',
      description: 'Detecção automática do disco óptico e cálculo da relação C/D',
      icon: <Circle className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      accuracy: 98.2,
      metric: 'IoU: 0.94'
    },
    {
      id: 'vessels',
      name: 'Vasos Sanguíneos',
      description: 'Segmentação da árvore vascular completa',
      icon: <GitBranch className="w-6 h-6" />,
      color: 'from-red-500 to-pink-500',
      accuracy: 96.7,
      metric: 'Dice: 0.92'
    },
    {
      id: 'macula',
      name: 'Mácula',
      description: 'Identificação da região macular e fóvea',
      icon: <Target className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      accuracy: 97.5,
      metric: 'IoU: 0.93'
    },
    {
      id: 'lesions',
      name: 'Lesões',
      description: 'Detecção de exsudatos, hemorragias e microaneurismas',
      icon: <Droplet className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      accuracy: 89.3,
      metric: 'F1: 0.87'
    }
  ]

  const toggleStructure = (id: string) => {
    setSelectedStructures(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleSegment = () => {
    setSegmenting(true)
    setTimeout(() => {
      setSegmenting(false)
    }, 3000)
  }

  const visualizationModes = [
    { id: 'overlay', name: 'Sobreposição', description: 'Máscaras sobre imagem original' },
    { id: 'isolated', name: 'Isolado', description: 'Estruturas segmentadas apenas' },
    { id: 'heatmap', name: 'Mapa de Calor', description: 'Probabilidade de segmentação' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-6xl max-h-[95vh] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Layers className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Segmentação Automática</h2>
                <p className="text-slate-500 text-sm mt-1">Identificação precisa de estruturas anatômicas</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-200">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] px-8 py-6">
          {/* Visualization Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Visualização da Segmentação</h3>

            {/* Image Display */}
            <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl relative overflow-hidden mb-6">
              {/* Mock fundus image representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-96 h-96">
                  {/* Optic Disc */}
                  {selectedStructures.includes('optic_disc') && (
                    <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-24 h-24 rounded-full bg-yellow-500/30 border-4 border-yellow-400 animate-pulse"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-yellow-300">
                        Disco
                      </div>
                    </div>
                  )}

                  {/* Macula */}
                  {selectedStructures.includes('macula') && (
                    <div className="absolute top-1/2 right-1/3 translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 rounded-full bg-blue-500/30 border-4 border-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-blue-300">
                        Mácula
                      </div>
                    </div>
                  )}

                  {/* Vessels */}
                  {selectedStructures.includes('vessels') && (
                    <>
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <path
                          d="M 30 50 Q 40 30, 50 40 T 70 35"
                          stroke="rgba(239, 68, 68, 0.6)"
                          strokeWidth="2"
                          fill="none"
                          className="animate-pulse"
                        />
                        <path
                          d="M 30 50 Q 40 70, 50 60 T 70 65"
                          stroke="rgba(239, 68, 68, 0.6)"
                          strokeWidth="2"
                          fill="none"
                          className="animate-pulse"
                          style={{ animationDelay: '0.3s' }}
                        />
                      </svg>
                    </>
                  )}

                  {/* Lesions */}
                  {selectedStructures.includes('lesions') && (
                    <>
                      <div className="absolute top-1/4 left-1/2 w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                      <div className="absolute top-3/4 left-2/3 w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <div className="absolute top-2/3 left-1/4 w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                    </>
                  )}

                  {/* Central eye indicator */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Eye className="w-16 h-16 text-slate-400" />
                  </div>
                </div>
              </div>

              {segmenting && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white font-semibold mb-2">Segmentando estruturas...</div>
                    <div className="text-cyan-300 text-sm">Aplicando redes neurais profundas</div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-xl p-3 space-y-2">
                {selectedStructures.includes('optic_disc') && (
                  <div className="flex items-center gap-2 text-xs text-white">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span>Disco Óptico</span>
                  </div>
                )}
                {selectedStructures.includes('macula') && (
                  <div className="flex items-center gap-2 text-xs text-white">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span>Mácula</span>
                  </div>
                )}
                {selectedStructures.includes('vessels') && (
                  <div className="flex items-center gap-2 text-xs text-white">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span>Vasos</span>
                  </div>
                )}
                {selectedStructures.includes('lesions') && (
                  <div className="flex items-center gap-2 text-xs text-white">
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    <span>Lesões</span>
                  </div>
                )}
              </div>
            </div>

            {/* Visualization Mode Selector */}
            <div className="grid grid-cols-3 gap-3">
              {visualizationModes.map((mode) => (
                <button
                  key={mode.id}
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all"
                >
                  <div className="text-sm font-semibold text-slate-900 mb-1">{mode.name}</div>
                  <div className="text-xs text-slate-600">{mode.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Structures Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Estruturas para Segmentar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {structures.map((structure) => {
                const isSelected = selectedStructures.includes(structure.id)
                return (
                  <div
                    key={structure.id}
                    onClick={() => toggleStructure(structure.id)}
                    className={`group cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${structure.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                        {structure.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-slate-900">{structure.name}</h4>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-slate-300'
                          }`}>
                            {isSelected && <Activity className="w-3 h-3 text-white" />}
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-3">{structure.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-green-600">
                            {structure.accuracy}% precisão
                          </div>
                          <div className="text-xs text-slate-500">
                            {structure.metric}
                          </div>
                        </div>

                        {/* Accuracy bar */}
                        <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${structure.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${structure.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Results Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Métricas de Segmentação</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">0.94</div>
                <div className="text-xs text-blue-700 font-medium">IoU Médio</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">0.92</div>
                <div className="text-xs text-green-700 font-medium">Dice Score</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-1">97.2%</div>
                <div className="text-xs text-purple-700 font-medium">Precisão</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-1">1.8s</div>
                <div className="text-xs text-orange-700 font-medium">Tempo</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSegment}
              disabled={selectedStructures.length === 0 || segmenting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Layers className="w-5 h-5" />
              {segmenting ? 'Segmentando...' : 'Executar Segmentação'}
            </button>
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
              Exportar Máscaras
            </button>
          </div>

          <div className="h-6"></div>
        </div>
      </div>
    </div>
  )
}
