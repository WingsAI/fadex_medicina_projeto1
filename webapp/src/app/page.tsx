'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header, { ViewMode } from '@/components/Header'
import StatsCard from '@/components/StatsCard'
import HeartRateCard from '@/components/HeartRateCard'
import ResearchCard from '@/components/ResearchCard'
import ImageUpload from '@/components/ImageUpload'
import ApiInstructions from '@/components/ApiInstructions'
import SwaggerUI from '@/components/SwaggerUI'
import { TrendingUp, Activity, Users, FileCheck } from 'lucide-react'
import { AnalysisResult } from '@/services/api'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const [latestAnalysis, setLatestAnalysis] = useState<AnalysisResult | null>(null)
  const [activeView, setActiveView] = useState<ViewMode>('dashboard')
  const { t } = useLanguage()

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setLatestAnalysis(result)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-8 flex items-center justify-center">
      <div className="w-full max-w-[1800px] h-[95vh] bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <Header activeView={activeView} onViewChange={setActiveView} />

        {/* Content based on active view */}
        {activeView === 'dashboard' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Image Upload & Analysis - Large */}
            <div className="col-span-7 row-span-2">
              <ImageUpload onAnalysisComplete={handleAnalysisComplete} />
            </div>

            {/* Right Column */}
            <div className="col-span-5 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <StatsCard
                  title={t.dashboard.qualityScore.title}
                  value={latestAnalysis ? latestAnalysis.result.global_score.toFixed(1) : "--"}
                  subtitle={latestAnalysis ? t.dashboard.qualityScore.latestAnalysis : t.dashboard.qualityScore.noAnalysis}
                  icon={TrendingUp}
                  trend={latestAnalysis && latestAnalysis.result.global_score >= 70 ? "up" : undefined}
                  trendValue={latestAnalysis ? `${latestAnalysis.result.confidence.toFixed(0)}% ${t.dashboard.qualityScore.confidence}` : undefined}
                  color="purple"
                />
                <StatsCard
                  title={t.dashboard.mlReadiness.title}
                  value={latestAnalysis ? latestAnalysis.result.ml_readiness : "--"}
                  subtitle={latestAnalysis ? latestAnalysis.result.clinical_adequacy : t.dashboard.mlReadiness.waiting}
                  icon={FileCheck}
                  color="blue"
                />
              </div>

              {/* Heart Rate Card */}
              <HeartRateCard />
            </div>

            {/* Research Card - Full Width Bottom */}
            <div className="col-span-12">
              <ResearchCard />
            </div>

            {/* Additional Stats */}
            <div className="col-span-6">
              <div className="glass-effect rounded-2xl p-6 card-hover">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">{t.dashboard.qualityMetrics.title}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-600 font-medium">{t.dashboard.qualityMetrics.imageQuality}</span>
                      <span className="text-sm font-bold text-purple-600">94%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-600 font-medium">{t.dashboard.qualityMetrics.adequacy}</span>
                      <span className="text-sm font-bold text-blue-600">87%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-600 font-medium">{t.dashboard.qualityMetrics.efficiency}</span>
                      <span className="text-sm font-bold text-green-600">98%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-6">
              <div className="glass-effect rounded-2xl p-6 card-hover">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">{t.dashboard.recentActivity.title}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">{t.dashboard.recentActivity.newAnalysis}</p>
                      <p className="text-xs text-slate-500">{t.dashboard.recentActivity.patientId}: 12847 - Quality Score: 96%</p>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">2m {t.dashboard.recentActivity.ago}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">{t.dashboard.recentActivity.reportGenerated}</p>
                      <p className="text-xs text-slate-500">{t.dashboard.recentActivity.monthlyAssessment}</p>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">15m {t.dashboard.recentActivity.ago}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">{t.dashboard.recentActivity.teamUpdate}</p>
                      <p className="text-xs text-slate-500">3 {t.dashboard.recentActivity.newMembers}</p>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">1h {t.dashboard.recentActivity.ago}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'api' && <ApiInstructions />}

        {activeView === 'swagger' && <SwaggerUI />}

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            {t.footer.text}
          </p>
        </div>
      </main>
      </div>
    </div>
  )
}
