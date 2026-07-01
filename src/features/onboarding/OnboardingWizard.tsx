import { useState } from 'react'
import { useProjectStore } from '../../state/projectStore'
import { useEditorUiStore } from '../../state/editorUiStore'
import { Button } from '../../components/Button'
import { CharacterManager } from '../library/CharacterManager'
import { BackgroundManager } from '../library/BackgroundManager'

type Step = 'welcome' | 'characters' | 'backgrounds'

export function OnboardingWizard() {
  const [step, setStep] = useState<Step>('welcome')
  const characters = useProjectStore((s) => s.project.characters)
  const backgrounds = useProjectStore((s) => s.project.backgrounds)
  const setView = useEditorUiStore((s) => s.setView)

  function finish() {
    setView('editor')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-10">
      {step === 'welcome' && (
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Visual Novel Editor</h1>
          <p className="text-slate-600">
            Erstelle deine eigene Visual Novel wie eine Präsentation: Folie für Folie mit Hintergrund, Figuren und
            Dialog. Bevor es losgeht, legen wir kurz deine Figuren und ein paar Hintergründe an — die kannst du später
            jederzeit erweitern.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" onClick={() => setStep('characters')}>
              Neues Projekt starten
            </Button>
            <Button variant="ghost" onClick={finish}>
              Direkt zum Editor (überspringen)
            </Button>
          </div>
        </div>
      )}

      {step === 'characters' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Schritt 1: Wer kommt vor?</h2>
            <p className="text-sm text-slate-500">
              Lege deine Figuren einmal an — Name, Farbe fürs Dialogfeld, und ein oder mehrere Ausdrücke (z.B.
              "neutral", "fröhlich", "traurig").
            </p>
          </div>
          <CharacterManager />
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep('welcome')}>
              Zurück
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep('backgrounds')}>
                Überspringen
              </Button>
              <Button
                variant="primary"
                disabled={characters.length === 0}
                onClick={() => setStep('backgrounds')}
              >
                Weiter
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 'backgrounds' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Schritt 2: Wo spielt die Geschichte?</h2>
            <p className="text-sm text-slate-500">
              Lade ein paar Hintergrundbilder hoch, die du später deinen Folien zuweisen kannst.
            </p>
          </div>
          <BackgroundManager />
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep('characters')}>
              Zurück
            </Button>
            <Button
              variant="primary"
              disabled={backgrounds.length === 0}
              onClick={finish}
            >
              Zum Editor
            </Button>
          </div>
          {backgrounds.length === 0 && (
            <p className="text-right text-xs text-slate-400">
              <button onClick={finish} className="underline hover:text-slate-600">
                Trotzdem ohne Hintergrund fortfahren
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
