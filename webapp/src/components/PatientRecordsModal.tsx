'use client'

import React, { useState } from 'react'
import { X, User, Calendar, Eye, TrendingUp, FileText, Download, AlertCircle, Clock } from 'lucide-react'

interface PatientRecordsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Exam {
  id: string
  date: string
  type: string
  eye: 'OD' | 'OE' | 'OU'
  score: number
  findings: string[]
  operator: string
}

export default function PatientRecordsModal({ isOpen, onClose }: PatientRecordsModalProps) {
  const [selectedPatient, setSelectedPatient] = useState('patient-001')
  const [selectedExam, setSelectedExam] = useState<string | null>(null)

  if (!isOpen) return null

  // Mock patient data
  const patient = {
    id: 'patient-001',
    name: 'Maria da Silva Santos',
    birthDate: '15/03/1968',
    age: 56,
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    diagnosis: 'Diabetes Mellitus tipo 2, Hipertensão Arterial',
    lastVisit: '2024-11-28',
    nextVisit: '2025-02-28'
  }

  const exams: Exam[] = [
    {
      id: 'exam-006',
      date: '2024-11-28',
      type: 'Retinografia',
      eye: 'OU',
      score: 91.5,
      findings: ['Retinopatia diabética não proliferativa leve', 'Microaneurismas em OD'],
      operator: 'Dr. Carlos Silva'
    },
    {
      id: 'exam-005',
      date: '2024-08-15',
      type: 'Retinografia',
      eye: 'OU',
      score: 89.2,
      findings: ['Retinopatia diabética não proliferativa leve', 'Sem edema macular'],
      operator: 'Dra. Ana Oliveira'
    },
    {
      id: 'exam-004',
      date: '2024-05-10',
      type: 'Fundoscopia',
      eye: 'OD',
      score: 87.8,
      findings: ['Microaneurismas discretos', 'Relação C/D: 0.3'],
      operator: 'Dr. Roberto Costa'
    },
    {
      id: 'exam-003',
      date: '2024-02-20',
      type: 'Retinografia',
      eye: 'OU',
      score: 85.3,
      findings: ['Exsudatos duros em região temporal', 'Hemorragias puntiformes'],
      operator: 'Dr. Carlos Silva'
    },
    {
      id: 'exam-002',
      date: '2023-11-05',
      type: 'Fundoscopia',
      eye: 'OU',
      score: 83.1,
      findings: ['Retinopatia diabética inicial', 'Sem sinais de edema'],
      operator: 'Dra. Maria Santos'
    }
  ]

  const scoreHistory = exams.map(e => e.score).reverse()
  const maxScore = Math.max(...scoreHistory)
  const minScore = Math.min(...scoreHistory)
  const avgScore = scoreHistory.reduce((a, b) => a + b, 0) / scoreHistory.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-7xl max-h-[95vh] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Prontuário Digital</h2>
                <p className="text-slate-500 text-sm mt-1">Histórico completo de exames oftalmológicos</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-200">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] px-8 py-6">
          {/* Patient Info Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 shadow-lg mb-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <User className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{patient.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-1">Idade</div>
                    <div className="text-sm font-semibold text-slate-900">{patient.age} anos</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-1">Data Nascimento</div>
                    <div className="text-sm font-semibold text-slate-900">{patient.birthDate}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-1">Última Consulta</div>
                    <div className="text-sm font-semibold text-slate-900">{patient.lastVisit}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-1">Próxima Consulta</div>
                    <div className="text-sm font-semibold text-indigo-700">{patient.nextVisit}</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="text-xs font-medium text-slate-500 mb-1">Diagnósticos</div>
                  <div className="text-sm text-slate-900">{patient.diagnosis}</div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-sm font-medium text-slate-700 transition-all">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total de Exames</p>
              <p className="text-3xl font-bold text-slate-900">{exams.length}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Score Médio</p>
              <p className="text-3xl font-bold text-slate-900">{avgScore.toFixed(1)}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Último Score</p>
              <p className="text-3xl font-bold text-slate-900">{exams[0].score}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Achados Ativos</p>
              <p className="text-3xl font-bold text-slate-900">3</p>
            </div>
          </div>

          {/* Score Trend Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Evolução da Qualidade dos Exames</h3>
            <div className="flex items-end gap-3 h-48">
              {scoreHistory.map((score, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-100 rounded-lg overflow-hidden flex-1 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all duration-1000 flex items-start justify-center pt-2"
                      style={{ height: `${(score / 100) * 100}%` }}
                    >
                      <span className="text-white text-xs font-bold">{score}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {exams[exams.length - 1 - index].date.split('-')[1]}/{exams[exams.length - 1 - index].date.split('-')[0].slice(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exam History Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Histórico de Exames</h3>
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                Ver todos
              </button>
            </div>

            <div className="space-y-4">
              {exams.map((exam, index) => (
                <div
                  key={exam.id}
                  className="group relative bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-300 transition-all cursor-pointer"
                  onClick={() => setSelectedExam(selectedExam === exam.id ? null : exam.id)}
                >
                  {/* Timeline connector */}
                  {index !== exams.length - 1 && (
                    <div className="absolute left-[38px] top-[60px] w-0.5 h-8 bg-slate-200"></div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl ${
                        exam.score >= 90 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                        exam.score >= 80 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                        'bg-gradient-to-br from-yellow-500 to-orange-600'
                      } flex items-center justify-center text-white shadow-md`}>
                        <Eye className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{exam.type}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Calendar className="w-4 h-4" />
                              {exam.date}
                            </div>
                            <div className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                              {exam.eye}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">{exam.score}</div>
                          <div className="text-xs text-slate-500">score</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <Clock className="w-4 h-4" />
                        Operador: {exam.operator}
                      </div>

                      {/* Expandable Findings */}
                      {selectedExam === exam.id && (
                        <div className="mt-4 pt-4 border-t border-slate-200 animate-slideUp">
                          <h5 className="text-sm font-semibold text-slate-700 mb-2">Achados:</h5>
                          <ul className="space-y-1">
                            {exam.findings.map((finding, idx) => (
                              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-4 flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600 transition-all">
                              <Eye className="w-4 h-4" />
                              Ver Imagem
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                              <Download className="w-4 h-4" />
                              Baixar Laudo
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-6"></div>
        </div>
      </div>
    </div>
  )
}
