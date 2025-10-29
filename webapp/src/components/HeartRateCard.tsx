'use client'

import React, { useEffect, useRef } from 'react'
import { Activity, MoreHorizontal } from 'lucide-react'

export default function HeartRateCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    // Generate heartbeat waveform
    const generateHeartbeat = () => {
      const points: number[] = []
      const segments = 100

      for (let i = 0; i < segments; i++) {
        const t = (i / segments) * Math.PI * 2

        // Create heartbeat-like pattern
        let y = height / 2

        if (t > 0.5 && t < 1.0) {
          y += Math.sin((t - 0.5) * 12) * 30
        } else if (t > 1.0 && t < 1.5) {
          y += Math.sin((t - 1.0) * 20) * -15
        }

        points.push(y)
      }

      return points
    }

    let offset = 0
    const waveform = generateHeartbeat()

    const draw = () => {
      // Clear
      ctx.clearRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)'
      ctx.lineWidth = 1

      for (let i = 0; i < width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }

      // Draw waveform
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)'
      ctx.lineWidth = 2.5

      const pointsPerPixel = waveform.length / width

      for (let x = 0; x < width; x++) {
        const index = Math.floor((x + offset) * pointsPerPixel) % waveform.length
        const y = waveform[index]

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      // Add glow effect
      ctx.shadowBlur = 10
      ctx.shadowColor = 'rgba(139, 92, 246, 0.5)'
      ctx.stroke()
      ctx.shadowBlur = 0

      offset += 2

      requestAnimationFrame(draw)
    }

    draw()
  }, [])

  return (
    <div className="glass-effect rounded-2xl p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-semibold text-slate-700">Heartrate</h3>
          </div>
          <p className="text-xs text-slate-500">Average rate</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        <div className="text-4xl font-bold text-slate-800">
          92
          <span className="text-lg text-slate-500 ml-2">bpm</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          The cause of heart palpitations is hereditary tachycardia.
        </p>
      </div>

      <div className="relative h-24 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Peak indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-purple-600">Peak</span>
        </div>
      </div>
    </div>
  )
}
