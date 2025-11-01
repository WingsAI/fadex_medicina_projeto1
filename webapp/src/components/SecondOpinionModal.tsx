'use client'

import React, { useState } from 'react'
import { X, Users, Send, MessageCircle, CheckCircle2, Clock, AlertCircle, Eye, FileText } from 'lucide-react'

interface SecondOpinionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Consultation {
  id: string
  caseId: string
  patientAge: number
  gender: string
  requestDate: string
  status: 'pending' | 'in_review' | 'completed' | 'urgent'
  requestedBy: string
  assignedTo?: string
  responses: number
  consensus?: string
  urgency: 'low' | 'medium' | 'high'
}

export default function SecondOpinionModal({ isOpen, onClose }: SecondOpinionModalProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending')
  const [showNewCaseForm, setShowNewCaseForm] = useState(false)

  if (!isOpen) return null

  const pendingCases: Consultation[] = [
    {
      id: 'cons-001',
      caseId: 'Caso #2847',
      patientAge: 56,
      gender: 'F',
      requestDate: '2024-11-28 14:30',
      status: 'urgent',
      requestedBy: 'Dr. Carlos Silva',
      assignedTo: 'Dra. Ana Oliveira',
      responses: 1,
      urgency: 'high'
    },
    {
      id: 'cons-002',
      caseId: 'Caso #2845',
      patientAge: 68,
      gender: 'M',
      requestDate: '2024-11-28 10:15',
      status: 'in_review',
      requestedBy: 'Dra. Maria Santos',
      assignedTo: 'Dr. Roberto Costa',
      responses: 2,
      urgency: 'medium'
    },
    {
      id: 'cons-003',
      caseId: 'Caso #2842',
      patientAge: 42,
      gender: 'F',
      requestDate: '2024-11-27 16:45',
      status: 'pending',
      requestedBy: 'Dr. Carlos Silva',
      responses: 0,
      urgency: 'low'
    }
  ]

  const completedCases: Consultation[] = [
    {
      id: 'cons-004',
      caseId: 'Caso #2840',
      patientAge: 71,
      gender: 'M',
      requestDate: '2024-11-26 09:20',
      status: 'completed',
      requestedBy: 'Dra. Ana Oliveira',
      assignedTo: 'Dr. Roberto Costa',
      responses: 3,
      consensus: 'Retinopatia diabética não proliferativa moderada. Recomendado tratamento com anti-VEGF.',
      urgency: 'medium'
    },
    {
      id: 'cons-005',
      caseId: 'Caso #2838',
      patientAge: 59,
      gender: 'F',
      requestDate: '2024-11-25 11:10',
      status: 'completed',
      requestedBy: 'Dr. Carlos Silva',
      assignedTo: 'Dra. Maria Santos',
      responses: 2,
      consensus: 'Glaucoma de ângulo aberto inicial. Indicado monoterapia com análogo de prostaglandina.',
      urgency: 'low'
    }
  ]

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        label: 'Aguardando',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <Clock className="w-4 h-4" />
      },
      in_review: {
        label: 'Em Análise',
        color: 'bg-blue-100 text-blue-700',
        icon: <MessageCircle className="w-4 h-4" />
      },
      completed: {
        label: 'Concluído',
        color: 'bg-green-100 text-green-700',
        icon: <CheckCircle2 className="w-4 h-4" />
      },
      urgent: {
        label: 'Urgente',
        color: 'bg-red-100 text-red-700',
        icon: <AlertCircle className="w-4 h-4" />
      }
    }
    return configs[status as keyof typeof configs]
  }

  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'high') return 'from-red-500 to-red-600'
    if (urgency === 'medium') return 'from-orange-500 to-orange-600'
    return 'from-blue-500 to-blue-600'
  }

  const specialists = [
    { name: 'Dra. Ana Oliveira', specialty: 'Retina', available: true, cases: 3 },
    { name: 'Dr. Roberto Costa', specialty: 'Glaucoma', available: true, cases: 2 },
    { name: 'Dra. Maria Santos', specialty: 'Córnea', available: false, cases: 5 },
    { name: 'Dr. Paulo Mendes', specialty: 'Retina', available: true, cases: 1 }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-7xl max-h-[95vh] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Segunda Opinião</h2>
                <p className="text-slate-500 text-sm mt-1">Sistema colaborativo de consultas entre especialistas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNewCaseForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
                Novo Caso
              </button>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-200">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'pending'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Pendentes ({pendingCases.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'completed'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Concluídos ({completedCases.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-180px)] px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Cases List */}
            <div className="lg:col-span-2 space-y-4">
              {activeTab === 'pending' && pendingCases.map((consultation) => {
                const statusConfig = getStatusConfig(consultation.status)
                return (
                  <div key={consultation.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getUrgencyColor(consultation.urgency)} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                        <Eye className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">{consultation.caseId}</h4>
                            <p className="text-sm text-slate-600">
                              Paciente: {consultation.gender === 'M' ? 'Masculino' : 'Feminino'}, {consultation.patientAge} anos
                            </p>
                          </div>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-xs font-medium text-slate-500 mb-1">Solicitado por</div>
                            <div className="text-sm font-semibold text-slate-900">{consultation.requestedBy}</div>
                          </div>
                          {consultation.assignedTo && (
                            <div>
                              <div className="text-xs font-medium text-slate-500 mb-1">Atribuído a</div>
                              <div className="text-sm font-semibold text-slate-900">{consultation.assignedTo}</div>
                            </div>
                          )}
                          <div>
                            <div className="text-xs font-medium text-slate-500 mb-1">Data/Hora</div>
                            <div className="text-sm font-semibold text-slate-900">{consultation.requestDate}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-slate-500 mb-1">Respostas</div>
                            <div className="text-sm font-semibold text-slate-900">{consultation.responses}</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">
                            <MessageCircle className="w-4 h-4" />
                            Abrir Discussão
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                            <Eye className="w-4 h-4" />
                            Ver Imagens
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {activeTab === 'completed' && completedCases.map((consultation) => {
                const statusConfig = getStatusConfig(consultation.status)
                return (
                  <div key={consultation.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">{consultation.caseId}</h4>
                            <p className="text-sm text-slate-600">
                              Paciente: {consultation.gender === 'M' ? 'Masculino' : 'Feminino'}, {consultation.patientAge} anos
                            </p>
                          </div>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </div>
                        </div>

                        {consultation.consensus && (
                          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <div className="text-xs font-semibold text-green-900 mb-2 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Consenso Alcançado ({consultation.responses} especialistas)
                            </div>
                            <p className="text-sm text-slate-700">{consultation.consensus}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                            <FileText className="w-4 h-4" />
                            Ver Discussão Completa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Sidebar - Specialists */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Especialistas Disponíveis</h3>
                <div className="space-y-3">
                  {specialists.map((specialist, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {specialist.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{specialist.name}</div>
                            <div className="text-xs text-slate-500">{specialist.specialty}</div>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${specialist.available ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      </div>
                      <div className="text-xs text-slate-600">
                        {specialist.cases} casos ativos
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Estatísticas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Taxa de Consenso</span>
                    <span className="text-lg font-bold text-slate-900">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Tempo Médio</span>
                    <span className="text-lg font-bold text-slate-900">4.2h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total este Mês</span>
                    <span className="text-lg font-bold text-slate-900">127</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-6"></div>
        </div>
      </div>
    </div>
  )
}
