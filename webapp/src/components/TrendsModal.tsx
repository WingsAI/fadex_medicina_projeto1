'use client'

import React, { useState } from 'react'
import { X, TrendingUp, TrendingDown, Calendar, Filter, Download, BarChart3, PieChart, Activity } from 'lucide-react'

interface TrendsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TrendsModal({ isOpen, onClose }: TrendsModalProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  if (!isOpen) return null

  // Mock data - would come from API
  const qualityTrend = {
    current: 87.3,
    previous: 82.1,
    change: 6.3
  }

  const volumeData = [
    { month: 'Jul', count: 145, avgScore: 85.2 },
    { month: 'Ago', count: 178, avgScore: 86.1 },
    { month: 'Set', count: 203, avgScore: 87.8 },
    { month: 'Out', count: 247, avgScore: 88.5 },
    { month: 'Nov', count: 289, avgScore: 89.2 },
    { month: 'Dez', count: 312, avgScore: 90.1 }
  ]

  const examTypes = [
    { type: 'Fundoscopia', count: 542, avgScore: 91.2, color: 'from-blue-500 to-cyan-500' },
    { type: 'Retinografia', count: 387, avgScore: 88.7, color: 'from-purple-500 to-pink-500' },
    { type: 'OCT', count: 234, avgScore: 93.4, color: 'from-green-500 to-emerald-500' },
    { type: 'Angiografia', count: 156, avgScore: 86.9, color: 'from-orange-500 to-red-500' }
  ]

  const operators = [
    { name: 'Dr. Carlos Silva', exams: 234, avgScore: 92.1, improvement: 5.2 },
    { name: 'Dra. Ana Oliveira', exams: 198, avgScore: 89.8, improvement: 3.1 },
    { name: 'Dr. Roberto Costa', exams: 176, avgScore: 87.4, improvement: -1.2 },
    { name: 'Dra. Maria Santos', exams: 145, avgScore: 91.5, improvement: 7.8 }
  ]

  const maxVolume = Math.max(...volumeData.map(d => d.count))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-7xl max-h-[95vh] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Dashboard de Tendências</h2>
                <p className="text-slate-500 text-sm mt-1">Análise de evolução e performance ao longo do tempo</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-200">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-3 mt-6">
            {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {range === 'week' ? 'Semana' : range === 'month' ? 'Mês' : range === 'quarter' ? 'Trimestre' : 'Ano'}
              </button>
            ))}
            <div className="flex-1"></div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 hover:border-slate-300 text-sm font-medium text-slate-700 transition-all">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-180px)] px-8 py-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${qualityTrend.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {qualityTrend.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(qualityTrend.change)}%
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Score Médio de Qualidade</p>
              <p className="text-3xl font-bold text-slate-900">{qualityTrend.current}</p>
              <p className="text-xs text-slate-400 mt-1">vs {qualityTrend.previous} período anterior</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  <TrendingUp className="w-3 h-3" />
                  23%
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Volume de Exames</p>
              <p className="text-3xl font-bold text-slate-900">1,319</p>
              <p className="text-xs text-slate-400 mt-1">+302 vs período anterior</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-md">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  <TrendingUp className="w-3 h-3" />
                  12%
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Taxa de Aprovação</p>
              <p className="text-3xl font-bold text-slate-900">94.2%</p>
              <p className="text-xs text-slate-400 mt-1">1,243 de 1,319 aprovadas</p>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Volume e Qualidade por Mês</h3>
            <div className="space-y-4">
              {volumeData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-slate-600">{item.month}</div>
                  <div className="flex-1 relative">
                    <div className="w-full h-10 bg-slate-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-end pr-3 transition-all duration-1000"
                        style={{ width: `${(item.count / maxVolume) * 100}%` }}
                      >
                        <span className="text-white text-sm font-semibold">{item.count}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <div className="text-sm font-bold text-slate-900">{item.avgScore}</div>
                    <div className="text-xs text-slate-500">score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exam Types */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Performance por Tipo de Exame</h3>
              <div className="space-y-4">
                {examTypes.map((exam, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{exam.type}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{exam.count} exames</span>
                        <span className="text-sm font-bold text-slate-900">{exam.avgScore}</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${exam.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${exam.avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operators Performance */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Ranking de Operadores</h3>
              <div className="space-y-3">
                {operators.map((op, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gradient-to-br from-slate-400 to-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 text-sm">{op.name}</div>
                      <div className="text-xs text-slate-500">{op.exams} exames realizados</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{op.avgScore}</div>
                      <div className={`text-xs font-semibold ${op.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {op.improvement >= 0 ? '+' : ''}{op.improvement}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-6"></div>
        </div>
      </div>
    </div>
  )
}
