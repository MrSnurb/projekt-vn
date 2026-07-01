import { useRef } from 'react'
import { resizeAndCompressImage } from '../lib/imageProcessing'

interface ImageDropzoneProps {
  value?: string | null
  onChange: (dataUrl: string) => void
  label?: string
  className?: string
  /** 'background' recompresses to JPEG (smaller, no transparency needed); 'sprite' keeps PNG for alpha. */
  variant?: 'sprite' | 'background'
}

export function ImageDropzone({ value, onChange, label, className, variant = 'sprite' }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    const dataUrl = await resizeAndCompressImage(file, { forceJpeg: variant === 'background' })
    onChange(dataUrl)
  }

  return (
    <div
      className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-indigo-400 ${className ?? 'h-24 w-24'}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
      }}
    >
      {value ? (
        <img src={value} alt={label ?? 'Bild'} className="h-full w-full object-cover" />
      ) : (
        <span className="px-2 text-center text-xs text-slate-400">{label ?? 'Bild wählen'}</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
