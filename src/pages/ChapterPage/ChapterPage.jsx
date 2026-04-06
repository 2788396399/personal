/* src/pages/ChapterPage/ChapterPage.jsx */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProjectStore from '../../stores/projectStore';
import useChatStore from '../../stores/chatStore';
import useSettingsStore from '../../stores/settingsStore';
import { createAIService } from '../../services/ai/aiService';
import storageService from '../../services/storageService';

import Header from '../../components/Layout/Header/Header';
import Navigation from '../../components/Layout/Navigation/Navigation';
import ResizeHandle from '../../components/Layout/ResizeHandle/ResizeHandle';
import ChatContainer from '../../components/Chat/ChatContainer';
import ChapterEditor from '../../components/Editor/ChapterEditor';
import CharacterPanel from '../../components/Character/CharacterPanel/CharacterPanel';
import OutlinePanel from '../../components/Outline/OutlinePanel/OutlinePanel';
import PlotPanel from '../../components/Plot/PlotPanel/PlotPanel';
import KnowledgePanel from '../../components/Knowledge/KnowledgePanel/KnowledgePanel';
import LogPanel from '../../components/Log/LogPanel/LogPanel';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import CharacterExtractModal from '../../components/Character/CharacterExtractModal/CharacterExtractModal';
import AIConfirmModal from '../../components/AIPermission/AIConfirmModal/AIConfirmModal';
import AgentConfirmModal from '../../components/Agent/AgentConfirm/AgentConfirmModal';
import plotDetectService from '../../services/plotDetectService';
import knowledgeService from '../../services/knowledgeService';
import AgentService from '../../services/agent/AgentService';
import usePlot from '../../hooks/usePlot';
import useCharacter from '../../hooks/useCharacter';
import useKnowledge from '../../hooks/useKnowledge';
import promptService from '../../services/promptService';
import useOutline from '../../hooks/useOutline';
import useAILogStore from '../../stores/aiLogStore';
import './ChapterPage.css';

const ChapterPage = () => {
  const { id: projectId, chapterId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [activeTab, setActiveTab] = useState('editor');
  const [chatWidth, setChatWidth] = useState(400);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversationList, setConversationList] = useState([]);
  const [pendingDeleteConversation, setPendingDeleteConversation] = useState(null);

  // Editor states
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  // AI Suggestion States
  const [characterExtraction, setCharacterExtraction] = useState(null);
  const [plotExtraction, setPlotExtraction] = useState(null);
  const [knowledgeExtraction, setKnowledgeExtraction] = useState(null);
  const [pendingAgentActions, setPendingAgentActions] = useState([]);

  const { projects, updateChapter } = useProjectStore();
  const { messages, addMessage, updateMessage, clearMessages, loadMessages } = useChatStore();
  const { aiConfig, aiPermissions = {}, chatFontSize, updateSettings, customModels } = useSettingsStore();
  const activeModel = customModels.find(m => m.id === aiConfig.activeModelId);
  const { pendingForeshadowing, activeConflicts, addForeshadowing, revealForeshadowing } = usePlot(projectId);
  const { characters, confirmExtraction } = useCharacter(projectId);
  const { worldSettings, entities, saveEntity, saveWorldSetting, summaries } = useKnowledge(projectId);
  const { chapters: allChapterOutlines } = useOutline(projectId);
  const { addLog } = useAILogStore();

  const project = projects.find(p => p.id === projectId);
  const chapter = project?.chapters?.find(c => c.id === chapterId);
  const chapterIndex = project?.chapters?.findIndex(c => c.id === chapterId);

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

  // Initialize
  useEffect(() => {
    if (!project || !chapter) {
      navigate(project ? `/project/${projectId}` : '/');
      return;
    }

    // 切换项目或章节时，先清理当前对话状态，防止污染
    setCurrentConversationId(null);
    loadMessages([]);

    const initChat = async () => {
      const list = await loadConversationList(projectId);
      if (list && list.length > 0) {
        // 自动加载最近的一次对话
        setCurrentConversationId(list[0].id);
      }
    };

    initChat();
  }, [projectId, chapterId, navigate, loadConversationList, loadMessages]);

  useEffect(() => {
    if (!project || !chapter) {
      return;
    }

    syncCurrentConversation(projectId, currentConversationId);
  }, [projectId, currentConversationId, syncCurrentConversation]);

  // AI Chat Handlers (Migrated from App.jsx)
  const buildSystemPrompt = useCallback(() => {
    const currentChapterNum = chapterIndex + 1;
    const currentOutline = allChapterOutlines.find(o => o.chapterNumber === currentChapterNum);

    // Extract chapters content for context
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
        content: c.content?.slice(0, 2000)
      })) || [];

    // Get last chapter tail (last 800 chars)
    const lastChapter = project?.chapters?.find(c => c.chapterNumber === currentChapterNum - 1);
    const prevChapterTail = lastChapter?.content ? lastChapter.content.slice(-800) : '';

    return promptService.assembleContentPrompt({
      projectId,
      chapterId,
      outline: currentOutline,
      characters: characters,
      plot: { activeConflicts, pendingForeshadowing },
      knowledge: { worldSettings, entities },
      summaries: summaries,
      previousChapters: prevChapters,
      previousChapterTail: prevChapterTail,
      instruction: '请作为一个专业的长篇小说作家进行创作。你可以使用标签来更新大纲、角色或正文。'
    });
  }, [projectId, chapterId, characters, activeConflicts, pendingForeshadowing, summaries, allChapterOutlines, chapterIndex, project, worldSettings, entities, aiPermissions.allowReadAllChapters]);

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
    // Don't add assistant message until it's finished to avoid duplicate display
    setIsStreaming(true);

    try {
      const aiService = createAIService(aiConfig, activeModel);
      let fullContent = '';

      const requestMessages = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      requestMessages.push({ role: 'user', content });

      for await (const chunk of aiService.streamChat(requestMessages, buildSystemPrompt())) {
        fullContent += chunk;
        setStreamingContent(fullContent);
      }

      // Add final assistant message to store
      const finalAssistantMessage = { ...assistantMessage, content: fullContent };
      addMessage(finalAssistantMessage);

      // --- Unified Agent Action Detection ---
      const actions = AgentService.detectActions(fullContent, projectId, chapterId);

      if (actions.length > 0) {
        // 1. Direct write for chapter content
        const contentAction = actions.find(a => a.type === 'update_chapter');
        if (contentAction) {
          await contentAction.execute();
          addLog({
            projectId,
            operationType: 'content',
            operationName: 'AI 生成正文',
            details: `第 ${chapterIndex + 1} 章内容已由 AI 更新`,
            userConfirmed: true
          });
          triggerAIAnalysis(contentAction.data);
        }

        // 2. Queue other structural actions for confirmation
        const otherActions = actions.filter(a => a.type !== 'update_chapter');
        if (otherActions.length > 0) {
          setPendingAgentActions(otherActions);
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
      console.error('AI request failed:', error);
      addMessage({
        role: 'assistant',
        content: `❌ 请求失败：${error.message}`
      });
      const updatedMessages = [...messages, userMessage];
      await storageService.saveConversation(projectId, {
        id: conversationId,
        messages: updatedMessages
      });

      if (!currentConversationId) {
        setCurrentConversationId(conversationId);
      }

      await loadConversationList(projectId);
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const triggerAIAnalysis = async (content) => {
    const plotData = await plotDetectService.detectForeshadowing(content, pendingForeshadowing);
    if (plotData.newForeshadowing?.length > 0 || plotData.reveals?.length > 0) {
      setPlotExtraction(plotData);
    }

    const knowledgeData = await knowledgeService.extractKnowledge(content);
    if (knowledgeData.entities?.length > 0 || knowledgeData.settings?.length > 0) {
      setKnowledgeExtraction(knowledgeData);
    }
  };

  const handleConfirmPlot = (data) => {
    data.newForeshadowing?.forEach(f => addForeshadowing({ ...f, plantChapter: chapterIndex + 1 }));
    data.reveals?.forEach(r => revealForeshadowing(r.id, chapterIndex + 1));

    addLog({
      projectId,
      operationType: 'plot',
      operationName: '确认情节变更',
      details: `同步了 ${data.newForeshadowing?.length || 0} 个伏笔和 ${data.reveals?.length || 0} 个揭示`,
      userConfirmed: true
    });

    setPlotExtraction(null);
  };

  const handleConfirmKnowledge = (data) => {
    data.entities?.forEach(e => saveEntity(e));
    data.settings?.forEach(s => saveWorldSetting(s));

    addLog({
      projectId,
      operationType: 'knowledge',
      operationName: '确认知识提取',
      details: `同步了 ${data.entities?.length || 0} 个实体和 ${data.settings?.length || 0} 个设定`,
      userConfirmed: true
    });

    setKnowledgeExtraction(null);
  };

  // Editor Handlers
  const handleEdit = () => {
    setEditContent(chapter.content || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    updateChapter(projectId, chapterId, { content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChatResize = useCallback((newWidth) => {
    const clampedWidth = Math.max(300, Math.min(600, newWidth));
    setChatWidth(clampedWidth);
    return clampedWidth;
  }, []);

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    clearMessages();
  };

  const handleLoadConversation = (conv) => {
    setCurrentConversationId(conv.id);
  };

  const handleRequestDeleteConversation = (conv) => {
    setPendingDeleteConversation(conv);
  };

  const handleConfirmDeleteConversation = async () => {
    if (!pendingDeleteConversation) return;

    try {
      await storageService.deleteConversation(projectId, pendingDeleteConversation.id);

      if (currentConversationId === pendingDeleteConversation.id) {
        setCurrentConversationId(null);
        clearMessages();
      }

      await loadConversationList(projectId);
      setPendingDeleteConversation(null);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  if (!project || !chapter) return null;

  return (
    <div className="chapter-page">
      <Header title={`${project.name} / ${chapter.title}`} showBack />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="chapter-page-content" ref={containerRef}>
        <div className="chapter-page-main">
          <div className="chapter-page-view">
            {activeTab === 'editor' && (
              <ChapterEditor
                project={project}
                chapter={chapter}
                chapterIndex={chapterIndex}
                isEditing={isEditing}
                editContent={editContent}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onContentChange={setEditContent}
              />
            )}
            {activeTab === 'characters' && (
              <CharacterPanel projectId={projectId} />
            )}
            {activeTab === 'outline' && (
              <OutlinePanel projectId={projectId} />
            )}
            {activeTab === 'plot' && (
              <PlotPanel projectId={projectId} currentChapterNumber={chapterIndex + 1} />
            )}
            {activeTab === 'knowledge' && (
              <KnowledgePanel
                projectId={projectId}
                chapterId={chapterId}
                chapterContent={chapter.content}
                chapterNumber={chapterIndex + 1}
              />
            )}
            {activeTab === 'logs' && (
              <LogPanel projectId={projectId} />
            )}
          </div>

          <div className="chapter-page-footer">
            <span>第 {chapterIndex + 1} 章 · {chapter.content?.length || 0} 字</span>
            <span>{chapter.status === 'completed' ? '已完成' : '进行中'}</span>
          </div>
        </div>

        <ResizeHandle onResize={handleChatResize} direction="vertical" reverse={true} />

        <div className="chapter-page-sidebar" style={{ width: chatWidth }}>
          <ChatContainer
            messages={messages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            onSend={handleSend}
            chatFontSize={chatFontSize}
            onChatFontSizeChange={(size) => updateSettings({ chatFontSize: size })}
            onNewConversation={handleNewConversation}
            onLoadConversation={handleLoadConversation}
            onDeleteConversation={handleRequestDeleteConversation}
            conversations={conversationList}
            currentConversationId={currentConversationId}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(pendingDeleteConversation)}
        title="删除对话"
        message={pendingDeleteConversation ? `确定要删除这段对话吗？` : ''}
        confirmLabel="删除"
        onClose={() => setPendingDeleteConversation(null)}
        onConfirm={handleConfirmDeleteConversation}
      />

      {/* AI Suggestion Modals */}
      <CharacterExtractModal
        isOpen={!!characterExtraction}
        onClose={() => setCharacterExtraction(null)}
        extractionData={characterExtraction}
        onConfirm={(data) => {
          confirmExtraction(data);
          addLog({
            projectId,
            operationType: 'character',
            operationName: '确认角色提取',
            details: `发现了 ${data.newCharacters?.length || 0} 个新角色`,
            userConfirmed: true
          });
        }}
      />

      <AIConfirmModal
        isOpen={!!plotExtraction}
        onClose={() => setPlotExtraction(null)}
        title="AI 情节分析建议"
        message="AI 检测到当前内容涉及伏笔埋设或揭示，是否同步到情节追踪系统？"
        diff={plotExtraction ? {
          field: '发现伏笔/揭示',
          new: `${plotExtraction.newForeshadowing?.length || 0} 个新伏笔, ${plotExtraction.reveals?.length || 0} 个伏笔揭示`
        } : null}
        onConfirm={() => handleConfirmPlot(plotExtraction)}
      />

      <AIConfirmModal
        isOpen={!!knowledgeExtraction}
        onClose={() => setKnowledgeExtraction(null)}
        title="AI 知识库提取建议"
        message="AI 发现了新的实体或设定，是否同步到知识库？"
        diff={knowledgeExtraction ? {
          field: '发现知识/设定',
          new: `${knowledgeExtraction.entities?.length || 0} 个新实体, ${knowledgeExtraction.settings?.length || 0} 个新设定`
        } : null}
        onConfirm={() => handleConfirmKnowledge(knowledgeExtraction)}
      />

      <AgentConfirmModal
        isOpen={pendingAgentActions.length > 0}
        onClose={() => setPendingAgentActions([])}
        onConfirm={async (action, silent = false) => {
          await action.execute();
          addLog({
            projectId,
            operationType: 'agent',
            operationName: action.label,
            details: `Agent 已根据建议更新项目数据`,
            userConfirmed: true
          });
          if (!silent) {
            setPendingAgentActions(prev => prev.filter(a => a !== action));
          }
        }}
        actions={pendingAgentActions}
      />
    </div>
  );
};

export default ChapterPage;
