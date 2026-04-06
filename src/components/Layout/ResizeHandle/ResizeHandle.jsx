import { useRef, useCallback, useEffect } from 'react'
import './ResizeHandle.css'

const ResizeHandle = ({ onResize, direction = 'vertical', reverse = false }) => {
  const isDragging = useRef(false)
  const startPos = useRef(0)
  const startSize = useRef(0)

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    isDragging.current = true
    startPos.current = direction === 'vertical' ? e.clientX : e.clientY
    startSize.current = onResize(0, true)

    document.body.style.cursor = direction === 'vertical' ? 'col-resize' : 'row-resize'
    document.body.style.userSelect = 'none'
    document.body.classList.add('resizing')
  }, [onResize, direction])

  useEffect(() => {
    const resetBodyState = () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.body.classList.remove('resizing')
    }

    const handleMouseMove = (e) => {
      if (!isDragging.current) return

      const currentPos = direction === 'vertical' ? e.clientX : e.clientY
      let delta = currentPos - startPos.current

      // 对于右侧面板，反转delta方向
      if (reverse) {
        delta = -delta
      }

      onResize(startSize.current + delta, false)
    }

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false
        resetBodyState()
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      isDragging.current = false
      resetBodyState()
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onResize, direction, reverse])

  return (
    <div className={`resize-handle resize-handle-${direction}`} onMouseDown={handleMouseDown} />
  )
}

export default ResizeHandle
