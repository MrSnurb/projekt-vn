import { create } from 'zustand'

export type EditorView = 'onboarding' | 'editor'
export type EditorTab = 'slides' | 'cast' | 'backgrounds'

interface EditorUiState {
  view: EditorView
  activeTab: EditorTab
  isPlaytestOpen: boolean
  selectedStageCharacterId: string | null

  setView: (view: EditorView) => void
  setActiveTab: (tab: EditorTab) => void
  openPlaytest: () => void
  closePlaytest: () => void
  selectStageCharacter: (id: string | null) => void
}

export const useEditorUiStore = create<EditorUiState>((set) => ({
  view: 'onboarding',
  activeTab: 'slides',
  isPlaytestOpen: false,
  selectedStageCharacterId: null,

  setView: (view) => set({ view }),
  setActiveTab: (activeTab) => set({ activeTab }),
  openPlaytest: () => set({ isPlaytestOpen: true }),
  closePlaytest: () => set({ isPlaytestOpen: false }),
  selectStageCharacter: (id) => set({ selectedStageCharacterId: id }),
}))
