import jsPDF from 'jspdf'
import type { Project } from '../../types/project'
import { NARRATOR_LABEL } from '../../types/project'

const MARGIN = 20
const LINE_HEIGHT = 6
const PAGE_HEIGHT = 297
const PAGE_WIDTH = 210

function createWriter(doc: jsPDF) {
  let y = MARGIN

  function ensureSpace(next: number) {
    if (y + next > PAGE_HEIGHT - MARGIN) {
      doc.addPage()
      y = MARGIN
    }
  }

  function heading(text: string) {
    ensureSpace(LINE_HEIGHT * 2)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(text, MARGIN, y)
    y += LINE_HEIGHT * 1.8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
  }

  function subheading(text: string) {
    ensureSpace(LINE_HEIGHT * 1.5)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(text, MARGIN, y)
    y += LINE_HEIGHT
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
  }

  function paragraph(text: string, options?: { indent?: number }) {
    const indent = options?.indent ?? 0
    const maxWidth = PAGE_WIDTH - MARGIN * 2 - indent
    const lines: string[] = doc.splitTextToSize(text, maxWidth)
    for (const line of lines) {
      ensureSpace(LINE_HEIGHT)
      doc.text(line, MARGIN + indent, y)
      y += LINE_HEIGHT
    }
  }

  function spacer(amount = LINE_HEIGHT) {
    y += amount
  }

  return { heading, subheading, paragraph, spacer }
}

export function exportProjectAsScriptPdf(project: Project, fileName = 'meine-visual-novel-manuskript.pdf'): void {
  const doc = new jsPDF()
  const w = createWriter(doc)

  w.heading('Figuren')
  if (project.characters.length === 0) {
    w.paragraph('(keine Figuren angelegt)')
  }
  for (const character of project.characters) {
    w.subheading(character.name || '(unbenannt)')
    if (character.description?.trim()) {
      w.paragraph(character.description)
    }
    w.spacer(2)
  }

  w.spacer(4)
  w.heading('Locations')
  if (project.backgrounds.length === 0) {
    w.paragraph('(keine Hintergründe angelegt)')
  }
  for (const background of project.backgrounds) {
    w.subheading(background.name || '(unbenannt)')
    if (background.description?.trim()) {
      w.paragraph(background.description)
    }
    w.spacer(2)
  }

  w.spacer(4)
  w.heading('Manuskript')
  project.slides.forEach((slide, index) => {
    w.subheading(`Szene ${index + 1}`)

    const background = project.backgrounds.find((b) => b.id === slide.backgroundId)
    if (background) {
      w.paragraph(`Ort: ${background.name}`, { indent: 4 })
    }

    const onStageNames = slide.charactersOnStage
      .map((onStage) => project.characters.find((c) => c.id === onStage.characterId)?.name)
      .filter((name): name is string => !!name)
    if (onStageNames.length > 0) {
      w.paragraph(`Figuren: ${onStageNames.join(', ')}`, { indent: 4 })
    }

    for (const line of slide.dialogueLines) {
      if (!line.text.trim()) continue
      const speaker = line.speakerCharacterId
        ? (project.characters.find((c) => c.id === line.speakerCharacterId)?.name ?? NARRATOR_LABEL)
        : NARRATOR_LABEL
      w.paragraph(`${speaker.toUpperCase()}: ${line.text}`, { indent: 4 })
    }

    if (slide.choices && slide.choices.length > 0) {
      w.paragraph('Antwortmöglichkeiten:', { indent: 4 })
      for (const choice of slide.choices) {
        const targetIndex = project.slides.findIndex((s) => s.id === choice.targetSlideId)
        const targetLabel = targetIndex >= 0 ? `Szene ${targetIndex + 1}` : '(kein Ziel gewählt)'
        w.paragraph(`– ${choice.text || '(leere Antwort)'} -> ${targetLabel}`, { indent: 8 })
      }
    }

    w.spacer(4)
  })

  doc.save(fileName)
}
