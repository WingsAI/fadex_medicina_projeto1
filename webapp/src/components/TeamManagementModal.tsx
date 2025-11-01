'use client'

import React, { useState } from 'react'
import { X, Users, TrendingUp, TrendingDown, Award, Clock, Target, BarChart3, UserPlus } from 'lucide-react'

interface TeamManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TeamMember {
  id: string
  name: string
  role: string
  specialty: string
  avatar: string
  stats: {
    totalExams: number
    avgScore: number
    productivity: number
    quality: number
    improvement: number
  }
  performance: {
    week: number[]
    month: number
  }
  assignments: number
  status: 'active' | 'busy' | 'offline'
}

export default function TeamManagementModal({ isOpen, onClose }: TeamManagementModalProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

  if (!isOpen) return null

  const teamMembers: TeamMember[] = [
    {
      id: 'tm-001',
      name: 'Dr. Carlos Silva',
      role: 'Oftalmologista Senior',
      specialty: 'Retina',
      avatar: 'CS',
      stats: {
        totalExams: 234,
        avgScore: 92.1,
        productivity: 95,
        quality: 94,
        improvement: 5.2
      },
      performance: {
        week: [88, 90, 89, 93, 92, 94, 95],
        month: 92.1
      },
      assignments: 12,
      status: 'active'
    },
    {
      id: 'tm-002',
      name: 'Dra. Ana Oliveira',
      role: 'Oftalmologista',
      specialty: 'Glaucoma',
      avatar: 'AO',
      stats: {
        totalExams: 198,
        avgScore: 89.8,
        productivity: 88,
        quality: 91,
        improvement: 3.1
      },
      performance: {
        week: [87, 88, 90, 89, 91, 90, 88],
        month: 89.8
      },
      assignments: 8,
      status: 'busy'
    },
    {
      id: 'tm-003',
      name: 'Dr. Roberto Costa',
      role: 'Oftalmologista',
      specialty: 'Córnea',
      avatar: 'RC',
      stats: {
        totalExams: 176,
        avgScore: 87.4,
        productivity: 82,
        quality: 88,
        improvement: -1.2
      },
      performance: {
        week: [89, 88, 87, 86, 87, 88, 85],
        month: 87.4
      },
      assignments: 6,
      status: 'active'
    },
    {
      id: 'tm-004',
      name: 'Dra. Maria Santos',
      role: 'Oftalmologista Junior',
      specialty: 'Retina',
      avatar: 'MS',
      stats: {
        totalExams: 145,
        avgScore: 91.5,
        productivity: 76,
        quality: 93,
        improvement: 7.8
      },
      performance: {
        week: [85, 88, 90, 91, 92, 93, 91],
        month: 91.5
      },
      assignments: 5,
      status: 'active'
    },
    {
      id: 'tm-005',
      name: 'Dr. Paulo Mendes',
      role: 'Técnico em Imagem',
      specialty: 'Retinografia',
      avatar: 'PM',
      stats: {
        totalExams: 312,
        avgScore: 85.2,
        productivity: 98,
        quality: 86,
        improvement: 2.3
      },
      performance: {
        week: [84, 85, 86, 85, 85, 86, 84],
        month: 85.2
      },
      assignments: 15,
      status: 'offline'
    }
  ]

  const getStatusConfig = (status: string) => {
    const configs = {
      active: { label: 'Disponível', color: 'bg-green-500', textColor: 'text-green-700' },
      busy: { label: 'Ocupado', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
      offline: { label: 'Offline', color: 'bg-slate-400', textColor: 'text-slate-600' }
    }
    return configs[status as keyof typeof configs]
  }

  const topPerformer = teamMembers.reduce((prev, current) =>
    prev.stats.avgScore > current.stats.avgScore ? prev : current
  )

  const totalExams = teamMembers.reduce((sum, member) => sum + member.stats.totalExams, 0)
  const avgTeamScore = teamMembers.reduce((sum, member) => sum + member.stats.avgScore, 0) / teamMembers.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-7xl max-h-[95vh] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Gestão de Equipes</h2>
                <p className="text-slate-500 text-sm mt-1">Performance e produtividade da equipe médica</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all">
                <UserPlus className="w-4 h-4" />
                Adicionar Membro
              </button>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-200">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] px-8 py-6">
          {/* Team Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Membros Ativos</p>
              <p className="text-3xl font-bold text-slate-900">{teamMembers.filter(m => m.status === 'active').length}</p>
              <p className="text-xs text-slate-400 mt-1">de {teamMembers.length} total</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Exames este Mês</p>
              <p className="text-3xl font-bold text-slate-900">{totalExams}</p>
              <p className="text-xs text-slate-400 mt-1">média {Math.round(totalExams / teamMembers.length)} por membro</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Score Médio</p>
              <p className="text-3xl font-bold text-slate-900">{avgTeamScore.toFixed(1)}</p>
              <p className="text-xs text-slate-400 mt-1">qualidade da equipe</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Top Performer</p>
              <p className="text-lg font-bold text-slate-900 truncate">{topPerformer.name.split(' ')[1]}</p>
              <p className="text-xs text-slate-400 mt-1">{topPerformer.stats.avgScore} score</p>
            </div>
          </div>

          {/* Team Members List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Membros da Equipe</h3>
            <div className="space-y-4">
              {teamMembers.map((member, index) => {
                const statusConfig = getStatusConfig(member.status)
                return (
                  <div
                    key={member.id}
                    className="group bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-300 transition-all cursor-pointer"
                    onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar with rank */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                          index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                          'bg-gradient-to-br from-violet-500 to-purple-600'
                        }`}>
                          {member.avatar}
                        </div>
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-slate-400' :
                          index === 2 ? 'bg-orange-500' :
                          'bg-slate-500'
                        }`}>
                          {index + 1}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">{member.name}</h4>
                            <p className="text-sm text-slate-600">{member.role} • {member.specialty}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${statusConfig.color}`}></div>
                            <span className={`text-xs font-medium ${statusConfig.textColor}`}>{statusConfig.label}</span>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-xs font-medium text-slate-500 mb-1">Exames</div>
                            <div className="text-lg font-bold text-slate-900">{member.stats.totalExams}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-slate-500 mb-1">Score Médio</div>
                            <div className="text-lg font-bold text-slate-900">{member.stats.avgScore}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-slate-500 mb-1">Produtividade</div>
                            <div className="flex items-center gap-1">
                              <div className="text-lg font-bold text-slate-900">{member.stats.productivity}%</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-slate-500 mb-1">Melhoria</div>
                            <div className={`flex items-center gap-1 text-lg font-bold ${
                              member.stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {member.stats.improvement >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {Math.abs(member.stats.improvement)}%
                            </div>
                          </div>
                        </div>

                        {/* Performance Bars */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-slate-500">Qualidade</span>
                              <span className="text-xs font-bold text-slate-900">{member.stats.quality}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                                style={{ width: `${member.stats.quality}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-slate-500">Produtividade</span>
                              <span className="text-xs font-bold text-slate-900">{member.stats.productivity}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                                style={{ width: `${member.stats.productivity}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded View */}
                        {selectedMember === member.id && (
                          <div className="mt-4 pt-4 border-t border-slate-200 animate-slideUp">
                            <h5 className="text-sm font-semibold text-slate-700 mb-3">Performance Semanal</h5>
                            <div className="flex items-end gap-2 h-24">
                              {member.performance.week.map((score, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                  <div className="w-full bg-slate-100 rounded-lg overflow-hidden flex-1 flex items-end">
                                    <div
                                      className="w-full bg-gradient-to-t from-violet-500 to-purple-500 rounded-t-lg transition-all duration-1000 flex items-start justify-center pt-1"
                                      style={{ height: `${score}%` }}
                                    >
                                      <span className="text-white text-xs font-bold">{score}</span>
                                    </div>
                                  </div>
                                  <span className="text-xs text-slate-500 font-medium">
                                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][idx]}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 flex gap-2">
                              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">
                                <Target className="w-4 h-4" />
                                Atribuir Casos
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                                <Clock className="w-4 h-4" />
                                Ver Histórico Completo
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
