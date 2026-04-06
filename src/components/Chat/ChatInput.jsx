import React, { useState, useRef, useEffect } from 'react'
import { Send, RotateCcw, Loader } from 'lucide-react'
import './ChatInput.css'

function ChatInput({ onSend, onRegenerate, isLoading, disabled, onFocus, onBlur }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (!input.trim() || isLoading) return

    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="chat-input-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="描述你想要的小说内容..."
            disabled={isLoading}
            className="chat-input-textarea"
            rows={1}
          />

          <div className="chat-input-actions">
            <div className="chat-input-tools">
              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  disabled={isLoading || disabled}
                  className="chat-input-btn btn-tech"
                  title={disabled ? '请先配置 AI 设置' : '重新生成'}
                >
                  <RotateCcw size={18} strokeWidth={1.5} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="chat-send-btn btn-tech"
              title={disabled ? '发送后会提示先配置 AI 设置' : '发送'}
            >
              {isLoading ? (
                <Loader size={18} strokeWidth={1.5} className="animate-spin" />
              ) : (
                <Send size={18} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChatInput
