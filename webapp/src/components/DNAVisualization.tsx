'use client'

import React, { useEffect, useRef } from 'react'
import { Code, RotateCcw, Info, Maximize2 } from 'lucide-react'

export default function DNAVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    let animationFrame: number
    let time = 0

    // DNA Strand properties
    const strands = 150
    const helixRadius = 80
    const helixHeight = height * 0.8

    const drawDNA = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(0, 0, width, height)

      time += 0.01

      // Draw DNA strands
      for (let i = 0; i < strands; i++) {
        const t = (i / strands) * Math.PI * 4 - time

        // First strand (purple)
        const x1 = width / 2 + Math.cos(t) * helixRadius
        const y1 = (i / strands) * helixHeight + (height - helixHeight) / 2

        // Second strand (blue)
        const x2 = width / 2 + Math.cos(t + Math.PI) * helixRadius
        const y2 = y1

        // Gradient for depth effect
        const opacity = Math.abs(Math.sin(t)) * 0.6 + 0.4

        // Draw connections
        if (Math.abs(Math.sin(t)) < 0.3) {
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.3})`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Draw first strand
        ctx.beginPath()
        ctx.arc(x1, y1, 4, 0, Math.PI * 2)
        const gradient1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, 4)
        gradient1.addColorStop(0, `rgba(139, 92, 246, ${opacity})`)
        gradient1.addColorStop(1, `rgba(109, 40, 217, ${opacity * 0.5})`)
        ctx.fillStyle = gradient1
        ctx.fill()

        // Draw second strand
        ctx.beginPath()
        ctx.arc(x2, y2, 4, 0, Math.PI * 2)
        const gradient2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, 4)
        gradient2.addColorStop(0, `rgba(59, 130, 246, ${opacity})`)
        gradient2.addColorStop(1, `rgba(37, 99, 235, ${opacity * 0.5})`)
        ctx.fillStyle = gradient2
        ctx.fill()

        // Add glow particles
        if (i % 10 === 0) {
          const glowSize = Math.sin(time * 2 + i) * 2 + 3
          ctx.beginPath()
          ctx.arc(x1, y1, glowSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`
          ctx.fill()
        }
      }

      animationFrame = requestAnimationFrame(drawDNA)
    }

    drawDNA()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />

      {/* Overlay Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-lg flex items-center justify-center">
          <Code className="w-5 h-5 text-slate-700" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-lg flex items-center justify-center">
          <RotateCcw className="w-5 h-5 text-slate-700" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-lg flex items-center justify-center">
          <Info className="w-5 h-5 text-slate-700" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-lg flex items-center justify-center">
          <Maximize2 className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      {/* Status Badge */}
      <div className="absolute top-6 left-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Learn more
        </div>
      </div>

      {/* Title Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <div className="text-xs text-slate-500 font-medium mb-1">DNA Overview</div>
      </div>

      {/* Interaction Label */}
      <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 shadow-lg">
        <span className="text-purple-600 font-bold">Good interaction</span>
        <br />
        <span className="text-xs text-slate-500">with other molecules</span>
      </div>
    </div>
  )
}
