'use client'

import React from 'react'
import { X, AlertTriangle, AlertCircle, Info, CheckCircle2, Clock, Bell } from 'lucide-react'

interface AlertsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
}

const AlertCard = ({ alert }: { alert: Alert }) => {
  const typeConfig = {
    critical: {
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      dotColor: 'bg-red-500'
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      dotColor: 'bg-yellow-500'
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      dotColor: 'bg-blue-500'
    },
    success: {
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      dotColor: 'bg-green-500'
    }
  }

  const config = typeConfig[alert.type]

  return (
    <div className={`relative group bg-white/80 backdrop-blur-sm rounded-2xl p-5 border ${alert.read ? 'border-slate-200' : config.borderColor} hover:shadow-lg transition-all duration-300`}>
      {/* Unread indicator */}
      {!alert.read && (
        <div className={`absolute top-5 right-5 w-2.5 h-2.5 rounded-full ${config.dotColor} animate-pulse`}></div>
      )}

      <div className="flex gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 mb-1">{alert.title}</h4>
          <p className="text-sm text-slate-600 mb-3 leading-relaxed">{alert.message}</p>

          {/* Timestamp */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {alert.timestamp}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AlertsModal({ isOpen, onClose }: AlertsModalProps) {
  if (!isOpen) return null

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Low Image Quality Detected',
      message: 'Image fundus_exam_007.jpg has a quality score of 45. This image may not be suitable for ML training or clinical diagnosis.',
      timestamp: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Processing Time Exceeded',
      message: 'The analysis of retinal_scan_008.png took 8.2 seconds, exceeding the recommended threshold of 5 seconds.',
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Batch Analysis Completed',
      message: 'Successfully processed 15 images with an average quality score of 92.3. All images are ready for ML training.',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '4',
      type: 'info',
      title: 'New Model Available',
      message: 'RetNet-Vision v2.1 is now available with improved accuracy for diabetic retinopathy detection (97.2%).',
      timestamp: 'Today at 9:15 AM',
      read: true
    },
    {
      id: '5',
      type: 'warning',
      title: 'API Rate Limit Warning',
      message: 'You have used 85% of your daily API quota (850/1000 requests). Consider upgrading your plan.',
      timestamp: 'Today at 8:30 AM',
      read: true
    },
    {
      id: '6',
      type: 'success',
      title: 'Quality Threshold Met',
      message: 'Patient #2847 fundus images have achieved excellent quality scores (avg 94.5). Ready for clinical review.',
      timestamp: 'Yesterday at 4:22 PM',
      read: true
    },
    {
      id: '7',
      type: 'info',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance on December 15th from 2:00 AM to 4:00 AM. API will be temporarily unavailable.',
      timestamp: 'Yesterday at 2:10 PM',
      read: true
    }
  ]

  const unreadCount = alerts.filter(a => !a.read).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[95vh] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Header - Apple Style */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg">
                <Bell className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Alerts</h2>
                <p className="text-slate-500 text-sm mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
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
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] px-8 py-6">
          {/* Unread Alerts */}
          {unreadCount > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                New Alerts
              </h3>
              <div className="space-y-3">
                {alerts.filter(a => !a.read).map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          )}

          {/* Read Alerts */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Earlier</h3>
            <div className="space-y-3">
              {alerts.filter(a => a.read).map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>

          {/* Empty State (if no alerts) */}
          {alerts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Bell className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No alerts yet</h3>
              <p className="text-sm text-slate-500">You're all caught up! Alerts will appear here when there's something important.</p>
            </div>
          )}

          {/* Bottom Spacing */}
          <div className="h-6"></div>
        </div>
      </div>
    </div>
  )
}
