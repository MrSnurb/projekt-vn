import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useProjectStore } from '../../state/projectStore'
import type { Slide } from '../../types/project'

interface SlideThumbnailProps {
  slide: Slide
  index: number
  isSelected: boolean
}

export function SlideThumbnail({ slide, index, isSelected }: SlideThumbnailProps) {
  const background = useProjectStore((s) => s.project.backgrounds.find((b) => b.id === slide.backgroundId))
  const selectSlide = useProjectStore((s) => s.selectSlide)
  const duplicateSlide = useProjectStore((s) => s.duplicateSlide)
  const removeSlide = useProjectStore((s) => s.removeSlide)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  const firstLine = slide.dialogueLines.find((l) => l.text.trim())?.text ?? '(leer)'

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectSlide(slide.id)}
      className={`group relative cursor-pointer rounded-md border-2 p-1.5 ${
        isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-transparent bg-white hover:border-slate-200'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none px-0.5 text-slate-300 hover:text-slate-500 active:cursor-grabbing"
          title="Verschieben"
        >
          ⠿
        </button>
        <span className="w-5 shrink-0 text-xs font-medium text-slate-400">{index + 1}</span>
        <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded bg-slate-200">
          {background?.imageDataUrl && (
            <img src={background.imageDataUrl} alt="" className="h-full w-full object-cover" />
          )}
          {slide.choices && slide.choices.length > 0 && (
            <span className="absolute right-0.5 top-0.5 rounded bg-amber-400 px-1 text-[10px] font-bold text-white" title="Enthält Antwortmöglichkeiten">
              🔀
            </span>
          )}
        </div>
        <p className="line-clamp-2 flex-1 text-xs text-slate-600">{firstLine}</p>
      </div>
      <div className="mt-1 hidden justify-end gap-1 group-hover:flex">
        <button
          onClick={(e) => {
            e.stopPropagation()
            duplicateSlide(slide.id)
          }}
          className="rounded px-1.5 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100"
        >
          Duplizieren
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            removeSlide(slide.id)
          }}
          className="rounded px-1.5 py-0.5 text-[11px] text-red-500 hover:bg-red-50"
        >
          Löschen
        </button>
      </div>
    </div>
  )
}
