import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Image, Upload, X } from 'lucide-react'
import { useDraggable } from '../../hooks/useDraggable'
import './CreateProjectModal.css'

const genres = ['玄幻', '言情', '科幻', '悬疑', '历史', '都市', '武侠', '奇幻', '军事', '其他']

function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [genre, setGenre] = useState('玄幻')
  const [description, setDescription] = useState('')
  const portalTarget = typeof document !== 'undefined' ? document.body : null
  const previousFocusRef = useRef(null)
  const modalRef = useRef(null)
  const headerRef = useRef(null)
  const inputRef = useRef(null)
  const closeButtonRef = useRef(null)
  const { handleProps, style: dragStyle } = useDraggable(modalRef, headerRef, isOpen)

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

  const handleCreate = () => {
    if (name.trim()) {
      onCreate({
        name: name.trim(),
        genre,
        description: description.trim(),
        targetWords: 500000
      })
      setName('')
      setGenre('玄幻')
      setDescription('')
      onClose()
    }
  }

  if (!isOpen || !portalTarget) return null

  return createPortal(
    <div className="create-project-overlay">
      <div
        ref={modalRef}
        className="create-project-modal"
        onClick={(event) => event.stopPropagation()}
        style={dragStyle}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div ref={headerRef} className="create-project-header" {...handleProps}>
          <h2 className="create-project-title">创建新作品</h2>
          <button ref={closeButtonRef} onClick={onClose} className="create-project-close" data-no-drag>
            <X size={20} />
          </button>
        </div>

        <div className="create-project-body">
          <div className="flex flex-col gap-10">
            <div className="create-project-top-row flex gap-10 items-start">
              <div className="flex-shrink-0">
                <label className="create-project-label">作品封面</label>
                <div className="cover-upload-container">
                  <div className="cover-upload-placeholder">
                    <Image size={40} strokeWidth={1} />
                    <div className="flex flex-col items-center gap-1 mt-2">
                      <div className="flex items-center gap-1">
                        <Upload size={12} />
                        <span style={{ fontWeight: 600 }}>上传封面</span>
                      </div>
                      <span style={{ fontSize: '10px', opacity: 0.5 }}>建议比例 3:4</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                <div className="create-project-form-group">
                  <label className="create-project-label">
                    作品名称 <span className="create-project-required">*</span>
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="给你的大作起个响亮的名字..."
                    className="create-project-input"
                    autoFocus
                  />
                </div>

                <div className="create-project-form-group">
                  <label className="create-project-label">作品类型</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="create-project-input"
                  >
                    {genres.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="create-project-form-group">
              <label className="create-project-label">作品简介</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="在这部作品中，读者将见证怎样的一段传奇？写一段简短的推介词吧..."
                className="create-project-textarea"
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="create-project-footer">
          <button onClick={onClose} className="create-project-cancel">
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="create-project-confirm"
          >
            创建作品
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  )
}

export default CreateProjectModal
