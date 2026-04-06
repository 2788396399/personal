/* src/pages/ProjectDetail/ProjectDetail.jsx */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProjectStore from '../../stores/projectStore';
import Header from '../../components/Layout/Header/Header';
import ProjectInfo from '../../components/Project/ProjectInfo/ProjectInfo';
import ProgressDashboard from '../../components/Project/ProgressDashboard/ProgressDashboard';
import ChapterList from '../../components/Chapter/ChapterList/ChapterList';
import EditProjectModal from '../../components/Project/EditProjectModal';
import EditChapterModal from '../../components/Editor/EditChapterModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AgentBubble from '../../components/Agent/AgentBubble/AgentBubble';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, setCurrentProject, addChapter, updateProject, updateChapter, deleteChapter } = useProjectStore();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  // Find project by id
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    } else {
      // If project not found, navigate back to management
      navigate('/');
    }
  }, [id, project, setCurrentProject, navigate]);

  if (!project) return null;

  const handleAddChapter = () => {
    const chapterNumber = (project.chapters?.length || 0) + 1;
    const newChapter = {
      title: `第 ${chapterNumber} 章`,
      content: '',
      chapterNumber
    };
    addChapter(project.id, newChapter);
  };

  const handleSelectChapter = (chapterId) => {
    navigate(`/project/${project.id}/chapter/${chapterId}`);
  };

  const handleRequestProjectEdit = (updates) => {
    setConfirmState({
      title: '确认保存作品修改',
      message: '确定要保存当前作品信息修改吗？',
      confirmLabel: '确认保存',
      onConfirm: () => {
        updateProject(project.id, updates);
        setIsProjectModalOpen(false);
        setConfirmState(null);
      }
    });
  };

  const handleRequestChapterEdit = (chapterId, updates) => {
    setConfirmState({
      title: '确认保存章节修改',
      message: '确定要保存当前章节修改吗？',
      confirmLabel: '确认保存',
      onConfirm: () => {
        updateChapter(project.id, chapterId, updates);
        setEditingChapter(null);
        setConfirmState(null);
      }
    });
  };

  const handleRequestChapterDelete = (chapter) => {
    setConfirmState({
      title: '确认删除章节',
      message: `确定要删除“${chapter.title}”吗？删除后无法恢复。`,
      confirmLabel: '确认删除',
      onConfirm: () => {
        deleteChapter(project.id, chapter.id);
        setConfirmState(null);
      }
    });
  };

  const handleCloseConfirm = () => setConfirmState(null);

  const chapters = project.chapters || [];
  const totalWords = chapters.reduce((sum, ch) => sum + (ch.content?.length || 0), 0);

  const stats = {
    totalWords,
    targetWords: project.settings?.targetWordCount || 300000,
    totalChapters: chapters.length,
    targetChapters: project.settings?.targetChapterCount || 100,
    completedChapters: chapters.filter(c => c.status === 'completed').length
  };

  return (
    <div className="project-detail">
      <Header title={project.name} showBack />

      <div className="project-detail-container">
        <ProjectInfo project={project} onEdit={() => setIsProjectModalOpen(true)} />

        <ProgressDashboard stats={stats} />

        <ChapterList
          chapters={chapters}
          onAddChapter={handleAddChapter}
          onSelectChapter={handleSelectChapter}
          onEditChapter={setEditingChapter}
          onDeleteChapter={handleRequestChapterDelete}
        />
      </div>

      <EditProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onEdit={handleRequestProjectEdit}
        project={project}
      />

      <EditChapterModal
        isOpen={!!editingChapter}
        onClose={() => setEditingChapter(null)}
        onEdit={handleRequestChapterEdit}
        chapter={editingChapter}
      />

      <ConfirmDialog
        isOpen={!!confirmState}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        onConfirm={confirmState?.onConfirm}
        onClose={handleCloseConfirm}
      />

      <AgentBubble projectId={id} />
    </div>
  );
};

export default ProjectDetail;
