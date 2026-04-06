import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Image, Upload, X } from 'lucide-react'
import { useDraggable } from '../../hooks/useDraggable'
import './CreateProjectModal.css'

const genres = ['玄幻', '言情', '科幻', '悬疑', '历史', '都市', '武侠', '奇幻', '军事', '其他']
const COVER_MAX_WIDTH = 900
const COVER_MAX_HEIGHT = 1200
const COVER_QUALITY = 0.72

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new window.Image()
  image.onload = () => resolve(image)
  image.onerror = () => reject(new Error('图片加载失败'))
  image.src = src
})

const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onloadend = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('图片读取失败'))
  reader.readAsDataURL(file)
})

const compressCoverImage = async (file) => {
  const source = await readFileAsDataURL(file)
  const image = await loadImage(source)
  const scale = Math.min(COVER_MAX_WIDTH / image.width, COVER_MAX_HEIGHT / image.height, 1)
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    return source
  }

  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', COVER_QUALITY)
}

function EditProjectModal({ isOpen, onClose, onEdit, project }) {
  const [name, setName] = useState('')
  const [genre, setGenre] = useState('玄幻')
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState('')
  const [targetWordCount, setTargetWordCount] = useState('300000')
  const [targetChapterCount, setTargetChapterCount] = useState('100')
  const portalTarget = typeof document !== 'undefined' ? document.body : null
  const previousFocusRef = useRef(null)
  const modalRef = useRef(null)
  const headerRef = useRef(null)
  const inputRef = useRef(null)
  const closeButtonRef = useRef(null)
  const fileInputRef = useRef(null)
  const { handleProps, style: dragStyle } = useDraggable(modalRef, headerRef, isOpen)

  useEffect(() => {
    if (isOpen && project) {
      setName(project.name || '')
      setGenre(project.genre || '玄幻')
      setDescription(project.description || '')
      setCover(project.cover || '')
      setTargetWordCount(String(project.settings?.targetWordCount || 300000))
      setTargetChapterCount(String(project.settings?.targetChapterCount || 100))
    }
  }, [isOpen, project])

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

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const compressedCover = await compressCoverImage(file)
    setCover(compressedCover)
  }

  const handleEdit = () => {
    if (!name.trim() || !project) return

    onEdit({
      name: name.trim(),
      genre,
      cover,
      description: description.trim(),
      settings: {
        ...project.settings,
        targetWordCount: Math.max(1, Number(targetWordCount) || 300000),
        targetChapterCount: Math.max(1, Number(targetChapterCount) || 100)
      }
    })
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
          <h2 className="create-project-title">编辑作品</h2>
          <button ref={closeButtonRef} onClick={onClose} className="create-project-close" data-no-drag>
            <X size={20} />
          </button>
        </div>

        <div className="create-project-body">
          <div className="flex flex-col gap-10">
            <div className="create-project-top-row flex gap-10 items-start">
              <div className="flex-shrink-0">
                <label className="create-project-label">作品封面</label>
                <div className="cover-upload-container" onClick={() => fileInputRef.current?.click()}>
                  {cover ? (
                    <img src={cover} alt="封面预览" className="project-edit-cover-preview" />
                  ) : (
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
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
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

            <div className="create-project-grid">
              <div className="create-project-form-group">
                <label className="create-project-label">目标字数</label>
                <input
                  type="number"
                  min="1"
                  value={targetWordCount}
                  onChange={(e) => setTargetWordCount(e.target.value)}
                  className="create-project-input"
                  placeholder="请输入目标字数"
                />
              </div>

              <div className="create-project-form-group">
                <label className="create-project-label">目标章节数</label>
                <input
                  type="number"
                  min="1"
                  value={targetChapterCount}
                  onChange={(e) => setTargetChapterCount(e.target.value)}
                  className="create-project-input"
                  placeholder="请输入目标章节数"
                />
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
            onClick={handleEdit}
            disabled={!name.trim()}
            className="create-project-confirm"
          >
            保存修改
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  )
}

export default EditProjectModal
