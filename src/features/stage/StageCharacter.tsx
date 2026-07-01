import { useRef } from 'react'
import { useProjectStore } from '../../state/projectStore'
import { useEditorUiStore } from '../../state/editorUiStore'
import type { Character, CharacterOnStage } from '../../types/project'

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
  const draggingRef = useRef(false)

  const sprite = character.sprites[onStage.expression] ?? Object.values(character.sprites)[0]
  const isSelected = selectedStageCharacterId === character.id

  function handlePointerDown(e: React.PointerEvent) {
    e.stopPropagation()
    selectStageCharacter(character.id)
    draggingRef.current = true
    const stage = stageRef.current
    if (!stage) return

    function handleMove(ev: PointerEvent) {
      if (!draggingRef.current || !stage) return
      const rect = stage.getBoundingClientRect()
      const xPct = Math.min(100, Math.max(0, ((ev.clientX - rect.left) / rect.width) * 100))
      const yPct = Math.min(100, Math.max(0, ((ev.clientY - rect.top) / rect.height) * 100))
      updateCharacterOnStage(slideId, character.id, { position: { xPct, yPct } })
    }
    function handleUp() {
      draggingRef.current = false
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      className={`absolute w-[28%] max-w-48 -translate-x-1/2 -translate-y-full cursor-grab touch-none active:cursor-grabbing ${
        isSelected ? 'outline outline-2 outline-offset-2 outline-indigo-400' : ''
      }`}
      style={{ left: `${onStage.position.xPct}%`, top: `${onStage.position.yPct}%` }}
    >
      {sprite ? (
        <img src={sprite} alt={character.name} className="pointer-events-none w-full select-none drop-shadow-lg" />
      ) : (
        <div className="flex aspect-[2/3] w-full items-center justify-center rounded bg-slate-300/80 text-xs text-slate-600">
          {character.name}
        </div>
      )}
    </div>
  )
}
