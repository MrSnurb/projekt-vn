import PptxGenJS from 'pptxgenjs'
import type { Project } from '../../types/project'
import { walkDefaultPath } from './walkDefaultPath'
import { addProjectSlideToPptx, SLIDE_W, SLIDE_H } from './pptxSlideBuilders'

export async function exportProjectAsPptx(project: Project, fileName = 'meine-visual-novel.pptx'): Promise<void> {
  const path = walkDefaultPath(project)
  const pptx = new PptxGenJS()
  pptx.defineLayout({ name: 'VN_LAYOUT', width: SLIDE_W, height: SLIDE_H })
  pptx.layout = 'VN_LAYOUT'

  for (const slideId of path) {
    const slide = project.slides.find((s) => s.id === slideId)
    if (slide) addProjectSlideToPptx(pptx, project, slide)
  }

  await pptx.writeFile({ fileName })
}
