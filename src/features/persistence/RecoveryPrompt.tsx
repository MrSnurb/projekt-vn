import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import type { AutosaveRecord } from './autosaveDb'

function timeAgo(ts: number): string {
  const seconds = Math.round((Date.now() - ts) / 1000)
  if (seconds < 60) return 'vor wenigen Sekunden'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `vor ${minutes} Minute${minutes === 1 ? '' : 'n'}`
  const hours = Math.round(minutes / 60)
  return `vor ${hours} Stunde${hours === 1 ? '' : 'n'}`
}

interface RecoveryPromptProps {
  record: AutosaveRecord
  onRestore: () => void
  onDiscard: () => void
}

export function RecoveryPrompt({ record, onRestore, onDiscard }: RecoveryPromptProps) {
  return (
    <Modal>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Nicht gespeicherte Änderungen gefunden</h2>
        <p className="text-sm text-slate-600">
          Es gibt eine automatisch gesicherte Version deines Projekts von {timeAgo(record.savedAt)}, die nicht
          explizit gespeichert wurde. Möchtest du sie wiederherstellen?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onDiscard}>
            Verwerfen
          </Button>
          <Button variant="primary" onClick={onRestore}>
            Wiederherstellen
          </Button>
        </div>
      </div>
    </Modal>
  )
}
