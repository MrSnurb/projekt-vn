import type { Project } from '../../types/project'

// The File System Access API has no shipped TS lib types in this project yet,
// so we deliberately keep the handle typed as `unknown` at the public boundary
// (see useProjectPersistence.ts) and only cast to `any` at this call site.

export async function saveWithPicker(project: Project, existingHandle?: unknown): Promise<{ handle: unknown }> {
  const handle =
    existingHandle ??
    (await (window as any).showSaveFilePicker({
      suggestedName: 'meine-visual-novel.vnproj.json',
      types: [{ description: 'Visual Novel Projekt', accept: { 'application/json': ['.json'] } }],
    }))
  const writable = await (handle as any).createWritable()
  await writable.write(JSON.stringify(project))
  await writable.close()
  return { handle }
}

export async function openWithPicker(): Promise<{ project: Project; handle: unknown }> {
  const [handle] = await (window as any).showOpenFilePicker({
    types: [{ description: 'Visual Novel Projekt', accept: { 'application/json': ['.json'] } }],
  })
  const file = await handle.getFile()
  const text = await file.text()
  return { project: JSON.parse(text) as Project, handle }
}
