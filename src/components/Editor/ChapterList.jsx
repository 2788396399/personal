import React, { useState } from 'react'
import { FileText, Plus, Trash2, Edit2 } from 'lucide-react'
import AddChapterModal from './AddChapterModal'
import EditChapterModal from './EditChapterModal'
import ConfirmDialog from '../common/ConfirmDialog'
import './ChapterList.css'

function ChapterList({ chapters, activeChapter, onSelectChapter, onAddChapter, onUpdateChapter, onDeleteChapter, projectId }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [pendingDeleteChapter, setPendingDeleteChapter] = useState(null)
  const totalWords = chapters?.reduce((sum, ch) => sum + (ch.content?.length || 0), 0) || 0

  const handleAddChapter = (chapterData) => {
    onAddChapter(projectId, chapterData)
    setIsModalOpen(false)
  }

  const handleEditChapter = (chapterId, updates) => {
    onUpdateChapter(projectId, chapterId, updates)
    setEditingChapter(null)
  }

  const handleConfirmDelete = () => {
    if (!pendingDeleteChapter) return
    onDeleteChapter(projectId, pendingDeleteChapter.id)
    setPendingDeleteChapter(null)
  }

  return (
    <div className="chapter-list">
      <div className="chapter-list-header">
        <div className="chapter-list-title-row">
          <h3 className="chapter-list-title">章节目录</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="chapter-add-btn"
            title="添加章节"
          >
            <Plus size={14} />
            <span>添加</span>
          </button>
        </div>
        <div className="chapter-list-stats">
          共 {chapters.length} 章 · {totalWords.toLocaleString()} 字
        </div>
      </div>

      <div className="chapter-list-content">
        {chapters.length === 0 ? (
          <div className="chapter-list-empty">
            还没有章节，开始创作吧
          </div>
        ) : (
          <div className="chapter-items">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                onClick={() => onSelectChapter(chapter.id)}
                className={`chapter-item ${activeChapter?.id === chapter.id ? 'active' : ''}`}
              >
                <div className="chapter-item-content">
                  <div className="chapter-item-title">
                    第{index + 1}章 {chapter.title}
                  </div>
                  <div className="chapter-item-words">
                    {chapter.content?.length || 0} 字
                  </div>
                </div>
                <div className="chapter-actions" style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingChapter(chapter)
                    }}
                    className="chapter-action-btn"
                    title="编辑标题"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPendingDeleteChapter(chapter)
                    }}
                    className="chapter-action-btn chapter-delete-btn"
                    title="删除章节"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddChapterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddChapter}
      />

      <EditChapterModal
        isOpen={Boolean(editingChapter)}
        onClose={() => setEditingChapter(null)}
        onEdit={handleEditChapter}
        chapter={editingChapter}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDeleteChapter)}
        title="删除章节"
        message={pendingDeleteChapter ? `确定要删除“${pendingDeleteChapter.title}”吗？` : ''}
        confirmLabel="删除"
        onClose={() => setPendingDeleteChapter(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default ChapterList
