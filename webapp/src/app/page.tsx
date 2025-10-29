'use client'

import React from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import DNAVisualization from '@/components/DNAVisualization'
import StatsCard from '@/components/StatsCard'
import HeartRateCard from '@/components/HeartRateCard'
import ResearchCard from '@/components/ResearchCard'
import { TrendingUp, Activity, Users, FileCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Header />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* DNA Visualization - Large */}
          <div className="col-span-7 row-span-2">
            <div className="h-full min-h-[600px]">
              <DNAVisualization />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-5 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <StatsCard
                title="Progress"
                value="27"
                subtitle="Analysis in progress"
                icon={TrendingUp}
                trend="up"
                trendValue="+12%"
                color="purple"
              />
              <StatsCard
                title="Completed"
                value="31"
                subtitle="Active treatments"
                icon={FileCheck}
                trend="up"
                trendValue="+8%"
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
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Quality Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-600 font-medium">Image Quality Score</span>
                    <span className="text-sm font-bold text-purple-600">94%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-600 font-medium">Adequacy Rate</span>
                    <span className="text-sm font-bold text-blue-600">87%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-600 font-medium">Processing Efficiency</span>
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
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">New analysis completed</p>
                    <p className="text-xs text-slate-500">Patient ID: 12847 - Quality Score: 96%</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">2m ago</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">Report generated</p>
                    <p className="text-xs text-slate-500">Monthly quality assessment ready</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">15m ago</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">Team update</p>
                    <p className="text-xs text-slate-500">3 new members joined your workspace</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">1h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            SNPQIM Medical Platform - Sistema Nacional de Qualidade de Imagens Médicas
          </p>
        </div>
      </main>
    </div>
  )
}
