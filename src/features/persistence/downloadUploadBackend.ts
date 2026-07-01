import { downloadBlob } from '../../lib/download'
import type { Project } from '../../types/project'

export function saveViaDownload(project: Project, fileName = 'meine-visual-novel.vnproj.json'): void {
  const blob = new Blob([JSON.stringify(project)], { type: 'application/json' })
  downloadBlob(blob, fileName)
}

export function openViaFileInput(): Promise<Project> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) {
        reject(new Error('Keine Datei ausgewählt'))
        return
      }
      try {
        const text = await file.text()
        resolve(JSON.parse(text) as Project)
      } catch (err) {
        reject(err)
      }
    }
    input.click()
  })
}
