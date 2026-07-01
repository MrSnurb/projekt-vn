import { useProjectStore } from '../../state/projectStore'
import { useEditorUiStore } from '../../state/editorUiStore'
import { DEFAULT_CHARACTER_SIZE_PCT } from '../../types/project'
import type { Character, CharacterOnStage } from '../../types/project'

const MIN_SIZE_PCT = 8
const MAX_SIZE_PCT = 80

interface StageCharacterProps {
  slideId: string
  character: Character
  onStage: CharacterOnStage
  stageRef: React.RefObject<HTMLDivElement | null>
}

export function StageCharacter({ slideId, character, onStage, stageRef }: StageCharacterProps) {
  const updateCharacterOnStage = useProjectStore((s) => s.updateCharacterOnStage)
  const selectedStageCharacterId = useEditorUiStore((s) => s.selectedStageCharacterId)
  const selectStageCharacter = useEditorUiStore((s) => s.selectStageCharacter)

  const sprite = character.sprites[onStage.expression] ?? Object.values(character.sprites)[0]
  const isSelected = selectedStageCharacterId === character.id
  const sizePct = onStage.sizePct ?? DEFAULT_CHARACTER_SIZE_PCT

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    selectStageCharacter(character.id)
    const stage = stageRef.current
    if (!stage) return
    const target = e.currentTarget
    target.setPointerCapture(e.pointerId)

    function handleMove(ev: PointerEvent) {
      const rect = stage!.getBoundingClientRect()
      const xPct = Math.min(100, Math.max(0, ((ev.clientX - rect.left) / rect.width) * 100))
      const yPct = Math.min(100, Math.max(0, ((ev.clientY - rect.top) / rect.height) * 100))
      updateCharacterOnStage(slideId, character.id, { position: { xPct, yPct } })
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

  function handleResizePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    selectStageCharacter(character.id)
    const stage = stageRef.current
    if (!stage) return
    const target = e.currentTarget
    target.setPointerCapture(e.pointerId)
    const startX = e.clientX
    const startSize = sizePct

    function handleMove(ev: PointerEvent) {
      const rect = stage!.getBoundingClientRect()
      const deltaPct = ((ev.clientX - startX) / rect.width) * 100
      const newSize = Math.min(MAX_SIZE_PCT, Math.max(MIN_SIZE_PCT, startSize + deltaPct))
      updateCharacterOnStage(slideId, character.id, { sizePct: newSize })
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
    <div
      onPointerDown={handlePointerDown}
      className={`group absolute -translate-x-1/2 -translate-y-full cursor-grab touch-none active:cursor-grabbing ${
        isSelected ? 'outline outline-2 outline-offset-2 outline-indigo-400' : ''
      }`}
      style={{ left: `${onStage.position.xPct}%`, top: `${onStage.position.yPct}%`, width: `${sizePct}%` }}
    >
      {sprite ? (
        <img src={sprite} alt={character.name} className="pointer-events-none w-full select-none drop-shadow-lg" />
      ) : (
        <div className="flex aspect-[2/3] w-full items-center justify-center rounded bg-slate-300/80 text-xs text-slate-600">
          {character.name}
        </div>
      )}
      <div
        onPointerDown={handleResizePointerDown}
        title="Ziehen zum Vergrößern/Verkleinern"
        className="absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-nwse-resize touch-none rounded-full border-2 border-white bg-indigo-500 opacity-0 shadow group-hover:opacity-100"
      />
    </div>
  )
}
