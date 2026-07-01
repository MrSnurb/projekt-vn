import type { ReactNode } from 'react'

interface ModalProps {
  onClose?: () => void
  children: ReactNode
  fullscreen?: boolean
}

export function Modal({ onClose, children, fullscreen }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className={
          fullscreen
            ? 'relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-slate-900'
            : 'relative max-h-full w-full max-w-lg overflow-y-auto rounded-lg bg-white p-5 shadow-xl'
        }
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-black/10 hover:text-slate-100"
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
