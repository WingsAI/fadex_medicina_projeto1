'use client'

import React from 'react'
import { Bell, Settings } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-8">
      {/* Time Period Selector */}
      <div className="flex items-center gap-2">
        <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all">
          Day
        </button>
        <button className="px-6 py-2 rounded-full bg-white/60 text-slate-600 font-semibold text-sm hover:bg-white transition-all">
          Week
        </button>
        <button className="px-6 py-2 rounded-full bg-white/60 text-slate-600 font-semibold text-sm hover:bg-white transition-all">
          Month
        </button>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-white/60 rounded-full transition-all">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <button className="relative p-2 hover:bg-white/60 rounded-full transition-all">
          <Settings className="w-5 h-5 text-slate-600" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <div className="text-sm font-bold text-slate-800">Beatrice Howard</div>
            <div className="text-xs text-slate-500">Oncology</div>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-white shadow-lg"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>
    </header>
  )
}
