import type PptxGenJS from 'pptxgenjs'
import type { Project, Slide } from '../../types/project'
import { NARRATOR_LABEL } from '../../types/project'

export const SLIDE_W = 10
export const SLIDE_H = 5.63

export function addProjectSlideToPptx(pptx: PptxGenJS, project: Project, slide: Slide): void {
  const pptxSlide = pptx.addSlide()
  const background = project.backgrounds.find((b) => b.id === slide.backgroundId)

  if (background?.imageDataUrl) {
    pptxSlide.addImage({ data: background.imageDataUrl, x: 0, y: 0, w: SLIDE_W, h: SLIDE_H })
  } else {
    pptxSlide.background = { color: '1E293B' }
  }

  for (const onStage of slide.charactersOnStage) {
    const character = project.characters.find((c) => c.id === onStage.characterId)
    const sprite = character?.sprites[onStage.expression] ?? Object.values(character?.sprites ?? {})[0]
    if (!character || !sprite) continue
    const w = SLIDE_W * 0.26
    const h = w * 1.5
    const x = Math.min(Math.max((onStage.position.xPct / 100) * SLIDE_W - w / 2, 0), SLIDE_W - w)
    const y = Math.min(Math.max((onStage.position.yPct / 100) * SLIDE_H - h, 0), SLIDE_H - h)
    pptxSlide.addImage({ data: sprite, x, y, w, h })
  }

  const dialogueText = slide.dialogueLines
    .filter((l) => l.text.trim())
    .map((l) => {
      const speaker = l.speakerCharacterId
        ? (project.characters.find((c) => c.id === l.speakerCharacterId)?.name ?? NARRATOR_LABEL)
        : NARRATOR_LABEL
      return `${speaker}: ${l.text}`
    })
    .join('\n')

  if (dialogueText) {
    pptxSlide.addText(dialogueText, {
      x: 0.3,
      y: SLIDE_H - 1.6,
      w: SLIDE_W - 0.6,
      h: 1.4,
      fill: { color: '000000', transparency: 30 },
      color: 'FFFFFF',
      fontSize: 14,
      valign: 'top',
      margin: 8,
      autoFit: true,
    })
  }

  if (slide.choices && slide.choices.length > 0) {
    const choicesText =
      'Antwortmöglichkeiten (diese Route folgt der ersten):\n' +
      slide.choices.map((c, i) => `${i + 1}. ${c.text || '(leer)'}`).join('\n')
    pptxSlide.addText(choicesText, {
      x: 0.3,
      y: 0.3,
      w: SLIDE_W - 0.6,
      h: 1.2,
      fill: { color: 'FBBF24' },
      color: '1E293B',
      fontSize: 12,
      valign: 'top',
      margin: 6,
      autoFit: true,
    })
  }
}
