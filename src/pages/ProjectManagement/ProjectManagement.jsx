/* src/pages/ProjectManagement/ProjectManagement.jsx */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../../stores/projectStore';
import Header from '../../components/Layout/Header/Header';
import ProjectCard from '../../components/Project/ProjectCard/ProjectCard';
import NewProjectModal from '../../components/Project/NewProjectModal/NewProjectModal';
import Button from '../../components/common/Button/Button';
import './ProjectManagement.css';

const ProjectManagement = () => {
  const navigate = useNavigate();
  const { projects, createProject, setCurrentProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = (projectData) => {
    createProject(projectData);
    setIsModalOpen(false);
  };

  const handleSelectProject = (project) => {
    setCurrentProject(project);
    navigate(`/project/${project.id}`);
  };

  // 过滤掉已删除的作品
  const activeProjects = projects.filter(p => !p.isDeleted);

  return (
    <div className="project-management">
      <Header title="AI小说创作助手" />

      <div className="project-management-container">
        <div className="project-management-header">
          <h2 className="project-management-title">我的作品</h2>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            ＋ 新建作品
          </Button>
        </div>

        <div className="project-grid">
          {activeProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleSelectProject(project)}
            />
          ))}
          <ProjectCard isNew onClick={() => setIsModalOpen(true)} />
        </div>
      </div>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
};

export default ProjectManagement;
