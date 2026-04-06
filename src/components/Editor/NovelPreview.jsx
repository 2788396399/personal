import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FileText, Edit2, Check, X, Menu } from 'lucide-react'
import exportService from '../../services/exportService'
import './NovelPreview.css'

function NovelPreview({ project, activeChapterId, onSelectChapter, onShowChapterList, onUpdateChapter }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')

  if (!project) {
    return (
      <div className="novel-preview-empty">
          <div className="novel-preview-empty-icon-wrapper-large">
            <FileText size={48} className="empty-icon-svg" strokeWidth={1} />
          </div>
          <h2 className="novel-preview-empty-title">开始创作你的宏篇巨著</h2>
          <p className="novel-preview-empty-subtitle">
            从左侧作品集选择一部作品，点击“浏览章节目录”开启创作之旅。
          </p>
      </div>
    )
  }

  const chapters = project.chapters || []
  const activeChapter = chapters.find(ch => ch.id === activeChapterId)

  const handleEdit = (chapter) => {
    setIsEditing(true)
    setEditContent(chapter.content)
  }

  const handleSave = () => {
    if (activeChapter) {
      onUpdateChapter(project.id, activeChapter.id, { content: editContent })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent('')
  }

  const handleExportActiveChapter = () => {
    exportService.exportToTXT({
      ...project,
      chapters: [activeChapter]
    })
  }

  const chapterIndex = chapters.findIndex(ch => ch.id === activeChapter?.id)

  return (
    <div className="novel-preview bg-primary text-primary">
      <div className="chapter-editor surface-float">
        <div className="chapter-editor-header">
          <div className="chapter-editor-info">
            <div className="chapter-editor-title-row">
              <button
                onClick={onShowChapterList}
                className="chapter-editor-toggle-btn"
                title="切换到章节目录"
              >
                <Menu size={18} strokeWidth={1.5} />
              </button>
              {activeChapter ? (
                <div className="chapter-editor-title-group chapter-editor-title-group-single">
                  <h3 className="chapter-editor-title">
                    第{chapterIndex + 1}章 {activeChapter.title}
                  </h3>
                </div>
              ) : (
                <div className="chapter-editor-title-group chapter-editor-title-group-empty">
                  <h3 className="chapter-editor-title chapter-editor-title-empty">正文</h3>
                  <span className="ready-status">READY</span>
                </div>
              )}
            </div>
          </div>
          {activeChapter && (
            <div className="chapter-editor-actions">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="chapter-editor-btn chapter-editor-btn-primary">
                    <Check size={14} strokeWidth={1.5} />
                    保存
                  </button>
                  <button onClick={handleCancel} className="chapter-editor-btn chapter-editor-btn-secondary">
                    <X size={14} strokeWidth={1.5} />
                    取消
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(activeChapter)} className="chapter-editor-btn chapter-editor-btn-secondary">
                    <Edit2 size={14} strokeWidth={1.5} />
                    编辑
                  </button>
                  <div className="editor-tech-badge">
                    {activeChapter.content?.length || 0} 字
                  </div>
                  <button onClick={handleExportActiveChapter} className="chapter-editor-btn chapter-editor-btn-secondary">
                    导出
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="chapter-editor-content">
          {!activeChapter ? (
            <div className="chapter-editor-empty">
              <div className="chapter-editor-empty-content">
                <div className="chapter-editor-empty-icon-wrapper">
                  <FileText size={40} className="empty-icon-svg" strokeWidth={1.5} />
                </div>
                <h2 className="chapter-editor-empty-title">开始创作新章节</h2>
                <p className="chapter-editor-empty-subtitle">
                  点击左上角菜单，或选择一个已有章节继续你的故事。
                </p>
                <button
                  onClick={onShowChapterList}
                  className="chapter-editor-menu-btn btn-tech mt-8"
                >
                  <Menu size={18} strokeWidth={1.5} />
                  <span>浏览章节目录</span>
                </button>
              </div>
            </div>
          ) : isEditing ? (
            <div className="editor-focus-container mx-auto">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="chapter-editor-textarea"
                placeholder="在此编辑章节内容 ..."
                autoFocus
              />
            </div>
          ) : (
            <div className="chapter-editor-preview">
              <div className="editor-focus-container mx-auto">
                {activeChapter.content ? (
                  <div className="prose-novel">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activeChapter.content}
                    </ReactMarkdown>
                    <div className="ornament-line" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <FileText size={48} strokeWidth={1} />
                    <p className="mt-4 font-mono text-sm tracking-widest">CHAPTER_EMPTY</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NovelPreview
