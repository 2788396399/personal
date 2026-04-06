import React, { useState } from 'react'
import { Plus, History, Minus, Type } from 'lucide-react'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory'
import './ChatContainer.css'

function ChatContainer({
  messages,
  isStreaming,
  streamingContent,
  onSend,
  onRegenerate,
  onApplyContent,
  onNewConversation,
  onLoadConversation,
  onDeleteConversation,
  conversations,
  currentConversationId,
  disabled,
  chatFontSize,
  onChatFontSizeChange
}) {
  const [isInputFocused, setIsInputFocused] = React.useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const isInitialState = messages.length === 0 && !isStreaming

  const handleFontIncrease = () => {
    const next = Math.min((chatFontSize || 14) + 1, 22)
    onChatFontSizeChange?.(next)
  }

  const handleFontDecrease = () => {
    const next = Math.max((chatFontSize || 14) - 1, 10)
    onChatFontSizeChange?.(next)
  }

  return (
    <div className={`chat-container ${isInitialState ? 'initial' : 'active'}`}>
      <div className="chat-toolbar">
        <div className="chat-toolbar-left">
          <button
            className="chat-toolbar-btn"
            onClick={onNewConversation}
            title="开启新对话"
          >
            <Plus size={15} />
            <span>新对话</span>
          </button>
          <button
            className={`chat-toolbar-btn ${showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(!showHistory)}
            title="历史对话"
          >
            <History size={15} />
            <span>历史</span>
          </button>
        </div>
        <div className="chat-toolbar-right">
          <div className="chat-font-control">
            <Type size={13} />
            <button className="chat-font-btn" onClick={handleFontDecrease} title="缩小字体">
              <Minus size={12} />
            </button>
            <span className="chat-font-value">{chatFontSize || 14}</span>
            <button className="chat-font-btn" onClick={handleFontIncrease} title="放大字体">
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>

      {showHistory ? (
        <ChatHistory
          conversations={conversations || []}
          currentConversationId={currentConversationId}
          onSelect={(conv) => {
            onLoadConversation?.(conv)
            setShowHistory(false)
          }}
          onRequestDelete={onDeleteConversation}
          onClose={() => setShowHistory(false)}
        />
      ) : (
        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          isInitialState={isInitialState}
          onApplyContent={onApplyContent}
          chatFontSize={chatFontSize}
        />
      )}

      <div className={`chat-bottom-area ${isInputFocused ? 'focused' : ''}`}>
        <ChatInput
          onSend={onSend}
          onRegenerate={onRegenerate}
          isLoading={isStreaming}
          disabled={disabled}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
      </div>
    </div>
  )
}

export default ChatContainer
