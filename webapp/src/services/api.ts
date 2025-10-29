/**
 * SNPQIM API Service
 * Serviço para comunicação com backend FastAPI
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AnalysisResult {
  success: boolean;
  result: {
    global_score: number;
    confidence: number;
    ml_readiness: string;
    clinical_adequacy: string;
    dimension_scores: {
      sharpness: number;
      exposure: number;
      contrast: number;
      noise_level: number;
      artifacts: number;
      clinical_adequacy: number;
    };
    recommendations: string[];
    metadata: {
      filename: string;
      content_type: string;
      shape: number[];
      exam_type: string;
      analysis_timestamp: string;
      patient_id?: string;
      exam_date?: string;
    };
  };
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  service: string;
}

/**
 * Verifica se a API está online
 */
export async function checkHealth(): Promise<HealthStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('API não está respondendo');
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Erro ao conectar com API: ${error}`);
  }
}

/**
 * Analisa qualidade de uma imagem
 */
export async function analyzeImage(
  file: File,
  options?: {
    examType?: string;
    patientId?: string;
    examDate?: string;
  }
): Promise<AnalysisResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_type', options?.examType || 'fundoscopy');

    if (options?.patientId) {
      formData.append('patient_id', options.patientId);
    }
    if (options?.examDate) {
      formData.append('exam_date', options.examDate);
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao analisar imagem');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao analisar imagem');
  }
}

/**
 * Analisa múltiplas imagens em lote
 */
export async function analyzeBatch(
  files: File[],
  options?: {
    examType?: string;
    patientId?: string;
  }
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];

  for (const file of files) {
    try {
      const result = await analyzeImage(file, options);
      results.push(result);
    } catch (error) {
      console.error(`Erro ao analisar ${file.name}:`, error);
      // Continua com os próximos arquivos mesmo se um falhar
    }
  }

  return results;
}

/**
 * Formata score para exibição
 */
export function formatScore(score: number): string {
  return `${score.toFixed(1)}`;
}

/**
 * Retorna cor baseada no score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Retorna status baseado no ml_readiness
 */
export function getReadinessLabel(readiness: string): string {
  const labels: Record<string, string> = {
    excellent: 'Excelente para ML',
    good: 'Boa para ML',
    fair: 'Aceitável para ML',
    poor: 'Inadequada para ML',
  };
  return labels[readiness] || readiness;
}

/**
 * Retorna status baseado no clinical_adequacy
 */
export function getClinicalLabel(adequacy: string): string {
  const labels: Record<string, string> = {
    diagnostic: 'Diagnóstica',
    screening: 'Triagem',
    inadequate: 'Inadequada',
  };
  return labels[adequacy] || adequacy;
}
