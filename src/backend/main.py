"""
FADEX - Backend API Principal
FastAPI REST API para análise de qualidade de imagens médicas
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List
import uvicorn
import numpy as np
import cv2
from datetime import datetime
import sys
import os
import traceback
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Adiciona src ao path - corrigido para funcionar de qualquer lugar
current_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.dirname(current_dir)  # Sobe de backend/ para src/
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)
    logger.info(f"Adicionado ao path: {src_dir}")

try:
    from ml.scoring.fadex_core import analyze_image_quality
    logger.info("✅ Módulo fadex_core importado com sucesso")
except Exception as e:
    logger.error(f"❌ Erro ao importar fadex_core: {e}")
    logger.error(f"   sys.path: {sys.path}")
    raise

# Inicializa FastAPI
app = FastAPI(
    title="FADEX API",
    description="Sistema Nacional de Qualidade de Imagens Médicas - API REST",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - permite acesso de qualquer origem (para desenvolvimento)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Endpoint raiz - informações da API"""
    return {
        "name": "FADEX API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "endpoints": {
            "health": "/health",
            "analyze": "/api/v1/analyze",
            "batch_analyze": "/api/v1/analyze/batch"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "FADEX Quality Analysis"
    }


@app.post("/api/v1/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    exam_type: str = Form("fundoscopy"),
    patient_id: Optional[str] = Form(None),
    exam_date: Optional[str] = Form(None)
):
    """
    Analisa qualidade de uma única imagem médica

    Args:
        file: Arquivo de imagem (PNG, JPG, DICOM)
        exam_type: Tipo de exame (fundoscopy, oct, angiography)
        patient_id: ID do paciente (opcional)
        exam_date: Data do exame (opcional)

    Returns:
        JSON com score de qualidade e recomendações
    """

    try:
        logger.info(f"📥 Recebido arquivo: {file.filename}, tipo: {file.content_type}")

        # Valida tipo de arquivo
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail=f"Tipo de arquivo inválido: {file.content_type}. Use PNG, JPG ou DICOM."
            )

        # Lê arquivo
        logger.info("📖 Lendo arquivo...")
        contents = await file.read()
        logger.info(f"✓ Arquivo lido: {len(contents)} bytes")

        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(
                status_code=400,
                detail="Não foi possível decodificar a imagem. Verifique o formato."
            )

        logger.info(f"✓ Imagem decodificada: {image.shape}")

        # Converte BGR para RGB
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Metadata
        metadata = {
            "filename": file.filename,
            "content_type": file.content_type,
            "shape": image.shape,
            "exam_type": exam_type,
            "analysis_timestamp": datetime.now().isoformat()
        }

        if patient_id:
            metadata["patient_id"] = patient_id
        if exam_date:
            metadata["exam_date"] = exam_date

        # Executa análise FADEX
        logger.info("🔬 Iniciando análise FADEX...")
        score = analyze_image_quality(image, exam_type=exam_type, metadata=metadata)
        logger.info(f"✅ Análise concluída! Score: {score.global_score:.1f}/100")

        # Retorna resultado
        return {
            "success": True,
            "result": {
                "global_score": round(score.global_score, 2),
                "confidence": round(score.confidence, 2),
                "ml_readiness": score.ml_readiness,
                "clinical_adequacy": score.clinical_adequacy,
                "dimension_scores": {
                    k: round(v, 2) for k, v in score.dimension_scores.items()
                },
                "recommendations": score.recommendations,
                "metadata": metadata
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        # Captura erro completo para debugging
        error_detail = {
            "error": str(e),
            "type": type(e).__name__,
            "traceback": traceback.format_exc()
        }
        logger.error(f"❌ Erro ao processar imagem: {error_detail}")

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar imagem: {str(e)}. Tipo: {type(e).__name__}"
        )


@app.post("/api/v1/analyze/batch")
async def analyze_batch(
    files: List[UploadFile] = File(...),
    exam_type: str = Form("fundoscopy")
):
    """
    Analisa múltiplas imagens em batch

    Args:
        files: Lista de arquivos de imagem
        exam_type: Tipo de exame

    Returns:
        JSON com resultados de todas as imagens
    """

    if len(files) > 100:
        raise HTTPException(
            status_code=400,
            detail="Máximo de 100 imagens por batch"
        )

    results = []
    errors = []

    for idx, file in enumerate(files):
        try:
            # Processa cada imagem
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if image is None:
                errors.append({
                    "filename": file.filename,
                    "error": "Não foi possível decodificar a imagem"
                })
                continue

            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            metadata = {
                "filename": file.filename,
                "batch_index": idx,
                "exam_type": exam_type
            }

            # Análise
            score = analyze_image_quality(image, exam_type=exam_type, metadata=metadata)

            results.append({
                "filename": file.filename,
                "global_score": round(score.global_score, 2),
                "ml_readiness": score.ml_readiness,
                "clinical_adequacy": score.clinical_adequacy,
                "confidence": round(score.confidence, 2)
            })

        except Exception as e:
            errors.append({
                "filename": file.filename,
                "error": str(e)
            })

    # Estatísticas do batch
    if results:
        scores = [r["global_score"] for r in results]
        statistics = {
            "total_images": len(files),
            "successful": len(results),
            "failed": len(errors),
            "mean_score": round(np.mean(scores), 2),
            "std_score": round(np.std(scores), 2),
            "min_score": round(min(scores), 2),
            "max_score": round(max(scores), 2)
        }
    else:
        statistics = {
            "total_images": len(files),
            "successful": 0,
            "failed": len(errors)
        }

    return {
        "success": True,
        "statistics": statistics,
        "results": results,
        "errors": errors if errors else None
    }


@app.get("/api/v1/info")
async def api_info():
    """Informações sobre a API e algoritmo"""
    return {
        "api_version": "1.0.0",
        "algorithm": "FADEX Quality Scoring",
        "supported_formats": ["PNG", "JPG", "JPEG"],
        "supported_exam_types": ["fundoscopy", "oct", "angiography"],
        "score_range": "0-100",
        "dimensions": [
            "sharpness",
            "exposure",
            "contrast",
            "noise_level",
            "artifacts",
            "clinical_adequacy"
        ],
        "ml_readiness_levels": ["excellent", "good", "fair", "poor"],
        "clinical_adequacy_levels": ["diagnostic", "screening", "inadequate"]
    }


if __name__ == "__main__":
    print("="*60)
    print("🏥 FADEX API - Sistema de Análise de Qualidade")
    print("="*60)
    print("\n📊 Servidor iniciando...")
    print("📍 URL: http://localhost:8000")
    print("📚 Documentação: http://localhost:8000/docs")
    print("🔍 ReDoc: http://localhost:8000/redoc")
    print("\n⌨️  Pressione CTRL+C para parar")
    print("="*60 + "\n")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
