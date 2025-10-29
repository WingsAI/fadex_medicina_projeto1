'use client'

import React, { useState } from 'react'
import { Home, BarChart3, LineChart, Calendar, MessageSquare, Search, Beaker, Dna, ScanSearch } from 'lucide-react'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: number
  onClick?: () => void
}

const NavItem = ({ icon, label, active, badge, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
      ${active
        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50'
        : 'text-slate-600 hover:bg-white/60 hover:text-purple-600'
      }
    `}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-medium text-sm flex-1 text-left">{label}</span>
    {badge && (
      <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </button>
)

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('analytics')

  return (
    <aside className="w-64 h-full bg-white/40 backdrop-blur-xl border-r border-white/20 p-6 pb-8 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold gradient-text">WingsAI</h1>
        <p className="text-xs text-slate-500 mt-1">SNPQIM Medical Platform</p>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/60 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1 overflow-y-visible">
        <NavItem
          icon={<Home />}
          label="Homepage"
          active={activeItem === 'homepage'}
          onClick={() => setActiveItem('homepage')}
        />
        <NavItem
          icon={<BarChart3 />}
          label="Statistics"
          active={activeItem === 'statistics'}
          onClick={() => setActiveItem('statistics')}
        />
        <NavItem
          icon={<LineChart />}
          label="Analytics"
          active={activeItem === 'analytics'}
          onClick={() => setActiveItem('analytics')}
        />
        <NavItem
          icon={<Calendar />}
          label="Appointments"
          active={activeItem === 'appointments'}
          onClick={() => setActiveItem('appointments')}
        />
        <NavItem
          icon={<MessageSquare />}
          label="Messages"
          badge={2}
          active={activeItem === 'messages'}
          onClick={() => setActiveItem('messages')}
        />
      </nav>

      {/* Connected Profiles */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Connected Profiles</span>
          <button className="bg-black text-white text-xs px-3 py-1 rounded-full hover:bg-slate-800 transition-colors">
            Add another
          </button>
        </div>
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 border-2 border-white"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-white"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white"></div>
        </div>
      </div>

      {/* AI-Powered Analytics */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-4 text-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wide opacity-90">AI-Powered</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <h3 className="font-bold mb-3">Analytics</h3>
        <div className="space-y-2">
          <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all flex items-center gap-2">
            <Beaker className="w-4 h-4" />
            Spectroscope
            <span className="text-xs ml-auto opacity-70">Quality Study</span>
          </button>
          <button className="w-full bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all flex items-center gap-2">
            <Dna className="w-4 h-4" />
            DNA Profile
            <span className="text-xs ml-auto opacity-70">In progress</span>
          </button>
          <button className="w-full bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all flex items-center gap-2">
            <ScanSearch className="w-4 h-4" />
            Genetic Scanner
          </button>
        </div>
      </div>
    </aside>
  )
}
