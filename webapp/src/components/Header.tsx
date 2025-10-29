'use client'

import React from 'react'
import { Bell, Settings, LayoutDashboard, Code, FileText, Globe } from 'lucide-react'
import ApiStatus from './ApiStatus'
import { useLanguage } from '@/contexts/LanguageContext'

export type ViewMode = 'dashboard' | 'api' | 'swagger'

interface HeaderProps {
  activeView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export default function Header({ activeView, onViewChange }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'pt-BR' ? 'en' : 'pt-BR')
  }

  return (
    <header className="flex items-center justify-between mb-8">
      {/* Left Side - API Status */}
      <div className="flex items-center gap-4">
        <ApiStatus />
      </div>

      {/* Center - View Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`px-6 py-2 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${
            activeView === 'dashboard'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
              : 'bg-white/60 text-slate-600 hover:bg-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          {t.header.dashboard}
        </button>
        <button
          onClick={() => onViewChange('api')}
          className={`px-6 py-2 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${
            activeView === 'api'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
              : 'bg-white/60 text-slate-600 hover:bg-white'
          }`}
        >
          <Code className="w-4 h-4" />
          {t.header.api}
        </button>
        <button
          onClick={() => onViewChange('swagger')}
          className={`px-6 py-2 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${
            activeView === 'swagger'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
              : 'bg-white/60 text-slate-600 hover:bg-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          {t.header.swagger}
        </button>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white/60 hover:bg-white rounded-full transition-all flex items-center gap-2 text-sm font-semibold text-slate-700"
          title={language === 'pt-BR' ? 'Switch to English' : 'Mudar para Português'}
        >
          <Globe className="w-4 h-4" />
          {language === 'pt-BR' ? 'PT' : 'EN'}
        </button>

        <button className="relative p-2 hover:bg-white/60 rounded-full transition-all">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <button className="relative p-2 hover:bg-white/60 rounded-full transition-all">
          <Settings className="w-5 h-5 text-slate-600" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <div className="text-sm font-bold text-slate-800">{t.header.profile.name}</div>
            <div className="text-xs text-slate-500">{t.header.profile.department}</div>
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
