import React, { useState } from 'react'
import { Plus, Folder, BookOpen, Library, Trash2 } from 'lucide-react'
import ProjectCard from './ProjectCard'
import CreateProjectModal from './CreateProjectModal'
import EditProjectModal from './EditProjectModal'
import ChapterList from '../Editor/ChapterList'
import ConfirmDialog from '../common/ConfirmDialog'
import './ProjectList.css'

function ProjectList({
  projects,
  currentProject,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onEditProject,
  onRestoreProject,
  onHardDeleteProject,
  sidebarTab,
  onTabChange,
  chapters,
  activeChapter,
  onSelectChapter,
  onAddChapter,
  onUpdateChapter,
  onDeleteChapter,
  projectId
}) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [pendingDeleteProject, setPendingDeleteProject] = useState(null)
  const [pendingHardDeleteProject, setPendingHardDeleteProject] = useState(null)

  const activeProjects = projects.filter(p => !p.isDeleted)
  const deletedProjects = projects.filter(p => p.isDeleted)

  const handleSelectProject = (project) => {
    onSelectProject(project)
  }

  const handleConfirmDelete = () => {
    if (pendingDeleteProject) {
      onDeleteProject(pendingDeleteProject.id)
      setPendingDeleteProject(null)
    }
  }

  const handleConfirmHardDelete = () => {
    if (pendingHardDeleteProject) {
      onHardDeleteProject(pendingHardDeleteProject.id)
      setPendingHardDeleteProject(null)
    }
  }

  return (
    <div className="project-list-container">
      <div className="project-list-header">
        <div className="project-list-tabs">
          <button
            onClick={() => onTabChange('projects')}
            className={`project-list-tab ${sidebarTab === 'projects' ? 'active' : ''}`}
            title="作品集"
          >
            <Library size={14} strokeWidth={1.8} />
            <span>作品</span>
          </button>
          <button
            onClick={() => onTabChange('chapters')}
            className={`project-list-tab ${sidebarTab === 'chapters' ? 'active' : ''}`}
            title="章节目录"
          >
            <BookOpen size={14} strokeWidth={1.8} />
            <span>章节</span>
          </button>
        </div>

        {sidebarTab === 'projects' ? (
          <button
            onClick={() => setShowCreateModal(true)}
            className="project-list-add-btn"
            title="创建新项目"
          >
            <Plus size={16} strokeWidth={1.5} />
          </button>
        ) : null}
      </div>

      <div className="project-list-body">
        {sidebarTab === 'projects' ? (
          <div className="project-list-content">
            {activeProjects.length === 0 ? (
              <EmptyState onCreateProject={() => setShowCreateModal(true)} />
            ) : (
              <div className="project-list-items">
                {activeProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    isActive={currentProject?.id === project.id}
                    onSelect={() => handleSelectProject(project)}
                    onDelete={() => setPendingDeleteProject(project)}
                    onEdit={() => setEditingProject(project)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : sidebarTab === 'trash' ? (
          <div className="project-list-content">
            {deletedProjects.length === 0 ? (
              <div className="project-list-empty-panel">
                <div className="project-list-empty-icon">
                  <Trash2 size={28} strokeWidth={1.5} />
                </div>
                <div className="project-list-empty-title">回收站为空</div>
                <div className="project-list-empty-text">被删除的作品会暂时存放在这里。</div>
              </div>
            ) : (
              <div className="project-list-items">
                {deletedProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    isActive={false}
                    isDeleted={true}
                    onSelect={() => {}}
                    onRestore={() => onRestoreProject(project.id)}
                    onHardDelete={() => setPendingHardDeleteProject(project)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : currentProject ? (
          <div className="project-list-chapters-view">
            <ChapterList
              chapters={chapters}
              activeChapter={activeChapter}
              onSelectChapter={onSelectChapter}
              onAddChapter={onAddChapter}
              onUpdateChapter={onUpdateChapter}
              onDeleteChapter={onDeleteChapter}
              projectId={projectId}
            />
          </div>
        ) : (
          <div className="project-list-empty-panel">
            <div className="project-list-empty-icon">
              <BookOpen size={28} strokeWidth={1.5} />
            </div>
            <div className="project-list-empty-title">先选择一本作品</div>
            <div className="project-list-empty-text">切换到作品标签，选择项目后即可查看章节目录。</div>
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={onCreateProject}
      />

      <EditProjectModal
        isOpen={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        onEdit={onEditProject}
        project={editingProject}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDeleteProject)}
        title="移至回收站"
        message={pendingDeleteProject ? `确定要将“${pendingDeleteProject.name}”移至回收站吗？` : ''}
        confirmLabel="移至回收站"
        onClose={() => setPendingDeleteProject(null)}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingHardDeleteProject)}
        title="彻底删除作品"
        message={pendingHardDeleteProject ? `警告：确定要彻底删除“${pendingHardDeleteProject.name}”吗？此操作不可恢复，将永久删除该作品的所有章节和对话记录。` : ''}
        confirmLabel="彻底删除"
        onClose={() => setPendingHardDeleteProject(null)}
        onConfirm={handleConfirmHardDelete}
      />
      {sidebarTab !== 'trash' ? (
        <button
          className="floating-trash-btn"
          onClick={() => onTabChange('trash')}
          title="回收站"
        >
          <Trash2 size={20} />
        </button>
      ) : (
        <button
          className="floating-trash-btn active"
          onClick={() => onTabChange('projects')}
          title="返回作品"
        >
          <Library size={20} />
        </button>
      )}
    </div>
  )
}

function EmptyState({ onCreateProject }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Folder size={48} strokeWidth={1} />
      </div>
      <p className="empty-text">开始你的第一部作品</p>
      <button onClick={onCreateProject} className="btn-empty">
        创建新项目
      </button>
    </div>
  )
}

export default ProjectList
