import type { Project, Slide } from '../../types/project'

/**
 * Walks the story from the first slide, always taking the first choice at any
 * branch, to produce a single linear path for the PPTX storyboard export.
 * Stops at the end of the story or the moment a slide would repeat (a loop),
 * since a static slide deck can't represent an actual cycle.
 */
export function walkDefaultPath(project: Project): string[] {
  if (project.slides.length === 0) return []

  const path: string[] = []
  const visited = new Set<string>()
  let current: Slide | undefined = project.slides[0]

  while (current && !visited.has(current.id)) {
    path.push(current.id)
    visited.add(current.id)

    if (current.isEnding && !(current.choices && current.choices.length > 0)) {
      break
    }

    if (current.choices && current.choices.length > 0) {
      const targetId: string | undefined = current.choices[0]?.targetSlideId
      current = project.slides.find((s) => s.id === targetId)
    } else if (current.nextSlideId !== undefined) {
      const targetId: string = current.nextSlideId
      current = project.slides.find((s) => s.id === targetId)
    } else {
      const index = project.slides.indexOf(current)
      current = project.slides[index + 1]
    }
  }

  return path
}
