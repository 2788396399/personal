import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { User, Bot, Copy, Check, FilePlus } from 'lucide-react'
import './MessageItem.css'

function MessageItem({ message, onApplyContent }) {
  const [copied, setCopied] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleApply = () => {
    if (onApplyContent && message.content) {
      onApplyContent(message.content)
      setApplied(true)
      setTimeout(() => setApplied(false), 2000)
    }
  }

  return (
    <div className={`message-item message-animate message-enter ${message.role}`}>
      <div className={`message-avatar ${message.role}`}>
        {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
      </div>

      <div className="message-content">
        <div className={`message-panel ${message.role} ${message.role === 'user' ? 'card' : ''}`}>
          {message.role === 'user' ? (
            <div className="message-text">{message.content}</div>
          ) : (
            <div className="message-text prose-novel">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div className="message-meta">
          <span className="message-time">
            {new Date(message.timestamp).toLocaleTimeString('zh-CN')}
          </span>
          {message.role === 'assistant' && (
            <div className="message-actions">
              <button onClick={handleApply} className="message-action-btn" title="将内容追加到正文末尾">
                {applied ? <Check size={12} /> : <FilePlus size={12} />}
                {applied ? '已写入' : '写入正文'}
              </button>
              <button onClick={handleCopy} className="message-action-btn">
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? '已复制' : '复制'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageItem
