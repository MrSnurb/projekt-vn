import { useProjectStore } from '../../state/projectStore'
import type { Slide } from '../../types/project'

export function SlideBackgroundPicker({ slide }: { slide: Slide }) {
  const backgrounds = useProjectStore((s) => s.project.backgrounds)
  const setSlideBackground = useProjectStore((s) => s.setSlideBackground)
  const setSlideBackgroundFitMode = useProjectStore((s) => s.setSlideBackgroundFitMode)
  const fitMode = slide.backgroundFitMode ?? 'cover'

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hintergrund</h3>
      {slide.backgroundId && (
        <div className="flex gap-1 rounded-md bg-slate-100 p-0.5 text-xs">
          <button
            onClick={() => setSlideBackgroundFitMode(slide.id, 'cover')}
            className={`flex-1 rounded px-2 py-1 ${fitMode === 'cover' ? 'bg-white font-medium text-slate-900 shadow-sm' : 'text-slate-500'}`}
            title="Bild füllt die Folie, per Ziehen auf der Bühne verschiebbar"
          >
            Ausschnitt (verschiebbar)
          </button>
          <button
            onClick={() => setSlideBackgroundFitMode(slide.id, 'stretch')}
            className={`flex-1 rounded px-2 py-1 ${fitMode === 'stretch' ? 'bg-white font-medium text-slate-900 shadow-sm' : 'text-slate-500'}`}
            title="Bild wird exakt auf die Foliengröße gestreckt"
          >
            Strecken
          </button>
        </div>
      )}
      {backgrounds.length === 0 ? (
        <p className="text-xs text-slate-400">Noch keine Hintergründe angelegt (Tab "Hintergründe").</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setSlideBackground(slide.id, null)}
            className={`aspect-video rounded border-2 text-[10px] text-slate-400 ${
              !slide.backgroundId ? 'border-indigo-500' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            Kein Hintergrund
          </button>
          {backgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => setSlideBackground(slide.id, bg.id)}
              title={bg.name}
              className={`aspect-video overflow-hidden rounded border-2 ${
                slide.backgroundId === bg.id ? 'border-indigo-500' : 'border-transparent hover:border-slate-300'
              }`}
            >
              {bg.imageDataUrl && <img src={bg.imageDataUrl} alt={bg.name} className="h-full w-full object-cover" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
