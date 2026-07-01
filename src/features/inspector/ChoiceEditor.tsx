import { useProjectStore } from '../../state/projectStore'
import { Button } from '../../components/Button'
import type { Slide } from '../../types/project'

function slideLabel(slide: Slide, index: number): string {
  const firstLine = slide.dialogueLines.find((l) => l.text.trim())?.text
  return `${index + 1}. ${firstLine ? firstLine.slice(0, 30) : '(leere Folie)'}`
}

export function ChoiceEditor({ slide }: { slide: Slide }) {
  const slides = useProjectStore((s) => s.project.slides)
  const enableChoices = useProjectStore((s) => s.enableChoices)
  const disableChoices = useProjectStore((s) => s.disableChoices)
  const addChoice = useProjectStore((s) => s.addChoice)
  const updateChoice = useProjectStore((s) => s.updateChoice)
  const removeChoice = useProjectStore((s) => s.removeChoice)
  const addSlide = useProjectStore((s) => s.addSlide)
  const setSlideIsEnding = useProjectStore((s) => s.setSlideIsEnding)

  const hasChoices = !!slide.choices

  function createLinkedSlide(choiceIndex: number) {
    const newId = addSlide(slide.id)
    updateChoice(slide.id, choiceIndex, { targetSlideId: newId })
  }

  return (
    <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50/50 p-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700">Antworten &amp; Verzweigung</h3>
        {hasChoices ? (
          <button onClick={() => disableChoices(slide.id)} className="text-xs text-slate-500 underline hover:text-slate-700">
            Deaktivieren
          </button>
        ) : (
          <Button onClick={() => enableChoices(slide.id)}>+ Antworten aktivieren</Button>
        )}
      </div>

      {!hasChoices && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">
            {slide.isEnding
              ? 'Diese Folie ist ein Ende der Geschichte – hier hört die Story auf.'
              : 'Diese Folie geht automatisch zur nächsten über. Aktiviere Antworten, um dem Spieler eine Wahl zu geben, die die Geschichte verzweigt.'}
          </p>
          <label className="flex items-center gap-1.5 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={!!slide.isEnding}
              onChange={(e) => setSlideIsEnding(slide.id, e.target.checked)}
            />
            Dies ist ein Ende der Geschichte (nicht zur nächsten Folie weitergehen)
          </label>
        </div>
      )}

      {hasChoices && (
        <div className="space-y-2">
          {slide.choices!.map((choice, i) => (
            <div key={i} className="space-y-1 rounded border border-amber-200 bg-white p-2">
              <div className="flex items-center gap-1">
                <input
                  value={choice.text}
                  onChange={(e) => updateChoice(slide.id, i, { text: e.target.value })}
                  placeholder="Antworttext, z.B. „Ich vertraue dir“"
                  className="flex-1 rounded border border-slate-200 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <button onClick={() => removeChoice(slide.id, i)} className="px-1 text-xs text-red-400 hover:text-red-600">
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">führt zu</span>
                <select
                  value={choice.targetSlideId}
                  onChange={(e) => updateChoice(slide.id, i, { targetSlideId: e.target.value })}
                  className="flex-1 rounded border border-slate-200 bg-white px-1.5 py-1 text-xs"
                >
                  <option value="">– Folie wählen –</option>
                  {slides.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      {slideLabel(s, idx)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => createLinkedSlide(i)}
                  className="whitespace-nowrap text-xs text-indigo-600 underline hover:text-indigo-800"
                >
                  + Neue Folie
                </button>
              </div>
            </div>
          ))}
          <Button onClick={() => addChoice(slide.id)}>+ Weitere Antwort</Button>
        </div>
      )}
    </div>
  )
}
