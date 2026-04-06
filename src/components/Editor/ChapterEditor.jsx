import React from 'react'
import ReactMarkdownRenderer from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FileText, Edit2, Check, X, Menu } from 'lucide-react'
import exportService from '../../services/exportService'
import './ChapterEditor.css'

function ChapterEditor({
  project,
  chapter,
  chapterIndex,
  isEditing,
  editContent,
  onEdit,
  onSave,
  onCancel,
  onContentChange,
  onUpdateChapter,
  onToggleChapterList,
  showChapterList
}) {
  if (!chapter) {
    return (
      <div className="chapter-editor-empty">
        <div className="chapter-editor-empty-content">
          <FileText size={64} className="chapter-editor-empty-icon" />
          <p className="chapter-editor-empty-title">选择或创建章节</p>
          <p className="chapter-editor-empty-subtitle">
            点击左上角菜单查看章节目录
          </p>
          {onToggleChapterList && (
            <button
              onClick={onToggleChapterList}
              className="chapter-editor-menu-btn"
            >
              <Menu size={16} />
              打开章节目录
            </button>
          )}
        </div>
      </div>
    )
  }

  const handleExport = () => {
    const novel = {
      ...project,
      chapters: [chapter]
    }
    exportService.exportToTXT(novel)
  }

  return (
    <div className="chapter-editor">
      <div className="chapter-editor-header">
        <div className="chapter-editor-info">
          <div className="chapter-editor-title-row">
            {onToggleChapterList && (
              <button
                onClick={onToggleChapterList}
                className="chapter-editor-toggle-btn"
              >
                <Menu size={18} />
              </button>
            )}
            <h3 className="chapter-editor-title">
              第{chapterIndex + 1}章 {chapter.title}
            </h3>
          </div>
          <p className="chapter-editor-words">{chapter.content?.length || 0} 字</p>
        </div>
        <div className="chapter-editor-actions">
          {isEditing ? (
            <>
              <button onClick={onSave} className="chapter-editor-btn primary">
                <Check size={14} />
                保存
              </button>
              <button onClick={onCancel} className="chapter-editor-btn secondary">
                <X size={14} />
                取消
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onEdit(chapter)} className="chapter-editor-btn secondary">
                <Edit2 size={14} />
                编辑
              </button>
              <button onClick={handleExport} className="chapter-editor-btn secondary">
                导出
              </button>
            </>
          )}
        </div>
      </div>

      <div className="chapter-editor-content">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => onContentChange(e.target.value)}
            className="chapter-editor-textarea"
            placeholder="在此编辑章节内容..."
          />
        ) : (
          <div className="chapter-editor-preview prose">
            {chapter.content ? (
              <ReactMarkdownRenderer remarkPlugins={[remarkGfm]}>
                {chapter.content}
              </ReactMarkdownRenderer>
            ) : (
              <div className="chapter-editor-empty-content">
                <FileText size={48} className="chapter-editor-empty-icon small" />
                <p>章节内容为空</p>
                <p className="chapter-editor-empty-subtitle">在右侧聊天框中与AI对话生成内容</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChapterEditor
