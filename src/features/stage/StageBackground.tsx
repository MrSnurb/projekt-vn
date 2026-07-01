import { useProjectStore } from '../../state/projectStore'
import { DEFAULT_BACKGROUND_POSITION } from '../../types/project'
import type { Background, Slide } from '../../types/project'

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value))
}

interface StageBackgroundProps {
  slide: Slide
  background: Background
  stageRef: React.RefObject<HTMLDivElement | null>
}

export function StageBackground({ slide, background, stageRef }: StageBackgroundProps) {
  const setSlideBackgroundPosition = useProjectStore((s) => s.setSlideBackgroundPosition)

  const fitMode = slide.backgroundFitMode ?? 'cover'
  const position = slide.backgroundPosition ?? DEFAULT_BACKGROUND_POSITION

  function handlePointerDown(e: React.PointerEvent<HTMLImageElement>) {
    if (fitMode === 'stretch') return
    e.stopPropagation()
    const stage = stageRef.current
    if (!stage) return
    const target = e.currentTarget
    target.setPointerCapture(e.pointerId)
    const startX = e.clientX
    const startY = e.clientY
    const startPosition = position

    function handleMove(ev: PointerEvent) {
      const rect = stage!.getBoundingClientRect()
      // dragging the image right reveals more of its left side, so the object-position
      // percentage moves opposite to the pointer delta
      const xPct = clamp(startPosition.xPct - ((ev.clientX - startX) / rect.width) * 100)
      const yPct = clamp(startPosition.yPct - ((ev.clientY - startY) / rect.height) * 100)
      setSlideBackgroundPosition(slide.id, { xPct, yPct })
    }
    function stopDragging() {
      target.removeEventListener('pointermove', handleMove)
      target.removeEventListener('pointerup', stopDragging)
      target.removeEventListener('pointercancel', stopDragging)
    }
    target.addEventListener('pointermove', handleMove)
    target.addEventListener('pointerup', stopDragging)
    target.addEventListener('pointercancel', stopDragging)
  }

  return (
    <img
      src={background.imageDataUrl}
      alt=""
      onPointerDown={handlePointerDown}
      className={`absolute inset-0 h-full w-full touch-none select-none ${fitMode === 'stretch' ? '' : 'cursor-move'}`}
      style={{
        objectFit: fitMode === 'stretch' ? 'fill' : 'cover',
        objectPosition: fitMode === 'stretch' ? undefined : `${position.xPct}% ${position.yPct}%`,
      }}
    />
  )
}
