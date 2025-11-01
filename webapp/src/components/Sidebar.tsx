'use client'

import React, { useState } from 'react'
import { Home, BarChart3, LineChart, Brain, Bell, Search, TrendingUp, Eye, User, Users as UsersIcon, MessageSquare } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import NeuralNetworksModal from './NeuralNetworksModal'
import AnalyticsModal from './AnalyticsModal'
import AlertsModal from './AlertsModal'
import TrendsModal from './TrendsModal'
import PathologyDetectionModal from './PathologyDetectionModal'
import PatientRecordsModal from './PatientRecordsModal'
import SecondOpinionModal from './SecondOpinionModal'
import TeamManagementModal from './TeamManagementModal'

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
  const [isNeuralNetworksModalOpen, setIsNeuralNetworksModalOpen] = useState(false)
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false)
  const [isTrendsModalOpen, setIsTrendsModalOpen] = useState(false)
  const [isPathologyModalOpen, setIsPathologyModalOpen] = useState(false)
  const [isPatientRecordsModalOpen, setIsPatientRecordsModalOpen] = useState(false)
  const [isSecondOpinionModalOpen, setIsSecondOpinionModalOpen] = useState(false)
  const [isTeamManagementModalOpen, setIsTeamManagementModalOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      <NeuralNetworksModal
        isOpen={isNeuralNetworksModalOpen}
        onClose={() => setIsNeuralNetworksModalOpen(false)}
      />
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
      />
      <TrendsModal
        isOpen={isTrendsModalOpen}
        onClose={() => setIsTrendsModalOpen(false)}
      />
      <PathologyDetectionModal
        isOpen={isPathologyModalOpen}
        onClose={() => setIsPathologyModalOpen(false)}
      />
      <PatientRecordsModal
        isOpen={isPatientRecordsModalOpen}
        onClose={() => setIsPatientRecordsModalOpen(false)}
      />
      <SecondOpinionModal
        isOpen={isSecondOpinionModalOpen}
        onClose={() => setIsSecondOpinionModalOpen(false)}
      />
      <TeamManagementModal
        isOpen={isTeamManagementModalOpen}
        onClose={() => setIsTeamManagementModalOpen(false)}
      />
      <aside className="w-64 h-full bg-white/40 backdrop-blur-xl border-r border-white/20 p-6 pb-8 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold gradient-text">{t.sidebar.title}</h1>
        <p className="text-xs text-slate-500 mt-1">{t.sidebar.subtitle}</p>
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
          label={t.sidebar.menu.homepage}
          active={activeItem === 'homepage'}
          onClick={() => setActiveItem('homepage')}
        />
        <NavItem
          icon={<BarChart3 />}
          label={t.sidebar.menu.statistics}
          active={activeItem === 'statistics'}
          onClick={() => setActiveItem('statistics')}
        />
        <NavItem
          icon={<LineChart />}
          label={t.sidebar.menu.analytics}
          active={activeItem === 'analytics'}
          onClick={() => {
            setActiveItem('analytics')
            setIsAnalyticsModalOpen(true)
          }}
        />
        <NavItem
          icon={<Brain />}
          label={t.sidebar.menu.neuralNetworks}
          active={activeItem === 'neural-networks'}
          onClick={() => {
            setActiveItem('neural-networks')
            setIsNeuralNetworksModalOpen(true)
          }}
        />
        <NavItem
          icon={<Bell />}
          label={t.sidebar.menu.alerts}
          badge={3}
          active={activeItem === 'alerts'}
          onClick={() => {
            setActiveItem('alerts')
            setIsAlertsModalOpen(true)
          }}
        />
      </nav>

      {/* Connected Profiles */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{t.sidebar.connectedProfiles}</span>
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
          <span className="text-xs font-semibold uppercase tracking-wide opacity-90">{t.sidebar.aiAnalytics.title}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <h3 className="font-bold mb-3">{t.sidebar.menu.analytics}</h3>
        <div className="space-y-2">
          <button
            onClick={() => setIsTrendsModalOpen(true)}
            className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Tendências
          </button>
          <button
            onClick={() => setIsPathologyModalOpen(true)}
            className="w-full bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Patologias
          </button>
          <button
            onClick={() => setIsPatientRecordsModalOpen(true)}
            className="w-full bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Prontuários
          </button>
          <button
            onClick={() => setIsSecondOpinionModalOpen(true)}
            className="w-full bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            2ª Opinião
          </button>
          <button
            onClick={() => setIsTeamManagementModalOpen(true)}
            className="w-full bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all flex items-center gap-2"
          >
            <UsersIcon className="w-4 h-4" />
            Equipes
          </button>
        </div>
      </div>
    </aside>
    </>
  )
}
