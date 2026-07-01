export interface Character {
  id: string
  name: string
  color: string
  /** expressionKey (e.g. "neutral", "happy") -> image data URL */
  sprites: Record<string, string>
}

export interface Background {
  id: string
  name: string
  imageDataUrl: string
}

export interface CharacterOnStage {
  characterId: string
  expression: string
  /** percentage coordinates (0-100), resolution independent */
  position: { xPct: number; yPct: number }
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
}

export interface Project {
  characters: Character[]
  backgrounds: Background[]
  slides: Slide[]
}

export function createEmptyProject(): Project {
  return { characters: [], backgrounds: [], slides: [] }
}

export const NARRATOR_LABEL = 'Erzähler'
export const DEFAULT_EXPRESSION = 'neutral'
