import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useDraggable } from '../../hooks/useDraggable'
import './AddChapterModal.css'

function AddChapterModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const portalTarget = typeof document !== 'undefined' ? document.body : null
  const previousFocusRef = useRef(null)
  const inputRef = useRef(null)
  const modalRef = useRef(null)
  const headerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const { handleProps, style: dragStyle } = useDraggable(modalRef, headerRef, isOpen)

  useEffect(() => {
    if (isOpen) {
      setTitle('')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !portalTarget) return

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus()
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
        modalRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') || []
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

  const handleAdd = () => {
    if (title.trim()) {
      onAdd({ title: title.trim(), content: '' })
      setTitle('')
      onClose()
    }
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  if (!isOpen || !portalTarget) return null

  return createPortal(
    <div className="add-chapter-overlay">
      <div
        ref={modalRef}
        className="add-chapter-modal"
        onClick={(event) => event.stopPropagation()}
        style={dragStyle}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div ref={headerRef} className="add-chapter-header" {...handleProps}>
          <h2 className="add-chapter-title">添加新章节</h2>
          <button ref={closeButtonRef} onClick={onClose} className="add-chapter-close" data-no-drag>
            <X size={18} />
          </button>
        </div>

        <div className="add-chapter-body">
          <div className="add-chapter-form-group">
            <label className="add-chapter-label">
              章节标题 <span className="add-chapter-required">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="例如：第一章 初露锋芒..."
              className="add-chapter-input"
              autoFocus
            />
          </div>
        </div>

        <div className="add-chapter-footer">
          <button onClick={onClose} className="add-chapter-cancel">
            取消 (Esc)
          </button>
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="add-chapter-confirm"
          >
            确认添加 (Enter)
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  )
}

export default AddChapterModal
