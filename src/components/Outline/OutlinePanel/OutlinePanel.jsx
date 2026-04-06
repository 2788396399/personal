/* src/components/Outline/OutlinePanel/OutlinePanel.jsx */
import React, { useState } from 'react';
import useOutline from '../../../hooks/useOutline';
import OutlineNode from '../OutlineNode/OutlineNode';
import ChapterOutlineEditor from '../ChapterOutlineEditor/ChapterOutlineEditor';
import BookOutlineEditor from '../BookOutlineEditor/BookOutlineEditor';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import ConfirmDialog from '../../common/ConfirmDialog';
import './OutlinePanel.css';

const OutlinePanel = ({ projectId }) => {
  const { 
    bookOutline, 
    chapters, 
    addChapterOutline, 
    initOutline, 
    updateBookOutline, 
    updateChapterOutline, 
    deleteChapterOutline 
  } = useOutline(projectId);

  const [isBookInfoExpanded, setIsBookInfoExpanded] = useState(true);
  const [isChapterEditorOpen, setIsChapterEditorOpen] = useState(false);
  const [isBookEditorOpen, setIsBookEditorOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleInitOutline = () => {
    initOutline({
      title: '新作品大纲',
      synopsis: '点击编辑按钮完善您的故事梗概。',
      genre: '',
      theme: ''
    });
  };

  const handleEditBookOutline = () => {
    setIsBookEditorOpen(true);
  };

  const handleSaveBookOutline = (data) => {
    updateBookOutline(data);
    setIsBookEditorOpen(false);
  };

  const handleAddChapter = () => {
    setEditingChapter(null);
    setIsChapterEditorOpen(true);
  };

  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter);
    setIsChapterEditorOpen(true);
  };

  const handleSaveChapter = (chapterData) => {
    if (editingChapter) {
      updateChapterOutline(editingChapter.id, chapterData);
    } else {
      addChapterOutline({
        ...chapterData,
        chapterNumber: chapters.length + 1
      });
    }
    setIsChapterEditorOpen(false);
  };

  const handleDeleteChapter = (id) => {
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      deleteChapterOutline(pendingDeleteId);
      setIsConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="outline-panel">
      <div className="outline-panel-header">
        <h3 className="outline-panel-title">作品大纲</h3>
        {bookOutline && (
          <Button variant="primary" size="sm" onClick={handleAddChapter}>
            ＋ 添加章节
          </Button>
        )}
      </div>

      {bookOutline ? (
        <>
          <div className="outline-book-info">
            <div className="outline-book-info-header">
              <div className="outline-book-info-title-area" onClick={() => setIsBookInfoExpanded(!isBookInfoExpanded)}>
                <h4 className="outline-book-title">{bookOutline.title || '全书梗概'}</h4>
                <span className="expand-icon">{isBookInfoExpanded ? '▲' : '▼'}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleEditBookOutline}>编辑详情</Button>
            </div>
            {isBookInfoExpanded && (
              <>
                <p className="outline-book-synopsis">
                  {bookOutline.synopsis || '暂无故事梗概。好的大纲是创作的一半。'}
                </p>
                <div className="outline-node-tags">
                  {bookOutline.genre && <span className="outline-node-number">{bookOutline.genre}</span>}
                  {bookOutline.theme && <span className="outline-node-number">{bookOutline.theme}</span>}
                  {bookOutline.estimatedWordCount > 0 && (
                    <span className="outline-node-number">预计 {Math.round(bookOutline.estimatedWordCount / 10000)} 万字</span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="outline-section">
            <h4 className="outline-section-title">章节计划 ({chapters.length})</h4>
            <div className="outline-list">
              {chapters.length > 0 ? (
                chapters.map((chapter) => (
                  <OutlineNode 
                    key={chapter.id} 
                    node={chapter} 
                    onEdit={() => handleEditChapter(chapter)}
                    onDelete={handleDeleteChapter}
                  />
                ))
              ) : (
                <div className="outline-empty">
                  还没有章节大纲。点击上方按钮开始规划您的创作路径。
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="outline-empty">
          尚未初始化大纲系统。
          <Button 
            variant="outline" 
            size="sm" 
            style={{ marginTop: '12px' }}
            onClick={handleInitOutline}
          >
            立即初始化
          </Button>
        </div>
      )}

      {/* 章节编辑器 */}
      <Modal
        isOpen={isChapterEditorOpen}
        onClose={() => setIsChapterEditorOpen(false)}
        closeOnOverlayClick={false}
        title={editingChapter ? "编辑章节大纲" : "添加章节大纲"}
        size="md"
      >
        <ChapterOutlineEditor 
          chapter={editingChapter}
          onSave={handleSaveChapter}
          onCancel={() => setIsChapterEditorOpen(false)}
        />
      </Modal>

      {/* 全书大纲编辑器 */}
      <Modal
        isOpen={isBookEditorOpen}
        onClose={() => setIsBookEditorOpen(false)}
        closeOnOverlayClick={false}
        title="编辑全书大纲"
        size="md"
      >
        <BookOutlineEditor 
          outline={bookOutline}
          onSave={handleSaveBookOutline}
          onCancel={() => setIsBookEditorOpen(false)}
        />
      </Modal>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        title="确认删除"
        message="确定要删除这个章节大纲吗？"
        confirmLabel="删除"
        onConfirm={handleConfirmDelete}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default OutlinePanel;
