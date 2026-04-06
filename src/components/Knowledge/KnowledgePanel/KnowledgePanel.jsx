/* src/components/Knowledge/KnowledgePanel/KnowledgePanel.jsx */
import React, { useState } from 'react';
import useKnowledge from '../../../hooks/useKnowledge';
import EntityCard from '../EntityCard/EntityCard';
import WorldSettingCard from '../WorldSettingCard/WorldSettingCard';
import EntityEditor from '../EntityEditor/EntityEditor';
import WorldSettingEditor from '../WorldSettingEditor/WorldSettingEditor';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import Tag from '../../common/Tag/Tag';
import ConfirmDialog from '../../common/ConfirmDialog';
import { knowledgeService } from '../../../services/knowledgeService';
import './KnowledgePanel.css';

const KnowledgePanel = ({ projectId, chapterId, chapterContent, chapterNumber }) => {
  const knowledge = useKnowledge(projectId);
  const { 
    worldSettings, 
    entities, 
    summaries, 
    saveWorldSetting, 
    saveEntity,
    addChapterSummary
  } = knowledge;

  const [activeTab, setActiveTab] = useState('entities'); // entities, settings, summaries
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleGenerateSummary = async () => {
    if (!chapterContent) return;
    setIsGenerating(true);
    try {
      const summary = await knowledgeService.generateChapterSummary(chapterContent);
      addChapterSummary({
        chapterId,
        chapterNumber,
        oneLine: summary.oneLineSummary,
        detailed: summary.detailedSummary,
        keyEvents: summary.keyEvents
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (item) => {
    console.log('Editing item:', item);
    setEditingItem(item);
    // 自动根据 ID 前缀判断该打开哪个编辑器
    if (item.id.startsWith('setting-')) {
      setActiveTab('settings');
    } else if (item.id.startsWith('entity-')) {
      setActiveTab('entities');
    }
    setIsEditorOpen(true);
  };

  const handleSave = (data) => {
    // 优先根据 editingItem 的 ID 前缀来决定保存逻辑
    if (editingItem?.id?.startsWith('setting-')) {
      saveWorldSetting({ ...data, id: editingItem.id });
    } else if (editingItem?.id?.startsWith('entity-')) {
      saveEntity({ ...data, id: editingItem.id });
    } else {
      // 如果是新增，根据当前 activeTab 决定
      if (activeTab === 'settings') {
        saveWorldSetting(data);
      } else {
        saveEntity(data);
      }
    }
    setIsEditorOpen(false);
  };

  const handleDelete = (id) => {
    console.log('Deleting id:', id);
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    
    if (pendingDeleteId.startsWith('setting-')) {
      knowledge.deleteWorldSetting(pendingDeleteId);
    } else if (pendingDeleteId.startsWith('entity-')) {
      knowledge.deleteEntity(pendingDeleteId);
    } else {
      // 后备逻辑：根据当前 tab 删除
      if (activeTab === 'settings') knowledge.deleteWorldSetting(pendingDeleteId);
      else knowledge.deleteEntity(pendingDeleteId);
    }
    
    setIsConfirmOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <div className="knowledge-panel">
      <div className="knowledge-panel-header">
        <h3 className="knowledge-panel-title">知识库</h3>
        <div className="knowledge-tabs">
          <Button 
            variant={activeTab === 'entities' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('entities')}
          >
            实体 ({entities.length})
          </Button>
          <Button 
            variant={activeTab === 'settings' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('settings')}
          >
            设定 ({worldSettings.length})
          </Button>
          <Button 
            variant={activeTab === 'summaries' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('summaries')}
          >
            摘要 ({summaries.length})
          </Button>
        </div>
      </div>

      <div className="knowledge-section">
        <div className="knowledge-section-header">
          <h4 className="knowledge-section-title">
            {activeTab === 'entities' ? '地点与物品' : activeTab === 'settings' ? '世界观设定' : '章节历史摘要'}
          </h4>
          {activeTab === 'summaries' ? (
            <Button variant="outline" size="sm" onClick={handleGenerateSummary} disabled={isGenerating || !chapterContent}>
              {isGenerating ? '生成中...' : '🤖 生成本章摘要'}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleAdd}>
              ＋ 添加
            </Button>
          )}
        </div>

        <div className="knowledge-list">
          {activeTab === 'entities' ? (
            entities.length > 0 ? (
              entities.map(e => (
                <EntityCard 
                  key={e.id} 
                  entity={e} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="knowledge-empty">还没有记录任何实体。</div>
            )
          ) : activeTab === 'settings' ? (
            worldSettings.length > 0 ? (
              worldSettings.map(s => (
                <WorldSettingCard 
                  key={s.id} 
                  setting={s} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="knowledge-empty">还没有记录任何世界设定。</div>
            )
          ) : (
            summaries.length > 0 ? (
              summaries.map(s => (
                <div key={s.id} className="setting-card summary-card">
                  <div className="setting-header">
                    <h4 className="setting-title">第 {s.chapterNumber} 章：{s.oneLine || '无标题'}</h4>
                    <Tag color="ghost" size="sm">Summary</Tag>
                  </div>
                  <div className="setting-content">
                    {s.detailed || s.oneLine}
                  </div>
                  {s.keyEvents && s.keyEvents.length > 0 && (
                    <div className="summary-events">
                      <span className="appearance-label">关键事件:</span>
                      <ul className="event-list">
                        {s.keyEvents.slice(0, 3).map((event, idx) => (
                          <li key={idx}>{event}</li>
                        ))}
                        {s.keyEvents.length > 3 && <li>...等 {s.keyEvents.length} 个事件</li>}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="knowledge-empty">还没有生成章节摘要。</div>
            )
          )}
        </div>
      </div>

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        closeOnOverlayClick={false}
        title={editingItem ? `编辑${activeTab === 'settings' ? '设定' : '实体'}` : `添加${activeTab === 'settings' ? '设定' : '实体'}`}
        size="md"
      >
        {activeTab === 'settings' ? (
          <WorldSettingEditor 
            setting={editingItem}
            onSave={handleSave}
            onCancel={() => setIsEditorOpen(false)}
          />
        ) : (
          <EntityEditor 
            entity={editingItem}
            onSave={handleSave}
            onCancel={() => setIsEditorOpen(false)}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="确认删除"
        message="确定要删除这一项吗？删除后将无法恢复。"
        confirmLabel="确认删除"
        onConfirm={handleConfirmDelete}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default KnowledgePanel;
