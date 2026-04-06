/* src/components/Agent/AgentDrawer/AgentDrawer.jsx */

import React, { useState, useEffect, useCallback } from 'react';
import { X, Sparkles } from 'lucide-react';
import { createAIService } from '../../../services/ai/aiService';
import storageService from '../../../services/storageService';
import useSettingsStore from '../../../stores/settingsStore';
import useProjectStore from '../../../stores/projectStore';
import useChatStore from '../../../stores/chatStore';
import useOutlineStore from '../../../stores/outlineStore';
import useCharacterStore from '../../../stores/characterStore';
import usePlotStore from '../../../stores/plotStore';
import useKnowledgeStore from '../../../stores/knowledgeStore';
import AgentService from '../../../services/agent/AgentService';
import promptService from '../../../services/promptService';
import AgentConfirmModal from '../AgentConfirm/AgentConfirmModal';
import ChatContainer from '../../Chat/ChatContainer';
import ConfirmDialog from '../../common/ConfirmDialog';
import './AgentDrawer.css';

/**
 * Side Drawer for AI Agent
 * 
 * Provides a full-featured chat interface for project-wide Agent interaction.
 */
const AgentDrawer = ({ isOpen, onClose, projectId, chapterId: initialChapterId }) => {
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversationList, setConversationList] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [pendingActions, setPendingActions] = useState([]); // Queue of actions
  const [pendingDeleteConversation, setPendingDeleteConversation] = useState(null);

  const { aiConfig, aiPermissions = {}, chatFontSize, updateSettings, customModels } = useSettingsStore();
  const activeModel = customModels.find(m => m.id === aiConfig.activeModelId);
  const { messages, addMessage, clearMessages, loadMessages } = useChatStore();
  const { projects } = useProjectStore();
  const { outlines } = useOutlineStore();
  const { characters } = useCharacterStore();
  const { foreshadowing, conflicts } = usePlotStore();
  const { worldSettings, entities, summaries } = useKnowledgeStore();

  const loadConversationList = useCallback(async (pId) => {
    try {
      const conversations = await storageService.getConversations(pId);
      const list = conversations
        .map(conv => ({
          id: conv.id.startsWith(`${pId}-`) ? conv.id.substring(pId.length + 1) : conv.id,
          preview: conv.messages?.[0]?.content?.slice(0, 50) || '新对话',
          messageCount: conv.messages?.length || 0,
          updatedAt: conv.updatedAt
        }))
        .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

      setConversationList(list);
      return list;
    } catch (error) {
      console.error('Failed to load conversations:', error);
      return [];
    }
  }, []);

  const syncCurrentConversation = useCallback(async (pId, conversationId) => {
    try {
      if (!conversationId) {
        loadMessages([]);
        return;
      }

      const fullConv = await storageService.getConversation(pId, conversationId);
      if (fullConv) {
        loadMessages(fullConv.messages || []);
        return;
      }

      setCurrentConversationId(null);
      loadMessages([]);
    } catch (error) {
      console.error('Failed to load messages:', error);
      loadMessages([]);
    }
  }, [loadMessages]);

  useEffect(() => {
    if (isOpen && projectId) {
      // 切换项目或打开抽屉时，先清理当前对话状态，防止污染
      setCurrentConversationId(null);
      loadMessages([]);

      const initDrawerChat = async () => {
        const list = await loadConversationList(projectId);
        if (list && list.length > 0) {
          // 自动加载最近的一次对话
          setCurrentConversationId(list[0].id);
        }
      };

      initDrawerChat();
    }
  }, [isOpen, projectId, loadConversationList, loadMessages]);

  useEffect(() => {
    if (isOpen && projectId) {
      syncCurrentConversation(projectId, currentConversationId);
    }
  }, [isOpen, projectId, currentConversationId, syncCurrentConversation]);

  const handleSend = async (content) => {
    if (!content.trim() || isStreaming) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    };

    const conversationId = currentConversationId || assistantMessage.id;

    addMessage(userMessage);
    setIsStreaming(true);

    try {
      const aiService = createAIService(aiConfig, activeModel);
      let fullContent = '';

      const currentOutline = outlines.find(o => o.projectId === projectId);
      const projectCharacters = characters.filter(c => c.projectId === projectId);
      const projectConflicts = conflicts.filter(c => c.projectId === projectId && c.status === 'active');
      const projectForeshadowing = foreshadowing.filter(f => f.projectId === projectId && f.status === 'pending');
      const projectSummaries = summaries.filter(s => s.projectId === projectId);
      const projectWorldSettings = worldSettings.filter(s => s.projectId === projectId);
      const projectEntities = entities.filter(e => e.projectId === projectId);

      // Extract previous chapters content for context
      const project = projects.find(p => p.id === projectId);
      const currentChapter = project?.chapters?.find(c => c.id === initialChapterId);
      const currentChapterNum = currentChapter?.chapterNumber || 1;

      // Get chapters content based on permission
      const prevChapters = project?.chapters
        ?.filter(c => {
          if (aiPermissions.allowReadAllChapters) {
            return true; // Include ALL chapters in the project
          }
          return c.chapterNumber < currentChapterNum && c.chapterNumber >= currentChapterNum - 3;
        })
        .sort((a, b) => a.chapterNumber - b.chapterNumber)
        .map(c => ({
          chapterNumber: c.chapterNumber,
          title: c.title,
          content: c.content?.slice(0, 2000) // Limit content length per chapter
        })) || [];

      // Get last chapter tail (last 800 chars)
      const lastChapter = project?.chapters?.find(c => c.chapterNumber === currentChapterNum - 1);
      const prevChapterTail = lastChapter?.content ? lastChapter.content.slice(-800) : '';

      const systemPrompt = promptService.assembleContentPrompt({
        projectId,
        chapterId: initialChapterId,
        outline: currentOutline,
        characters: projectCharacters,
        plot: { activeConflicts: projectConflicts, pendingForeshadowing: projectForeshadowing },
        knowledge: { worldSettings: projectWorldSettings, entities: projectEntities },
        summaries: projectSummaries,
        previousChapters: prevChapters,
        previousChapterTail: prevChapterTail,
        instruction: '请作为一个专业的文学Agent提供创作建议。你可以使用标签来操作项目数据。'
      });

      const requestMessages = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      requestMessages.push({ role: 'user', content });

      for await (const chunk of aiService.streamChat(requestMessages, systemPrompt)) {
        fullContent += chunk;
        setStreamingContent(fullContent);
      }

      const finalAssistantMessage = { ...assistantMessage, content: fullContent };
      addMessage(finalAssistantMessage);

      // Detect Actions
      const actions = AgentService.detectActions(fullContent, projectId, initialChapterId);
      if (actions.length > 0) {
        const contentAction = actions.find(a => a.type === 'update_chapter');
        const otherActions = actions.filter(a => a.type !== 'update_chapter');

        if (contentAction) {
          await contentAction.execute();
        }

        if (otherActions.length > 0) {
          setPendingActions(otherActions);
        }
      }

      const updatedMessages = [...messages, userMessage, finalAssistantMessage];
      await storageService.saveConversation(projectId, {
        id: conversationId,
        messages: updatedMessages
      });

      if (!currentConversationId) {
        setCurrentConversationId(conversationId);
      }

      await loadConversationList(projectId);
    } catch (error) {
      console.error('Agent chat failed:', error);
      addMessage({
        role: 'assistant',
        content: `❌ 请求失败：${error.message}`
      });
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    clearMessages();
  };

  const handleConfirmDeleteConversation = async () => {
    if (!pendingDeleteConversation) return;
    try {
      await storageService.deleteConversation(projectId, pendingDeleteConversation.id);
      if (currentConversationId === pendingDeleteConversation.id) {
        handleNewConversation();
      }
      await loadConversationList(projectId);
      setPendingDeleteConversation(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <>
      <div className={`agent-drawer-overlay ${isOpen ? 'show' : ''}`}></div>
      <div className={`agent-drawer ${isOpen ? 'open' : ''}`}>
        <div className="agent-drawer-header">
          <div className="agent-drawer-title">
            <Sparkles size={18} className="sparkle-icon" />
            <span>AI 创作助手</span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="agent-drawer-body">
          <ChatContainer
            messages={messages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            onSend={handleSend}
            chatFontSize={chatFontSize}
            onChatFontSizeChange={(size) => updateSettings({ chatFontSize: size })}
            onNewConversation={handleNewConversation}
            onLoadConversation={(conv) => setCurrentConversationId(conv.id)}
            onDeleteConversation={(conv) => setPendingDeleteConversation(conv)}
            conversations={conversationList}
            currentConversationId={currentConversationId}
          />
        </div>
      </div>

      <AgentConfirmModal
        isOpen={pendingActions.length > 0}
        onClose={() => setPendingActions([])}
        onConfirm={async (action, silent = false) => {
          await action.execute();
          if (!silent) {
            // If not in silent mode (single confirm), remove the specific action
            setPendingActions(prev => prev.filter(a => a !== action));
          }
        }}
        actions={pendingActions}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDeleteConversation)}
        title="删除对话"
        message="确定要删除这段对话吗？"
        confirmLabel="删除"
        onClose={() => setPendingDeleteConversation(null)}
        onConfirm={handleConfirmDeleteConversation}
      />
    </>
  );
};

export default AgentDrawer;
