#!/usr/bin/env python3
"""
Script para processar imagens de pizza no padrão iFood.
Cria uma imagem quadrada com bordas escuras/vinheta e a pizza centralizada.
"""

import os
from PIL import Image, ImageDraw, ImageFilter
import math

# Diretórios
FLAVORS_DIR = "media/flavors/sweet_flavors"
OUTPUT_DIR = "media/flavors/sweet_flavors/ifood_ready"

# Configurações de saída
OUTPUT_SIZE = 800  # Tamanho final quadrado
VIGNETTE_STRENGTH = 0.6  # Intensidade da vinheta


def create_vignette_mask(size):
    """Cria uma máscara de vinheta para aplicar nas bordas."""
    mask = Image.new('L', (size, size), 255)
    draw = ImageDraw.Draw(mask)
    
    center = size // 2
    max_radius = math.sqrt(2) * center
    
    for y in range(size):
        for x in range(size):
            distance = math.sqrt((x - center) ** 2 + (y - center) ** 2)
            # Começa a escurecer a partir de 50% do raio
            if distance > center * 0.5:
                factor = (distance - center * 0.5) / (max_radius - center * 0.5)
                factor = min(1.0, factor * VIGNETTE_STRENGTH)
                brightness = int(255 * (1 - factor))
                mask.putpixel((x, y), brightness)
    
    return mask


def create_gradient_background(size):
    """Cria um fundo gradiente marrom escuro similar ao padrão iFood."""
    img = Image.new('RGB', (size, size), (60, 40, 30))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    max_radius = math.sqrt(2) * center
    
    for y in range(size):
        for x in range(size):
            distance = math.sqrt((x - center) ** 2 + (y - center) ** 2)
            factor = distance / max_radius
            
            # Gradiente do centro para as bordas (mais escuro nas bordas)
            r = int(80 - factor * 50)
            g = int(55 - factor * 35)
            b = int(40 - factor * 25)
            
            img.putpixel((x, y), (max(0, r), max(0, g), max(0, b)))
    
    return img


def process_image(input_path, output_path):
    """Processa uma imagem de pizza para o padrão iFood."""
    try:
        # Abre a imagem original
        img = Image.open(input_path)
        img = img.convert('RGB')
        
        # Calcula dimensões para crop quadrado (centro)
        width, height = img.size
        min_dim = min(width, height)
        
        # Crop para quadrado centralizado
        left = (width - min_dim) // 2
        top = (height - min_dim) // 2
        right = left + min_dim
        bottom = top + min_dim
        
        img = img.crop((left, top, right, bottom))
        
        # Redimensiona para o tamanho de saída
        img = img.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.LANCZOS)
        
        # Cria fundo gradiente
        background = create_gradient_background(OUTPUT_SIZE)
        
        # Cria máscara circular suave para a pizza
        pizza_mask = Image.new('L', (OUTPUT_SIZE, OUTPUT_SIZE), 0)
        draw = ImageDraw.Draw(pizza_mask)
        
        # Círculo com borda suave
        margin = 20
        draw.ellipse([margin, margin, OUTPUT_SIZE - margin, OUTPUT_SIZE - margin], fill=255)
        
        # Suaviza a borda
        pizza_mask = pizza_mask.filter(ImageFilter.GaussianBlur(15))
        
        # Compõe a pizza sobre o fundo
        background.paste(img, (0, 0), pizza_mask)
        
        # Aplica vinheta
        vignette_mask = create_vignette_mask(OUTPUT_SIZE)
        
        # Cria overlay escuro para vinheta
        dark_overlay = Image.new('RGB', (OUTPUT_SIZE, OUTPUT_SIZE), (0, 0, 0))
        
        # Inverte a máscara para que as bordas fiquem escuras
        inverted_mask = Image.eval(vignette_mask, lambda x: 255 - x)
        
        # Aplica a vinheta
        result = Image.composite(dark_overlay, background, inverted_mask)
        
        # Salva o resultado
        result.save(output_path, 'JPEG', quality=90)
        print(f"✓ Processado: {os.path.basename(input_path)}")
        return True
        
    except Exception as e:
        print(f"✗ Erro ao processar {input_path}: {e}")
        return False


def main():
    """Processa todas as imagens de pizza."""
    # Garante que o diretório de saída existe
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Lista todas as imagens JPEG no diretório de flavors
    processed = 0
    skipped = 0
    errors = 0
    
    for filename in os.listdir(FLAVORS_DIR):
        if filename.lower().endswith(('.jpeg', '.jpg', '.png')):
            # Ignora a pasta ifood_ready
            input_path = os.path.join(FLAVORS_DIR, filename)
            
            if os.path.isfile(input_path):
                output_path = os.path.join(OUTPUT_DIR, filename)
                
                # Verifica se já foi processado
                if os.path.exists(output_path):
                    print(f"→ Já existe: {filename}")
                    skipped += 1
                    continue
                
                if process_image(input_path, output_path):
                    processed += 1
                else:
                    errors += 1
    
    print(f"\n{'='*50}")
    print(f"Resumo:")
    print(f"  Processados: {processed}")
    print(f"  Já existentes: {skipped}")
    print(f"  Erros: {errors}")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
