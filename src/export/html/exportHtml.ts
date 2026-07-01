import runtimeJs from './generated/runtime.js?raw'
import runtimeCss from './generated/runtime.css?raw'
import type { Project } from '../../types/project'
import { buildHtmlShell } from './htmlShellTemplate'
import { downloadBlob } from '../../lib/download'

/**
 * Neutralizes "</script>" (and any other "<...") sequences that could appear inside
 * dialogue/character text, which would otherwise prematurely close our inline <script> tag.
 * Safe because JSON syntax never uses "<" outside of string content.
 */
function embedJson(project: Project): string {
  return JSON.stringify(project).replace(/</g, '\\u003c')
}

export function exportProjectAsHtml(project: Project, fileName = 'meine-visual-novel.html'): void {
  const html = buildHtmlShell({
    css: runtimeCss,
    js: runtimeJs,
    projectJson: embedJson(project),
    title: 'Meine Visual Novel',
  })
  const blob = new Blob([html], { type: 'text/html' })
  downloadBlob(blob, fileName)
}
