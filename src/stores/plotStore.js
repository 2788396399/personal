/* src/stores/plotStore.js */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePlotStore = create(
  persist(
    (set, get) => ({
      foreshadowing: [], // Array of Foreshadowing objects
      conflicts: [],     // Array of Conflict objects
      events: [],        // Array of Timeline Event objects

      // --- 伏笔管理 ---
      addForeshadowing: (projectId, data) => set((state) => {
        const existing = state.foreshadowing.find(
          f => f.projectId === projectId && f.content.trim() === data.content?.trim()
        );

        if (existing) {
          // 如果内容完全一样，则更新状态/优先级等
          return {
            foreshadowing: state.foreshadowing.map(f =>
              f.id === existing.id ? { ...f, ...data, updatedAt: new Date().toISOString() } : f
            )
          };
        }

        return {
          foreshadowing: [...state.foreshadowing, {
            id: `fs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            content: data.content || '',
            plantChapter: data.plantChapter || 1,
            revealChapter: data.revealChapter || null,
            status: 'pending', // pending, revealed, abandoned
            importance: data.priority || 'medium', // low, medium, high
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }]
        };
      }),

      updateForeshadowing: (id, updates) => set((state) => ({
        foreshadowing: state.foreshadowing.map(f =>
          f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
        )
      })),

      deleteForeshadowing: (id) => set((state) => ({
        foreshadowing: state.foreshadowing.filter(f => f.id !== id)
      })),

      // --- 冲突管理 ---
      addConflict: (projectId, data) => set((state) => {
        const existing = state.conflicts.find(
          c => c.projectId === projectId && c.description.trim() === data.description?.trim()
        );

        if (existing) {
          return {
            conflicts: state.conflicts.map(c =>
              c.id === existing.id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
            )
          };
        }

        return {
          conflicts: [...state.conflicts, {
            id: `cf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            description: data.description || '',
            type: data.type || 'external', // internal, external
            involvedCharacterIds: data.involvedCharacterIds || [],
            startChapter: data.startChapter || 1,
            endChapter: data.endChapter || null,
            status: 'active', // active, resolved, suspended
            resolution: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }]
        };
      }),

      updateConflict: (id, updates) => set((state) => ({
        conflicts: state.conflicts.map(c =>
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        )
      })),

      deleteConflict: (id) => set((state) => ({
        conflicts: state.conflicts.filter(c => c.id !== id)
      })),

      // --- 智能查询 ---
      getForeshadowingByProjectId: (projectId) => {
        return get().foreshadowing.filter(f => f.projectId === projectId)
      },

      getPendingForeshadowing: (projectId) => {
        return get().foreshadowing.filter(f => f.projectId === projectId && f.status === 'pending')
      },

      getConflictsByProjectId: (projectId) => {
        return get().conflicts.filter(c => c.projectId === projectId)
      },

      getActiveConflicts: (projectId) => {
        return get().conflicts.filter(c => c.projectId === projectId && c.status === 'active')
      }
    }),
    {
      name: 'novel-plots'
    }
  )
)

export default usePlotStore
