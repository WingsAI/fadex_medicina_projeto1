'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
  trend?: 'up' | 'down'
  trendValue?: string
  color?: 'purple' | 'blue' | 'green' | 'orange'
}

const colorClasses = {
  purple: 'from-purple-500 to-purple-600',
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'purple'
}: StatsCardProps) {
  return (
    <div className="glass-effect rounded-2xl p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {trend === 'up' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              )}
            </svg>
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
        <p className="text-sm text-slate-600 font-medium">{subtitle}</p>
        <p className="text-xs text-slate-400 mt-1">{title}</p>
      </div>
    </div>
  )
}
