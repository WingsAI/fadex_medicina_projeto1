'use client'

import React from 'react'
import { X, Brain, Eye, Activity, Zap, CheckCircle2, AlertCircle } from 'lucide-react'

interface NeuralNetworksModalProps {
  isOpen: boolean
  onClose: () => void
}

interface NetworkCardProps {
  name: string
  description: string
  status: 'active' | 'training' | 'maintenance'
  accuracy: number
  specialty: string
  icon: React.ReactNode
  color: string
}

const NetworkCard = ({ name, description, status, accuracy, specialty, icon, color }: NetworkCardProps) => {
  const statusConfig = {
    active: { label: 'Active', icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-500 bg-green-500/10' },
    training: { label: 'Training', icon: <Activity className="w-4 h-4 animate-pulse" />, color: 'text-yellow-500 bg-yellow-500/10' },
    maintenance: { label: 'Maintenance', icon: <AlertCircle className="w-4 h-4" />, color: 'text-orange-500 bg-orange-500/10' }
  }

  return (
    <div className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
            {statusConfig[status].icon}
            {statusConfig[status].label}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 mb-2">{name}</h3>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{description}</p>

        {/* Specialty Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{specialty}</span>
        </div>

        {/* Accuracy Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Accuracy</span>
            <span className="text-slate-800 font-bold">{accuracy}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${accuracy}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NeuralNetworksModal({ isOpen, onClose }: NeuralNetworksModalProps) {
  if (!isOpen) return null

  const networks: NetworkCardProps[] = [
    {
      name: 'RetNet-Vision',
      description: 'Deep convolutional network specialized in retinal fundus image analysis, detecting diabetic retinopathy, macular degeneration, and glaucoma.',
      status: 'active',
      accuracy: 96.5,
      specialty: 'Retinal Analysis',
      icon: <Eye className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'OpticNet-AI',
      description: 'Advanced neural architecture for optic nerve head assessment, identifying papilledema, optic atrophy, and nerve fiber layer defects.',
      status: 'active',
      accuracy: 94.2,
      specialty: 'Optic Nerve',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'VascuNet-Deep',
      description: 'Vascular pattern recognition network for analyzing blood vessel morphology, tortuosity, and perfusion abnormalities.',
      status: 'training',
      accuracy: 91.8,
      specialty: 'Vascular Analysis',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-red-500 to-orange-500'
    },
    {
      name: 'MaculaNet-Pro',
      description: 'Specialized transformer-based model for macular region analysis, detecting AMD, macular holes, and epiretinal membranes.',
      status: 'active',
      accuracy: 95.7,
      specialty: 'Macular Region',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'GlaucomaNet-V2',
      description: 'Multi-task learning network for glaucoma detection using cup-to-disc ratio analysis and RNFL thickness estimation.',
      status: 'active',
      accuracy: 93.4,
      specialty: 'Glaucoma Detection',
      icon: <Eye className="w-6 h-6" />,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      name: 'QualityNet-FADEX',
      description: 'Image quality assessment network that evaluates fundus photographs for adequate illumination, focus, and field coverage.',
      status: 'maintenance',
      accuracy: 97.1,
      specialty: 'Quality Assessment',
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'from-violet-500 to-purple-500'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Neural Networks</h2>
              <p className="text-purple-100 text-sm mt-1">Medical Ophthalmology AI Models</p>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-purple-100">4 Active Networks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
              <span className="text-purple-100">1 Training</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              <span className="text-purple-100">1 Maintenance</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networks.map((network, index) => (
              <NetworkCard key={index} {...network} />
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">WingsAI Medical Vision Platform</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our neural networks are trained on over 500,000 annotated ophthalmological images from diverse populations.
                  All models undergo rigorous validation and meet clinical-grade accuracy standards for diagnostic assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
