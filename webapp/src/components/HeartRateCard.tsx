'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Activity, Zap, Layers } from 'lucide-react'
import PreProcessingModal from './PreProcessingModal'
import SegmentationModal from './SegmentationModal'

export default function HeartRateCard() {
  const [isPreProcessingOpen, setIsPreProcessingOpen] = useState(false)
  const [isSegmentationOpen, setIsSegmentationOpen] = useState(false)
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
    <>
      <PreProcessingModal
        isOpen={isPreProcessingOpen}
        onClose={() => setIsPreProcessingOpen(false)}
      />
      <SegmentationModal
        isOpen={isSegmentationOpen}
        onClose={() => setIsSegmentationOpen(false)}
      />

      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-semibold text-slate-700">Ferramentas IA</h3>
            </div>
            <p className="text-xs text-slate-500">Processamento avançado</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <button
            onClick={() => setIsPreProcessingOpen(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl px-4 py-3 text-left transition-all shadow-lg hover:shadow-xl flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Pré-processamento</div>
              <div className="text-xs opacity-80">Otimização automática</div>
            </div>
          </button>

          <button
            onClick={() => setIsSegmentationOpen(true)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl px-4 py-3 text-left transition-all shadow-lg hover:shadow-xl flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Segmentação</div>
              <div className="text-xs opacity-80">Detecção de estruturas</div>
            </div>
          </button>
        </div>

        <div className="relative h-24 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full" />

          {/* Peak indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-purple-600">IA Ativa</span>
          </div>
        </div>
      </div>
    </>
  )
}
