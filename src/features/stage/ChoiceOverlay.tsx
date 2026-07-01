import type { Choice } from '../../types/project'

interface ChoiceOverlayProps {
  choices: Choice[]
  onChoose?: (index: number) => void
  disabled?: boolean
}

export function ChoiceOverlay({ choices, onChoose, disabled }: ChoiceOverlayProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-black/80 p-4">
      {choices.map((choice, i) => (
        <button
          key={i}
          disabled={disabled}
          onClick={() => onChoose?.(i)}
          className="rounded-md border border-white/30 bg-white/10 px-4 py-2 text-left text-sm text-white transition-colors hover:bg-white/20 disabled:cursor-default disabled:hover:bg-white/10"
        >
          {choice.text || '(leere Antwort)'}
        </button>
      ))}
    </div>
  )
}
