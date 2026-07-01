import { useRef } from 'react'
import { useProjectStore } from '../../state/projectStore'
import { useEditorUiStore } from '../../state/editorUiStore'
import { supportsFileSystemAccess } from './backendDetection'
import { saveWithPicker, openWithPicker } from './fsAccessBackend'
import { saveViaDownload, openViaFileInput } from './downloadUploadBackend'
import { clearAutosave } from './autosaveDb'
import { createEmptyProject } from '../../types/project'

function isAbort(err: unknown): boolean {
  return err instanceof Error && err.name === 'AbortError'
}

export function useProjectPersistence() {
  const project = useProjectStore((s) => s.project)
  const loadProject = useProjectStore((s) => s.loadProject)
  const markSaved = useProjectStore((s) => s.markSaved)
  const setView = useEditorUiStore((s) => s.setView)
  const handleRef = useRef<unknown>(null)

  const canSaveInPlace = supportsFileSystemAccess()

  async function saveTo(useExistingHandle: boolean) {
    if (canSaveInPlace) {
      try {
        const { handle } = await saveWithPicker(project, useExistingHandle ? (handleRef.current ?? undefined) : undefined)
        handleRef.current = handle
      } catch (err) {
        if (isAbort(err)) return
        throw err
      }
    } else {
      saveViaDownload(project)
    }
    markSaved()
    await clearAutosave()
  }

  async function save() {
    await saveTo(true)
  }

  async function saveAs() {
    await saveTo(false)
  }

  async function open() {
    try {
      if (canSaveInPlace) {
        const { project: loaded, handle } = await openWithPicker()
        handleRef.current = handle
        loadProject(loaded)
      } else {
        const loaded = await openViaFileInput()
        loadProject(loaded)
      }
      setView('editor')
      await clearAutosave()
    } catch (err) {
      if (isAbort(err)) return
      throw err
    }
  }

  function newProject() {
    if (useProjectStore.getState().isDirty) {
      const confirmed = window.confirm('Es gibt ungespeicherte Änderungen. Trotzdem ein neues Projekt starten?')
      if (!confirmed) return
    }
    handleRef.current = null
    loadProject(createEmptyProject())
    setView('onboarding')
    clearAutosave()
  }

  return { save, saveAs, open, newProject, canSaveInPlace }
}
