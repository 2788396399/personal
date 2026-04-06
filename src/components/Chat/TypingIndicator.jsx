import React from 'react'
import './TypingIndicator.css'

import { Bot } from 'lucide-react'

function TypingIndicator() {
  return (
    <div className="message-item assistant message-animate">
      <div className="message-avatar assistant">
        <Bot size={20} />
      </div>
      <div className="message-content">
        <div className="message-panel assistant">
          <div className="typing-indicator-content">
            <div className="typing-indicator-dots">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
            <span className="typing-indicator-text">AI 正在思考...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
