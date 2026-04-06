import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,

      createProject: (project) => set((state) => ({
        projects: [...state.projects, {
          ...project,
          id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          chapters: [],
          conversations: [],
          settings: {
            worldBuilding: '',
            characters: [],
            style: '',
            outline: ''
          }
        }]
      })),

      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        )
      })),

      deleteProject: (id) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, isDeleted: true, deletedAt: new Date().toISOString() } : p),
        currentProject: state.currentProject?.id === id ? null : state.currentProject
      })),

      restoreProject: (id) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, isDeleted: false, deletedAt: undefined } : p)
      })),

      hardDeleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject
      })),

      setCurrentProject: (project) => set({ currentProject: project }),

      addChapter: (projectId, chapter) => set((state) => {
        const newChapter = {
          ...chapter,
          id: `chapter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          status: 'draft'
        }

        const updatedProjects = state.projects.map(p =>
          p.id === projectId ? {
            ...p,
            chapters: [...p.chapters, newChapter],
            updatedAt: new Date().toISOString()
          } : p
        )

        const updatedCurrentProject = state.currentProject?.id === projectId
          ? {
              ...state.currentProject,
              chapters: [...state.currentProject.chapters, newChapter],
              updatedAt: new Date().toISOString()
            }
          : state.currentProject

        return {
          projects: updatedProjects,
          currentProject: updatedCurrentProject
        }
      }),

      updateChapter: (projectId, chapterId, updates) => set((state) => {
        const updateProjectInList = (p) => {
          if (p.id !== projectId) return p
          return {
            ...p,
            chapters: p.chapters.map(c =>
              c.id === chapterId ? { ...c, ...updates } : c
            ),
            updatedAt: new Date().toISOString()
          }
        }

        const updatedProjects = state.projects.map(updateProjectInList)
        const updatedCurrentProject = state.currentProject?.id === projectId
          ? updateProjectInList(state.currentProject)
          : state.currentProject

        return {
          projects: updatedProjects,
          currentProject: updatedCurrentProject
        }
      }),

      deleteChapter: (projectId, chapterId) => set((state) => {
        const updateProjectInList = (p) => {
          if (p.id !== projectId) return p
          return {
            ...p,
            chapters: p.chapters.filter(c => c.id !== chapterId),
            updatedAt: new Date().toISOString()
          }
        }

        const updatedProjects = state.projects.map(updateProjectInList)
        const updatedCurrentProject = state.currentProject?.id === projectId
          ? updateProjectInList(state.currentProject)
          : state.currentProject

        return {
          projects: updatedProjects,
          currentProject: updatedCurrentProject
        }
      })
    }),
    {
      name: 'novel-projects'
    }
  )
)

export default useProjectStore
