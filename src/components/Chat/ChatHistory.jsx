import React from 'react'
import { MessageSquare, Clock, Trash2 } from 'lucide-react'
import './ChatHistory.css'

function ChatHistory({ conversations, currentConversationId, onSelect, onRequestDelete }) {
  const handleDelete = (e, conversation) => {
    e.stopPropagation()
    onRequestDelete?.(conversation)
  }

  if (conversations.length === 0) {
    return (
      <div className="chat-history">
        <div className="chat-history-empty">
          <MessageSquare size={36} strokeWidth={1} />
          <p>还没有历史对话</p>
          <span>开始新对话后，你可以在这里查看历史记录。</span>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-history">
      <div className="chat-history-list">
        {conversations.map((conv) => (
          <div key={conv.id} className="chat-history-item-wrapper">
            <button
              className={`chat-history-item ${conv.id === currentConversationId ? 'active' : ''}`}
              onClick={() => onSelect(conv)}
            >
              <div className="chat-history-item-icon">
                <MessageSquare size={16} />
              </div>
              <div className="chat-history-item-info">
                <div className="chat-history-item-title">
                  {conv.preview || '新对话'}
                </div>
                <div className="chat-history-item-meta">
                  <Clock size={11} />
                  <span>{formatTime(conv.updatedAt)}</span>
                  <span>·</span>
                  <span>{conv.messageCount || 0} 条消息</span>
                </div>
              </div>
            </button>
            <button
              className="chat-history-delete-btn"
              onClick={(e) => handleDelete(e, conv)}
              title="删除对话"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin} 分钟前`
  if (diffHr < 24) return `${diffHr} 小时前`
  if (diffDay < 7) return `${diffDay} 天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

export default ChatHistory
