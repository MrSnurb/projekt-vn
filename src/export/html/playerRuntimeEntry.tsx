import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import '../../styles/index.css'
import { PlayerStage } from '../../features/stage/PlayerStage'
import { getInitialState, reduce } from '../../engine/playerEngine'
import type { Project } from '../../types/project'
import type { PlayerState } from '../../types/runtime'

declare global {
  interface Window {
    __VN_PROJECT__: Project
  }
}

function Game({ project }: { project: Project }) {
  const [state, setState] = useState<PlayerState>(() => getInitialState(project))
  const isEnded = state.isEnded || !project.slides.some((s) => s.id === state.currentSlideId)

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      {isEnded ? (
        <div className="space-y-4 text-center text-slate-100">
          <p className="text-xl font-semibold">— Ende —</p>
          <button
            onClick={() => setState(getInitialState(project))}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Nochmal von vorne
          </button>
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
  )
}

const container = document.getElementById('vn-root')
if (container) {
  createRoot(container).render(<Game project={window.__VN_PROJECT__} />)
}
