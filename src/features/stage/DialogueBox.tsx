import { NARRATOR_LABEL, DEFAULT_DIALOGUE_FONT_SIZE_PX } from '../../types/project'

interface DialogueBoxProps {
  speakerName: string | null
  speakerColor: string | null
  text: string
  fontSizePx?: number
}

export function DialogueBox({ speakerName, speakerColor, text, fontSizePx }: DialogueBoxProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-black/70 p-4 backdrop-blur-sm">
      <p
        className="mb-1 text-sm font-bold uppercase tracking-wide"
        style={{ color: speakerColor ?? '#e2e8f0' }}
      >
        {speakerName ?? NARRATOR_LABEL}
      </p>
      <p className="min-h-[2.5em] text-white" style={{ fontSize: `${fontSizePx ?? DEFAULT_DIALOGUE_FONT_SIZE_PX}px` }}>
        {text || '…'}
      </p>
    </div>
  )
}
