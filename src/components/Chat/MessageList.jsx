import React, { useRef, useEffect } from 'react'
import MessageItem from './MessageItem'
import TypingIndicator from './TypingIndicator'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Bot } from 'lucide-react'
import './MessageList.css'

function MessageList({ messages, isStreaming, streamingContent, isInitialState, onApplyContent, chatFontSize }) {
  const listRef = useRef(null)
  const bottomRef = useRef(null)
  const shouldScrollRef = useRef(true)

  // Handle scroll detection
  const handleScroll = () => {
    if (!listRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
    shouldScrollRef.current = isAtBottom
  }

  // Effect for messages change
  useEffect(() => {
    if (shouldScrollRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Effect for streaming content change - more frequent, maybe avoid smooth behavior
  useEffect(() => {
    if (isStreaming && shouldScrollRef.current && bottomRef.current) {
      // Use auto behavior for streaming to keep it responsive
      bottomRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [streamingContent, isStreaming])

  const fontStyle = chatFontSize ? { '--chat-font-size': `${chatFontSize}px` } : {}

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className={`message-list-empty ${isInitialState ? 'is-initial' : ''}`} />
    )
  }

  return (
    <div 
      ref={listRef} 
      className="message-list" 
      style={fontStyle}
      onScroll={handleScroll}
    >
      <div className="message-list-content">
        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message} 
            onApplyContent={onApplyContent} 
          />
        ))}

        {isStreaming && streamingContent && (
          <StreamingMessage content={streamingContent} />
        )}

        {isStreaming && !streamingContent && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function StreamingMessage({ content }) {
  return (
    <div className="message-item assistant message-animate">
      <div className="message-avatar assistant">
        <Bot size={20} />
      </div>
      <div className="message-content">
        <div className="message-panel assistant">
          <div className="message-text streaming-text">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p>
                    {children}
                    {/* The caret is handled separately to avoid duplication in multiple paragraphs */}
                  </p>
                )
              }}
            >
              {content}
            </ReactMarkdown>
            <span className="streaming-caret" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageList
