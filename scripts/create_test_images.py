#!/usr/bin/env python3
"""
FADEX - Gerador de Imagens de Teste Sintéticas
Cria imagens simuladas para testar o sistema de scoring
"""

import numpy as np
import cv2
from pathlib import Path
from typing import Tuple


class TestImageGenerator:
    """Gera imagens médicas sintéticas para testes"""

    def __init__(self, output_dir: str = "examples"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

    def create_fundus_image(
        self,
        size: Tuple[int, int] = (512, 512),
        quality: str = "high"
    ) -> np.ndarray:
        """
        Cria imagem sintética de fundoscopia

        Args:
            size: Dimensões da imagem
            quality: 'high', 'medium', 'low'
        """
        h, w = size
        image = np.ones((h, w, 3), dtype=np.float32) * 0.3

        # Background com gradiente radial (simula iluminação)
        y, x = np.ogrid[:h, :w]
        center = (h//2, w//2)
        dist_from_center = np.sqrt((x - center[1])**2 + (y - center[0])**2)
        max_dist = np.sqrt(center[0]**2 + center[1]**2)
        vignette = 1 - (dist_from_center / max_dist) * 0.5

        for c in range(3):
            image[:, :, c] *= vignette

        # Disco óptico (região circular brilhante)
        disc_center = (center[0] - 50, center[1] + 80)
        disc_mask = (x - disc_center[1])**2 + (y - disc_center[0])**2 <= 40**2
        image[disc_mask] = [0.85, 0.75, 0.65]

        # Vasos sanguíneos (linhas ramificadas)
        self._add_blood_vessels(image, disc_center)

        # Mácula (região mais escura)
        macula_center = (center[0], center[1] - 100)
        macula_mask = (x - macula_center[1])**2 + (y - macula_center[0])**2 <= 25**2
        image[macula_mask] *= 0.6

        # Ajusta qualidade
        if quality == "low":
            # Adiciona blur e ruído
            image = cv2.GaussianBlur(image, (7, 7), 2.0)
            noise = np.random.normal(0, 0.08, image.shape)
            image = np.clip(image + noise, 0, 1)
            # Reduz contraste
            image = image * 0.5 + 0.25
        elif quality == "medium":
            # Ruído moderado
            noise = np.random.normal(0, 0.03, image.shape)
            image = np.clip(image + noise, 0, 1)
        else:  # high quality
            # Ruído mínimo
            noise = np.random.normal(0, 0.01, image.shape)
            image = np.clip(image + noise, 0, 1)

        return image

    def _add_blood_vessels(self, image: np.ndarray, start_point: Tuple[int, int]):
        """Adiciona vasos sanguíneos simulados"""
        h, w, _ = image.shape

        # Vasos principais
        vessels = [
            # (start, end, thickness)
            (start_point, (start_point[0] - 100, start_point[1] - 150), 3),
            (start_point, (start_point[0] + 120, start_point[1] - 80), 3),
            (start_point, (start_point[0] + 80, start_point[1] + 120), 2),
            (start_point, (start_point[0] - 90, start_point[1] + 100), 2),
        ]

        for start, end, thickness in vessels:
            # Valida coordenadas
            if (0 <= start[0] < h and 0 <= start[1] < w and
                0 <= end[0] < h and 0 <= end[1] < w):
                cv2.line(image, (start[1], start[0]), (end[1], end[0]),
                        (0.15, 0.1, 0.08), thickness, lineType=cv2.LINE_AA)

                # Ramificações
                mid = ((start[0] + end[0])//2, (start[1] + end[1])//2)
                branch_end = (mid[0] + np.random.randint(-40, 40),
                            mid[1] + np.random.randint(-40, 40))

                if 0 <= branch_end[0] < h and 0 <= branch_end[1] < w:
                    cv2.line(image, (mid[1], mid[0]), (branch_end[1], branch_end[0]),
                            (0.15, 0.1, 0.08), max(1, thickness-1), lineType=cv2.LINE_AA)

    def create_oct_image(
        self,
        size: Tuple[int, int] = (512, 256),
        quality: str = "high"
    ) -> np.ndarray:
        """Cria imagem sintética de OCT"""
        h, w = size
        image = np.ones((h, w, 3), dtype=np.float32) * 0.1

        # Camadas retinianas (faixas horizontais)
        layer_positions = [50, 80, 120, 160, 200]
        layer_thicknesses = [8, 15, 25, 20, 10]

        for pos, thickness in zip(layer_positions, layer_thicknesses):
            # Adiciona variação ondulada
            wave = (np.sin(np.linspace(0, 4*np.pi, w)) * 5).astype(int)

            for i, offset in enumerate(wave):
                if 0 <= pos + offset < h:
                    start = max(0, pos + offset - thickness//2)
                    end = min(h, pos + offset + thickness//2)
                    # Intensidade varia por camada
                    intensity = 0.3 + (pos / 250) * 0.5
                    image[start:end, i] = intensity

        # Ajusta qualidade
        if quality == "low":
            image = cv2.GaussianBlur(image, (5, 5), 1.5)
            noise = np.random.normal(0, 0.1, image.shape)
            image = np.clip(image + noise, 0, 1)
        elif quality == "medium":
            noise = np.random.normal(0, 0.04, image.shape)
            image = np.clip(image + noise, 0, 1)
        else:
            noise = np.random.normal(0, 0.02, image.shape)
            image = np.clip(image + noise, 0, 1)

        return image

    def create_test_suite(self):
        """Cria suite completa de imagens de teste"""

        print("🖼️  Gerando imagens de teste FADEX...\n")

        test_images = [
            # Fundoscopia - diferentes qualidades
            ("fundus_high_quality.png", "fundoscopy", (512, 512), "high"),
            ("fundus_medium_quality.png", "fundoscopy", (512, 512), "medium"),
            ("fundus_low_quality.png", "fundoscopy", (512, 512), "low"),

            # Diferentes resoluções
            ("fundus_high_res.png", "fundoscopy", (1024, 1024), "high"),
            ("fundus_low_res.png", "fundoscopy", (256, 256), "medium"),

            # OCT
            ("oct_high_quality.png", "oct", (512, 256), "high"),
            ("oct_medium_quality.png", "oct", (512, 256), "medium"),
            ("oct_low_quality.png", "oct", (512, 256), "low"),
        ]

        for filename, exam_type, size, quality in test_images:
            print(f"  Gerando: {filename} ({quality} quality, {size})...")

            if exam_type == "fundoscopy":
                image = self.create_fundus_image(size, quality)
            elif exam_type == "oct":
                image = self.create_oct_image(size, quality)
            else:
                continue

            # Converte para uint8 e BGR para salvar
            image_uint8 = (image * 255).astype(np.uint8)
            image_bgr = cv2.cvtColor(image_uint8, cv2.COLOR_RGB2BGR)

            # Salva
            output_path = self.output_dir / filename
            cv2.imwrite(str(output_path), image_bgr)
            print(f"    ✓ Salvo em: {output_path}")

        print(f"\n✅ {len(test_images)} imagens criadas em {self.output_dir}/")
        print(f"\n💡 Execute agora: python scripts/test_fadex.py examples/ --batch")

    def create_artifact_examples(self):
        """Cria imagens com artifacts específicos para teste"""

        print("\n🔬 Gerando imagens com artifacts específicos...\n")

        # Base image de boa qualidade
        base_image = self.create_fundus_image((512, 512), "high")

        # Artifact 1: Motion blur
        print("  Gerando: artifact_motion_blur.png...")
        kernel_size = 15
        kernel = np.zeros((kernel_size, kernel_size))
        kernel[kernel_size//2, :] = 1.0
        kernel = kernel / kernel_size
        blurred = cv2.filter2D(base_image, -1, kernel)
        self._save_image(blurred, "artifact_motion_blur.png")

        # Artifact 2: Overexposure
        print("  Gerando: artifact_overexposed.png...")
        overexposed = np.clip(base_image * 1.5 + 0.2, 0, 1)
        self._save_image(overexposed, "artifact_overexposed.png")

        # Artifact 3: Underexposure
        print("  Gerando: artifact_underexposed.png...")
        underexposed = base_image * 0.4
        self._save_image(underexposed, "artifact_underexposed.png")

        # Artifact 4: Heavy noise
        print("  Gerando: artifact_heavy_noise.png...")
        noise = np.random.normal(0, 0.15, base_image.shape)
        noisy = np.clip(base_image + noise, 0, 1)
        self._save_image(noisy, "artifact_heavy_noise.png")

        # Artifact 5: Low contrast
        print("  Gerando: artifact_low_contrast.png...")
        low_contrast = base_image * 0.3 + 0.35
        self._save_image(low_contrast, "artifact_low_contrast.png")

        print(f"\n✅ 5 imagens com artifacts criadas")

    def _save_image(self, image: np.ndarray, filename: str):
        """Helper para salvar imagem"""
        image_uint8 = (image * 255).astype(np.uint8)
        image_bgr = cv2.cvtColor(image_uint8, cv2.COLOR_RGB2BGR)
        output_path = self.output_dir / filename
        cv2.imwrite(str(output_path), image_bgr)
        print(f"    ✓ Salvo em: {output_path}")


def main():
    """Função principal"""

    print("="*60)
    print("🏥 FADEX - Gerador de Imagens de Teste")
    print("="*60)

    generator = TestImageGenerator()

    # Gera suite básica
    generator.create_test_suite()

    # Gera exemplos com artifacts
    generator.create_artifact_examples()

    print("\n" + "="*60)
    print("✅ Imagens de teste criadas com sucesso!")
    print("="*60)
    print("\n📝 Próximos passos:")
    print("  1. python scripts/test_fadex.py examples/ --batch")
    print("  2. Verifique os resultados em results/")
    print("  3. Ajuste os parâmetros conforme necessário")


if __name__ == "__main__":
    main()
