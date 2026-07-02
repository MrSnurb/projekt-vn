import { create } from 'zustand'

export type EditorView = 'onboarding' | 'editor'
export type EditorTab = 'slides' | 'cast' | 'backgrounds'

interface EditorUiState {
  view: EditorView
  activeTab: EditorTab
  isPlaytestOpen: boolean
  selectedStageCharacterId: string | null
  /** mobile-only: the slide list and inspector render as off-canvas drawers instead of fixed columns */
  isSlidesPanelOpen: boolean
  isInspectorPanelOpen: boolean

  setView: (view: EditorView) => void
  setActiveTab: (tab: EditorTab) => void
  openPlaytest: () => void
  closePlaytest: () => void
  selectStageCharacter: (id: string | null) => void
  openSlidesPanel: () => void
  closeSlidesPanel: () => void
  openInspectorPanel: () => void
  closeInspectorPanel: () => void
}

export const useEditorUiStore = create<EditorUiState>((set) => ({
  view: 'onboarding',
  activeTab: 'slides',
  isPlaytestOpen: false,
  selectedStageCharacterId: null,
  isSlidesPanelOpen: false,
  isInspectorPanelOpen: false,

  setView: (view) => set({ view }),
  setActiveTab: (activeTab) => set({ activeTab }),
  openPlaytest: () => set({ isPlaytestOpen: true }),
  closePlaytest: () => set({ isPlaytestOpen: false }),
  selectStageCharacter: (id) => set({ selectedStageCharacterId: id }),
  openSlidesPanel: () => set({ isSlidesPanelOpen: true, isInspectorPanelOpen: false }),
  closeSlidesPanel: () => set({ isSlidesPanelOpen: false }),
  openInspectorPanel: () => set({ isInspectorPanelOpen: true, isSlidesPanelOpen: false }),
  closeInspectorPanel: () => set({ isInspectorPanelOpen: false }),
}))
