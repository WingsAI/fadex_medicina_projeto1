'use client'

import React, { useState, useCallback } from 'react'
import { Upload, X, FileImage, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { analyzeImage, AnalysisResult } from '@/services/api'

interface ImageUploadProps {
  onAnalysisComplete?: (result: AnalysisResult) => void
}

export default function ImageUpload({ onAnalysisComplete }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    // Valida tipo de arquivo
    if (!selectedFile.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida (PNG, JPG, etc.)')
      return
    }

    // Valida tamanho (máx 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo 10MB.')
      return
    }

    setFile(selectedFile)
    setError(null)
    setResult(null)

    // Gera preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleAnalyze = async () => {
    if (!file) return

    setAnalyzing(true)
    setError(null)

    try {
      const analysisResult = await analyzeImage(file, {
        examType: 'fundoscopy',
      })

      setResult(analysisResult)
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar imagem')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="glass-effect rounded-2xl p-6 card-hover">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Análise de Qualidade</h3>

      {/* Upload Area */}
      {!preview && (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? 'border-purple-500 bg-purple-50'
              : 'border-slate-300 hover:border-purple-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileInput}
          />

          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-700 font-medium mb-2">
              Arraste uma imagem ou clique para selecionar
            </p>
            <p className="text-sm text-slate-500">PNG, JPG - Máximo 10MB</p>
          </label>
        </div>
      )}

      {/* Preview e Resultados */}
      {preview && (
        <div>
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Info do Arquivo */}
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
            <FileImage className="w-4 h-4" />
            <span>{file?.name}</span>
            <span className="text-slate-400">•</span>
            <span>{(file!.size / 1024).toFixed(0)} KB</span>
          </div>

          {/* Botão Analisar */}
          {!result && !analyzing && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
            >
              Analisar Qualidade
            </button>
          )}

          {/* Loading */}
          {analyzing && (
            <div className="flex items-center justify-center gap-3 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              <span className="text-slate-600 font-medium">Analisando imagem...</span>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Erro na análise</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Resultados */}
          {result && (
            <div className="space-y-4">
              {/* Score Global */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-semibold text-slate-600">SCORE GLOBAL</span>
                </div>
                <div className={`text-5xl font-bold ${getScoreColor(result.result.global_score)}`}>
                  {result.result.global_score.toFixed(1)}
                  <span className="text-2xl text-slate-400 ml-2">/100</span>
                </div>
                <div className="mt-3 flex gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Confiança: </span>
                    <span className="font-semibold text-slate-700">
                      {(result.result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">ML: </span>
                    <span className="font-semibold text-slate-700">
                      {result.result.ml_readiness}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dimensões */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-700">Análise por Dimensão</h4>
                {Object.entries(result.result.dimension_scores).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-12 text-right">
                        {value.toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recomendações */}
              {result.result.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Recomendações</h4>
                  <ul className="space-y-1">
                    {result.result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nova Análise */}
              <button
                onClick={handleClear}
                className="w-full bg-white border-2 border-slate-300 text-slate-700 py-2 rounded-xl font-semibold hover:bg-slate-50 transition-all"
              >
                Analisar Outra Imagem
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
