import { useState } from 'react'
import { useProjectStore } from '../../state/projectStore'
import { useEditorUiStore } from '../../state/editorUiStore'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { PlayerStage } from '../stage/PlayerStage'
import { getInitialState, reduce } from '../../engine/playerEngine'
import type { PlayerState } from '../../types/runtime'

export function PlaytestOverlay() {
  const project = useProjectStore((s) => s.project)
  const closePlaytest = useEditorUiStore((s) => s.closePlaytest)
  const [state, setState] = useState<PlayerState>(() => getInitialState(project))

  const isEnded = state.isEnded || !project.slides.some((s) => s.id === state.currentSlideId)

  return (
    <Modal onClose={closePlaytest} fullscreen>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-slate-200">
        <span className="text-sm font-medium">Playtest</span>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setState(getInitialState(project))}>
            ↺ Neustart
          </Button>
          <Button variant="ghost" onClick={closePlaytest}>
            Editor
          </Button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden p-6">
        {isEnded ? (
          <div className="space-y-4 text-center text-slate-200">
            <p className="text-lg font-semibold">— Ende —</p>
            <Button variant="primary" onClick={() => setState(getInitialState(project))}>
              Nochmal von vorne
            </Button>
          </div>
        ) : (
          <PlayerStage
            project={project}
            state={state}
            onAdvance={() => setState((s) => reduce(project, s, { type: 'ADVANCE_LINE' }))}
            onChoose={(i) => setState((s) => reduce(project, s, { type: 'CHOOSE', choiceIndex: i }))}
          />
        )}
      </div>
    </Modal>
  )
}
