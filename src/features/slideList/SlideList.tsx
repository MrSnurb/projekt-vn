import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useProjectStore } from '../../state/projectStore'
import { useEditorUiStore } from '../../state/editorUiStore'
import { SlideThumbnail } from './SlideThumbnail'
import { Button } from '../../components/Button'

export function SlideList() {
  const slides = useProjectStore((s) => s.project.slides)
  const selectedSlideId = useProjectStore((s) => s.selectedSlideId)
  const addSlide = useProjectStore((s) => s.addSlide)
  const reorderSlides = useProjectStore((s) => s.reorderSlides)
  const isOpen = useEditorUiStore((s) => s.isSlidesPanelOpen)
  const closeSlidesPanel = useEditorUiStore((s) => s.closeSlidesPanel)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = slides.findIndex((s) => s.id === active.id)
    const newIndex = slides.findIndex((s) => s.id === over.id)
    reorderSlides(arrayMove(slides.map((s) => s.id), oldIndex, newIndex))
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50 transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
        <h2 className="text-sm font-semibold text-slate-700">Folien</h2>
        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={() => addSlide(selectedSlideId)}>
            + Folie
          </Button>
          <button onClick={closeSlidesPanel} className="text-slate-400 hover:text-slate-700 md:hidden" title="Schließen">
            ✕
          </button>
        </div>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {slides.length === 0 && (
          <p className="mt-4 text-center text-xs text-slate-400">Noch keine Folien. Leg mit "+ Folie" los.</p>
        )}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {slides.map((slide, i) => (
              <SlideThumbnail key={slide.id} slide={slide} index={i} isSelected={slide.id === selectedSlideId} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
