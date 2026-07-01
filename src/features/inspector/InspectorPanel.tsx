import { useSelectedSlide, useProjectStore } from '../../state/projectStore'
import { validateProject } from '../../engine/validation'
import { SlideBackgroundPicker } from './SlideBackgroundPicker'
import { SlideCharacterPicker } from './SlideCharacterPicker'
import { DialogueEditor } from './DialogueEditor'
import { ChoiceEditor } from './ChoiceEditor'

export function InspectorPanel() {
  const slide = useSelectedSlide()
  const project = useProjectStore((s) => s.project)

  if (!slide) {
    return <div className="w-80 shrink-0 border-l border-slate-200 bg-white p-4 text-sm text-slate-400">Keine Folie ausgewählt.</div>
  }

  const issues = validateProject(project).filter((issue) => issue.slideId === slide.id)

  return (
    <div className="w-80 shrink-0 space-y-5 overflow-y-auto border-l border-slate-200 bg-white p-4">
      {issues.length > 0 && (
        <div className="space-y-1 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {issues.map((issue, i) => (
            <p key={i}>⚠ {issue.message}</p>
          ))}
        </div>
      )}
      <SlideBackgroundPicker slide={slide} />
      <SlideCharacterPicker slide={slide} />
      <DialogueEditor slide={slide} />
      <ChoiceEditor slide={slide} />
    </div>
  )
}
