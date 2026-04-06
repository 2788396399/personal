/* src/components/Plot/PlotPanel/PlotPanel.jsx */
import React, { useState } from 'react';
import usePlot from '../../../hooks/usePlot';
import ForeshadowingCard from '../ForeshadowingCard/ForeshadowingCard';
import ConflictCard from '../ConflictCard/ConflictCard';
import ForeshadowingEditor from '../ForeshadowingEditor/ForeshadowingEditor';
import ConflictEditor from '../ConflictEditor/ConflictEditor';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import './PlotPanel.css';

const PlotPanel = ({ projectId, currentChapterNumber = 1 }) => {
  const { 
    foreshadowing, 
    conflicts, 
    addForeshadowing, 
    addConflict, 
    updateForeshadowing,
    updateConflict,
    deleteForeshadowing,
    deleteConflict,
    revealForeshadowing, 
    resolveConflict,
    stats
  } = usePlot(projectId);

  const [activeTab, setActiveTab] = useState('foreshadowing'); // foreshadowing, conflicts
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAdd = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const handleSave = (data) => {
    if (activeTab === 'foreshadowing') {
      if (editingItem) {
        updateForeshadowing(editingItem.id, data);
      } else {
        addForeshadowing(data);
      }
    } else {
      if (editingItem) {
        updateConflict(editingItem.id, data);
      } else {
        addConflict(data);
      }
    }
    setIsEditorOpen(false);
  };

  const handleDelete = (id) => {
    const type = activeTab === 'foreshadowing' ? '伏笔' : '冲突';
    if (window.confirm(`确定要删除这个${type}吗？`)) {
      if (activeTab === 'foreshadowing') {
        deleteForeshadowing(id);
      } else {
        deleteConflict(id);
      }
    }
  };

  return (
    <div className="plot-panel">
      <div className="plot-panel-header">
        <h3 className="plot-panel-title">情节追踪</h3>
        <div className="plot-panel-tabs">
          <Button 
            variant={activeTab === 'foreshadowing' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('foreshadowing')}
          >
            伏笔 ({stats.totalForeshadowing})
          </Button>
          <Button 
            variant={activeTab === 'conflicts' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('conflicts')}
          >
            冲突 ({stats.totalConflicts})
          </Button>
        </div>
      </div>

      <div className="plot-section">
        <div className="plot-section-header">
          <h4 className="plot-section-title">
            {activeTab === 'foreshadowing' ? '伏笔/线索列表' : '矛盾/冲突列表'}
          </h4>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            ＋ 添加{activeTab === 'foreshadowing' ? '伏笔' : '冲突'}
          </Button>
        </div>

        <div className="plot-list">
          {activeTab === 'foreshadowing' ? (
            foreshadowing.length > 0 ? (
              foreshadowing.map(item => (
                <ForeshadowingCard 
                  key={item.id} 
                  item={item} 
                  onReveal={(id) => revealForeshadowing(id, currentChapterNumber)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="plot-empty">
                还没有记录任何伏笔。在写作时通过 AI 自动识别并添加。
              </div>
            )
          ) : (
            conflicts.length > 0 ? (
              conflicts.map(item => (
                <ConflictCard 
                  key={item.id} 
                  item={item} 
                  onResolve={(id) => resolveConflict(id, currentChapterNumber, '已解决')}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="plot-empty">
                还没有记录任何冲突。在写作时通过 AI 自动识别并添加。
              </div>
            )
          )}
        </div>
      </div>

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        closeOnOverlayClick={false}
        title={editingItem ? `编辑${activeTab === 'foreshadowing' ? '伏笔' : '冲突'}` : `添加${activeTab === 'foreshadowing' ? '伏笔' : '冲突'}`}
        size="md"
      >
        {activeTab === 'foreshadowing' ? (
          <ForeshadowingEditor 
            item={editingItem}
            onSave={handleSave}
            onCancel={() => setIsEditorOpen(false)}
          />
        ) : (
          <ConflictEditor 
            item={editingItem}
            onSave={handleSave}
            onCancel={() => setIsEditorOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default PlotPanel;
