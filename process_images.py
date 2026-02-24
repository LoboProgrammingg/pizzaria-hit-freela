import os
os.environ["CUDA_VISIBLE_DEVICES"] = ""  # Força uso de CPU

from docling.document_converter import DocumentConverter

# Caminho do arquivo PDF
input_doc = "Cardápio delivery.pdf"

# Inicializa o conversor
converter = DocumentConverter()

# Converte o documento
result = converter.convert(input_doc)

# Exporta para Markdown
markdown_output = result.document.export_to_markdown()

with open("output.md", "w", encoding="utf-8") as f:
    f.write(markdown_output)
