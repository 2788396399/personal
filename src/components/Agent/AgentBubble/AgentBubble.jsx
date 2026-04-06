/* src/components/Agent/AgentBubble/AgentBubble.jsx */

import React, { useState } from 'react';
import { Bot, MessageCircle } from 'lucide-react';
import AgentDrawer from '../AgentDrawer/AgentDrawer';
import './AgentBubble.css';

/**
 * Global Agent Floating Bubble
 * 
 * Provides quick access to AI Agent on any page.
 */
const AgentBubble = ({ projectId, chapterId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`agent-bubble ${isOpen ? 'active' : ''}`} onClick={toggleDrawer}>
        <div className="agent-bubble-icon">
          {isOpen ? <MessageCircle size={24} /> : <Bot size={24} />}
        </div>
        <div className="agent-bubble-pulse"></div>
      </div>

      <AgentDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        projectId={projectId}
        chapterId={chapterId}
      />
    </>
  );
};

export default AgentBubble;
