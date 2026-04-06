import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle } from 'lucide-react'
import './ConfirmDialog.css'

function ConfirmDialog({ isOpen, title, message, confirmLabel = '确认', cancelLabel = '取消', onConfirm, onClose }) {
  const portalTarget = typeof document !== 'undefined' ? document.body : null
  const previousFocusRef = useRef(null)
  const modalRef = useRef(null)
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !portalTarget) return

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const frame = requestAnimationFrame(() => {
      cancelButtonRef.current?.focus()
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = Array.from(
        modalRef.current?.querySelectorAll('button:not([disabled]), [tabindex]:not([tabindex="-1"])') || []
      ).filter((element) => element.offsetParent !== null || document.activeElement === element)

      if (focusableElements.length === 0) {
        event.preventDefault()
        modalRef.current?.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [isOpen, onClose, portalTarget])

  if (!isOpen || !portalTarget) return null

  return createPortal(
    <div className="confirm-dialog-overlay">
      <div
        ref={modalRef}
        className="confirm-dialog-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="confirm-dialog-header">
          <h2 className="confirm-dialog-title">{title}</h2>
        </div>

        <div className="confirm-dialog-body">
          <div className="confirm-dialog-icon">
            <AlertTriangle size={18} />
          </div>
          <p className="confirm-dialog-message">{message}</p>
        </div>

        <div className="confirm-dialog-footer">
          <button ref={cancelButtonRef} onClick={onClose} className="confirm-dialog-cancel">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="confirm-dialog-confirm">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  )
}

export default ConfirmDialog
