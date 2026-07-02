export interface Character {
  id: string
  name: string
  color: string
  /** expressionKey (e.g. "neutral", "happy") -> image data URL */
  sprites: Record<string, string>
  /** author-only note, never shown in the exported game; included in the PDF manuscript export */
  description?: string
}

export interface Background {
  id: string
  name: string
  imageDataUrl: string
  /** author-only note, never shown in the exported game; included in the PDF manuscript export */
  description?: string
}

export interface CharacterOnStage {
  characterId: string
  expression: string
  /** percentage coordinates (0-100), resolution independent */
  position: { xPct: number; yPct: number }
  /** width as a percentage of the stage width; defaults to DEFAULT_CHARACTER_SIZE_PCT when undefined */
  sizePct?: number
}

export interface DialogueLine {
  /** null = Narrator */
  speakerCharacterId: string | null
  text: string
}

export interface Choice {
  text: string
  targetSlideId: string
}

export interface Slide {
  id: string
  backgroundId: string | null
  charactersOnStage: CharacterOnStage[]
  dialogueLines: DialogueLine[]
  /** if present (even empty array), this slide ends in a player choice instead of auto-advancing */
  choices?: Choice[]
  /** 'cover' (default): crop-to-fill, draggable via backgroundPosition. 'stretch': fill exactly, distorting aspect ratio. */
  backgroundFitMode?: 'cover' | 'stretch'
  /** percentage (0-100) used as CSS object-position when backgroundFitMode is 'cover'; defaults to centered */
  backgroundPosition?: { xPct: number; yPct: number }
  /** shown as a heading above this slide in the slide list, to group it and following slides into a labeled section */
  sectionTitle?: string
  /** if true and this slide has no active choices, the story ends here instead of auto-advancing to the next slide */
  isEnding?: boolean
}

export interface Project {
  characters: Character[]
  backgrounds: Background[]
  slides: Slide[]
  /** font size (px) for the dialogue box text, applies to the whole story; defaults to DEFAULT_DIALOGUE_FONT_SIZE_PX */
  dialogueFontSizePx?: number
}

export function createEmptyProject(): Project {
  return { characters: [], backgrounds: [], slides: [] }
}

export const NARRATOR_LABEL = 'Erzähler'
export const DEFAULT_EXPRESSION = 'neutral'
export const DEFAULT_CHARACTER_SIZE_PCT = 28
export const DEFAULT_BACKGROUND_POSITION = { xPct: 50, yPct: 50 }
export const DEFAULT_DIALOGUE_FONT_SIZE_PX = 18
export const DIALOGUE_FONT_SIZE_PRESETS = [
  { label: 'Klein', px: 14 },
  { label: 'Normal', px: 18 },
  { label: 'Groß', px: 26 },
  { label: 'Sehr groß', px: 36 },
]
