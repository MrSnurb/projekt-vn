interface ResizeOptions {
  maxDimension?: number
  /** JPEG drops transparency but compresses far better; use for full-bleed backgrounds. */
  forceJpeg?: boolean
  quality?: number
}

/**
 * Downscales and recompresses an uploaded image client-side before it's stored as a
 * base64 data URL, so project files and HTML exports don't balloon in size.
 * Sprites default to PNG to preserve transparency; backgrounds should pass forceJpeg.
 */
export function resizeAndCompressImage(file: File, options: ResizeOptions = {}): Promise<string> {
  const { maxDimension = 1920, forceJpeg = false, quality = 0.82 } = options

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      let { width, height } = img
      if (width > maxDimension || height > maxDimension) {
        const scale = maxDimension / Math.max(width, height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas wird nicht unterstützt'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      resolve(forceJpeg ? canvas.toDataURL('image/jpeg', quality) : canvas.toDataURL('image/png'))
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Bild konnte nicht geladen werden'))
    }
    img.src = objectUrl
  })
}
