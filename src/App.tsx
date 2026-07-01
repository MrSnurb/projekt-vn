import { useEffect, useState } from 'react'
import { useEditorUiStore } from './state/editorUiStore'
import { useProjectStore } from './state/projectStore'
import { OnboardingWizard } from './features/onboarding/OnboardingWizard'
import { EditorLayout } from './EditorLayout'
import { RecoveryPrompt } from './features/persistence/RecoveryPrompt'
import { readAutosave, writeAutosave, clearAutosave } from './features/persistence/autosaveDb'
import type { AutosaveRecord } from './features/persistence/autosaveDb'

const AUTOSAVE_DEBOUNCE_MS = 3000

export default function App() {
  const view = useEditorUiStore((s) => s.view)
  const [recovery, setRecovery] = useState<AutosaveRecord | null | 'checking'>('checking')

  useEffect(() => {
    readAutosave()
      .then(setRecovery)
      .catch(() => setRecovery(null))
  }, [])

  useEffect(() => {
    let timeout: number | undefined
    const unsubscribe = useProjectStore.subscribe((state) => {
      if (!state.isDirty) return
      if (timeout) window.clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        void writeAutosave(state.project)
      }, AUTOSAVE_DEBOUNCE_MS)
    })
    return () => {
      unsubscribe()
      if (timeout) window.clearTimeout(timeout)
    }
  }, [])

  if (recovery === 'checking') return null

  if (recovery) {
    return (
      <RecoveryPrompt
        record={recovery}
        onRestore={() => {
          useProjectStore.getState().loadProject(recovery.project)
          useEditorUiStore.getState().setView('editor')
          setRecovery(null)
        }}
        onDiscard={() => {
          void clearAutosave()
          setRecovery(null)
        }}
      />
    )
  }

  return view === 'onboarding' ? <OnboardingWizard /> : <EditorLayout />
}
