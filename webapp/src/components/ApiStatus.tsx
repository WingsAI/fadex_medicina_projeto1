'use client'

import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'
import { checkHealth } from '@/services/api'

export default function ApiStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [lastCheck, setLastCheck] = useState<string>('')

  const checkApiStatus = async () => {
    try {
      await checkHealth()
      setStatus('online')
      setLastCheck(new Date().toLocaleTimeString())
    } catch (error) {
      setStatus('offline')
      setLastCheck(new Date().toLocaleTimeString())
    }
  }

  useEffect(() => {
    // Check initial status
    checkApiStatus()

    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
        <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
        <span className="text-xs text-slate-600">Verificando API...</span>
      </div>
    )
  }

  if (status === 'offline') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
        <WifiOff className="w-4 h-4 text-red-600" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-red-800">API Offline</p>
          <p className="text-xs text-red-600">Inicie o backend primeiro</p>
        </div>
        <button
          onClick={checkApiStatus}
          className="text-xs text-red-600 hover:text-red-800 font-medium"
        >
          Retentar
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
      <Wifi className="w-4 h-4 text-green-600" />
      <div className="flex-1">
        <p className="text-xs font-semibold text-green-800">API Online</p>
        <p className="text-xs text-green-600">{lastCheck}</p>
      </div>
    </div>
  )
}
