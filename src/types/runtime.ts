export interface PlayerState {
  currentSlideId: string
  /** index into the current slide's dialogueLines array */
  lineIndex: number
  /** visited slide ids, in order */
  history: string[]
  isEnded: boolean
  /** true once the player has advanced past the last line of a slide that has choices */
  awaitingChoice: boolean
}

export type PlayerAction =
  | { type: 'ADVANCE_LINE' }
  | { type: 'CHOOSE'; choiceIndex: number }
  | { type: 'RESTART' }
