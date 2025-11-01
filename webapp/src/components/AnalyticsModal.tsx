'use client'

import React from 'react'
import { X, Image as ImageIcon, CheckCircle2, AlertTriangle, Clock, TrendingUp, Award, Eye, Calendar, Filter } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface AnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AnalysisHistoryItem {
  id: string
  fileName: string
  date: string
  score: number
  mlReadiness: string
  clinicalAdequacy: string
  thumbnail: string
  processingTime: number
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color: string
  trend?: string
}

const StatCard = ({ title, value, subtitle, icon, color, trend }: StatCardProps) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      {trend && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  </div>
)

const HistoryCard = ({ item }: { item: AnalysisHistoryItem }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 70) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle2 className="w-5 h-5 text-green-600" />
    if (score >= 70) return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    return <AlertTriangle className="w-5 h-5 text-red-600" />
  }

  return (
    <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 hover:border-purple-200 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex-shrink-0 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Eye className="w-8 h-8 text-slate-400" />
          </div>
          <div className="absolute top-2 right-2">
            {getScoreIcon(item.score)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 truncate text-sm">{item.fileName}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {item.date}
              </p>
            </div>
            <div className="ml-2 text-right">
              <div className="text-lg font-bold text-slate-900">{item.score}</div>
              <div className="text-xs text-slate-500">score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full bg-gradient-to-r ${getScoreColor(item.score)} transition-all duration-500`}
              style={{ width: `${item.score}%` }}
            ></div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              {item.mlReadiness}
            </span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {item.clinicalAdequacy}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.processingTime}ms
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  const { t } = useLanguage()

  if (!isOpen) return null

  // Mock data - in production, this would come from API/state
  const totalAnalyzed = 247
  const averageScore = 87.3
  const highQuality = 189
  const successRate = 76.5

  const recentAnalyses: AnalysisHistoryItem[] = [
    {
      id: '1',
      fileName: 'fundus_exam_patient_001.jpg',
      date: 'Today at 2:34 PM',
      score: 94,
      mlReadiness: 'Ready',
      clinicalAdequacy: 'Excellent',
      thumbnail: '',
      processingTime: 1234
    },
    {
      id: '2',
      fileName: 'retinal_scan_002.png',
      date: 'Today at 1:15 PM',
      score: 88,
      mlReadiness: 'Ready',
      clinicalAdequacy: 'Good',
      thumbnail: '',
      processingTime: 987
    },
    {
      id: '3',
      fileName: 'optic_nerve_003.jpg',
      date: 'Yesterday at 4:22 PM',
      score: 76,
      mlReadiness: 'Partial',
      clinicalAdequacy: 'Adequate',
      thumbnail: '',
      processingTime: 1456
    },
    {
      id: '4',
      fileName: 'macula_analysis_004.jpg',
      date: 'Yesterday at 11:08 AM',
      score: 91,
      mlReadiness: 'Ready',
      clinicalAdequacy: 'Excellent',
      thumbnail: '',
      processingTime: 1123
    },
    {
      id: '5',
      fileName: 'fundoscopy_patient_005.png',
      date: '2 days ago',
      score: 65,
      mlReadiness: 'Review',
      clinicalAdequacy: 'Poor',
      thumbnail: '',
      processingTime: 1678
    },
    {
      id: '6',
      fileName: 'diabetic_retinopathy_006.jpg',
      date: '3 days ago',
      score: 93,
      mlReadiness: 'Ready',
      clinicalAdequacy: 'Excellent',
      thumbnail: '',
      processingTime: 1034
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-7xl max-h-[95vh] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Header - Apple Style */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Analytics</h2>
              <p className="text-slate-500 text-sm mt-1">Complete analysis history and insights</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-200"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)] px-8 py-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Analyzed"
              value={totalAnalyzed}
              subtitle="All time"
              icon={<ImageIcon className="w-6 h-6" />}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              trend="+12%"
            />
            <StatCard
              title="Average Score"
              value={averageScore}
              subtitle="Quality index"
              icon={<Award className="w-6 h-6" />}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              trend="+5.2%"
            />
            <StatCard
              title="High Quality"
              value={highQuality}
              subtitle={`${successRate}% success rate`}
              icon={<CheckCircle2 className="w-6 h-6" />}
              color="bg-gradient-to-br from-green-500 to-green-600"
              trend="+8%"
            />
            <StatCard
              title="Processing Time"
              value="1.2s"
              subtitle="Average duration"
              icon={<Clock className="w-6 h-6" />}
              color="bg-gradient-to-br from-orange-500 to-orange-600"
            />
          </div>

          {/* Filters - Apple Style */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Recent Analyses</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-200 text-sm font-medium text-slate-700">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {recentAnalyses.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-6 text-center">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105">
              Load More Analyses
            </button>
          </div>

          {/* Bottom Spacing */}
          <div className="h-6"></div>
        </div>
      </div>
    </div>
  )
}
