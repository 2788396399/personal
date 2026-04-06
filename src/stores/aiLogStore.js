/* src/stores/aiLogStore.js */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAILogStore = create(
  persist(
    (set, get) => ({
      logs: [],

      // 添加日志
      addLog: (log) => set((state) => ({
        logs: [{
          ...log,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          userConfirmed: log.userConfirmed ?? false,
          userModified: log.userModified ?? false,
          undone: false,
          canUndo: log.canUndo ?? true
        }, ...state.logs].slice(0, 200) // 保留最近 200 条日志
      })),

      // 确认日志（AI 建议被接受）
      confirmLog: (id, updates = {}) => set((state) => ({
        logs: state.logs.map(log => 
          log.id === id 
            ? { ...log, userConfirmed: true, confirmedAt: new Date().toISOString(), ...updates }
            : log
        )
      })),

      // 撤销日志（AI 操作被撤销）
      undoLog: (id) => set((state) => ({
        logs: state.logs.map(log => 
          log.id === id 
            ? { ...log, undone: true, undoneAt: new Date().toISOString() }
            : log
        )
      })),

      // 获取项目相关的日志
      getLogsByProject: (projectId) => {
        return get().logs.filter(log => log.projectId === projectId)
      },

      // 清空日志
      clearLogs: () => set({ logs: [] })
    }),
    {
      name: 'ai-operation-logs'
    }
  )
)

export default useAILogStore
