'use client'

import React from 'react'
import { Calendar, ChevronDown, ArrowRight } from 'lucide-react'

interface ResearchItemProps {
  title: string
  icon?: string
  onClick?: () => void
}

const ResearchItem = ({ title, icon, onClick }: ResearchItemProps) => (
  <button
    onClick={onClick}
    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl px-4 py-3 text-left transition-all shadow-lg hover:shadow-xl flex items-center gap-3 group"
  >
    {icon && <span className="text-xl">{icon}</span>}
    <span className="text-sm font-medium flex-1">{title}</span>
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </button>
)

export default function ResearchCard() {
  return (
    <div className="glass-effect rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Researches</h3>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>September 11-17, 2023</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium flex items-center gap-1">
            Week
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          {/* Timeline dot */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="pl-6">
            <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              Today
            </div>
          </div>
        </div>

        <ResearchItem
          title="Calculating the risk of diseases"
          icon="🧬"
        />

        <div className="relative pl-6">
          {/* Timeline line */}
          <div className="absolute left-[5px] top-0 bottom-0 w-0.5 bg-slate-200"></div>

          <div className="space-y-3 pt-6">
            <div className="bg-white/60 rounded-xl px-4 py-3 border border-slate-200 flex items-center justify-between group hover:border-purple-300 transition-all cursor-pointer">
              <span className="text-sm text-slate-600 font-medium">Diagnosis of genetic diseases</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="bg-white/60 rounded-xl px-4 py-3 border border-slate-200 flex items-center justify-between group hover:border-purple-300 transition-all cursor-pointer">
              <span className="text-sm text-slate-600 font-medium">Patterns in heredity</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-2">
          View all researches
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
