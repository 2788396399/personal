/* src/stores/knowledgeStore.js */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useKnowledgeStore = create(
  persist(
    (set, get) => ({
      worldSettings: [], // Array of { id, projectId, category, title, content, status }
      entities: [],      // Array of { id, projectId, name, type, description, aliases, relatedCharacterIds }
      summaries: [],     // Array of { id, projectId, chapterId, chapterNumber, oneLine, detailed, keyEvents }

      // --- 世界设定管理 ---
      addWorldSetting: (projectId, data, chapterInfo = null) => set((state) => {
        const existingIndex = state.worldSettings.findIndex(
          s => s.projectId === projectId && s.title.toLowerCase() === data.title?.toLowerCase()
        );

        const chapterEntry = chapterInfo ? {
          chapterNumber: chapterInfo.chapterNumber,
          chapterId: chapterInfo.chapterId,
          content: data.content, // 该章节下的具体状态/内容
          timestamp: new Date().toISOString()
        } : null;

        if (existingIndex > -1) {
          // 合并逻辑
          const existing = state.worldSettings[existingIndex];
          const newSettings = [...state.worldSettings];
          
          // 更新出现章节记录
          let newAppearances = existing.appearances || [];
          if (chapterEntry) {
            // 如果是同一章，则清除该章旧内容，重新生成（覆盖）
            newAppearances = newAppearances.filter(a => a.chapterNumber !== chapterEntry.chapterNumber);
            // 将新记录加入并排序
            newAppearances = [...newAppearances, chapterEntry].sort((a, b) => a.chapterNumber - b.chapterNumber);
          }

          // 获取最新的一条记录作为主内容显示
          const latestContent = newAppearances.length > 0 
            ? newAppearances[newAppearances.length - 1].content 
            : data.content || existing.content;

          newSettings[existingIndex] = {
            ...existing,
            ...data,
            content: latestContent,
            appearances: newAppearances,
            updatedAt: new Date().toISOString()
          };
          return { worldSettings: newSettings };
        }

        // 新增逻辑
        return {
          worldSettings: [...state.worldSettings, {
            id: `setting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            category: data.category || 'general',
            title: data.title || '',
            content: data.content || '',
            appearances: chapterEntry ? [chapterEntry] : [],
            status: 'stable',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }]
        };
      }),

      updateWorldSetting: (id, updates) => set((state) => ({
        worldSettings: state.worldSettings.map(s =>
          s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
        )
      })),

      deleteWorldSetting: (id) => set((state) => ({
        worldSettings: state.worldSettings.filter(s => s.id !== id)
      })),

      // --- 实体管理 ---
      addEntity: (projectId, data, chapterInfo = null) => set((state) => {
        const existingIndex = state.entities.findIndex(
          e => e.projectId === projectId && e.name.toLowerCase() === data.name?.toLowerCase()
        );

        const chapterEntry = chapterInfo ? {
          chapterNumber: chapterInfo.chapterNumber,
          chapterId: chapterInfo.chapterId,
          description: data.description, // 该章节下的具体状态/描述
          timestamp: new Date().toISOString()
        } : null;

        if (existingIndex > -1) {
          // 合并逻辑
          const existing = state.entities[existingIndex];
          const newEntities = [...state.entities];
          
          // 更新出现章节记录
          let newAppearances = existing.appearances || [];
          if (chapterEntry) {
            // 如果是同一章，则清除该章旧内容，重新生成（覆盖）
            newAppearances = newAppearances.filter(a => a.chapterNumber !== chapterEntry.chapterNumber);
            // 将新记录加入并排序
            newAppearances = [...newAppearances, chapterEntry].sort((a, b) => a.chapterNumber - b.chapterNumber);
          }

          // 获取最新的一条记录作为主内容显示
          const latestDescription = newAppearances.length > 0 
            ? newAppearances[newAppearances.length - 1].description 
            : data.description || existing.description;

          newEntities[existingIndex] = {
            ...existing,
            ...data,
            description: latestDescription,
            appearances: newAppearances,
            updatedAt: new Date().toISOString()
          };
          return { entities: newEntities };
        }

        return {
          entities: [...state.entities, {
            id: `entity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            name: data.name || '',
            type: data.type || 'location',
            description: data.description || '',
            aliases: data.aliases || [],
            appearances: chapterEntry ? [chapterEntry] : [],
            relatedCharacterIds: data.relatedCharacterIds || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }]
        };
      }),

      updateEntity: (id, updates) => set((state) => ({
        entities: state.entities.map(e =>
          e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
        )
      })),

      deleteEntity: (id) => set((state) => ({
        entities: state.entities.filter(e => e.id !== id)
      })),

      // --- 章节摘要管理 ---
      addSummary: (projectId, data) => set((state) => {
        const existingIndex = state.summaries.findIndex(
          s => s.projectId === projectId && s.chapterNumber === data.chapterNumber
        );

        if (existingIndex > -1) {
          // 合并/更新同章节摘要
          const existing = state.summaries[existingIndex];
          const newSummaries = [...state.summaries];
          newSummaries[existingIndex] = {
            ...existing,
            ...data,
            updatedAt: new Date().toISOString()
          };
          return { summaries: newSummaries };
        }

        return {
          summaries: [...state.summaries, {
            id: `summary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            chapterId: data.chapterId,
            chapterNumber: data.chapterNumber,
            oneLine: data.oneLine || '',
            detailed: data.detailed || '',
            keyEvents: data.keyEvents || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }]
        };
      }),

      updateSummary: (id, updates) => set((state) => ({
        summaries: state.summaries.map(s =>
          s.id === id ? { ...s, ...updates } : s
        )
      })),

      // --- 查询 ---
      getKnowledgeByProjectId: (projectId) => {
        return {
          worldSettings: get().worldSettings.filter(s => s.projectId === projectId),
          entities: get().entities.filter(e => e.projectId === projectId),
          summaries: get().summaries.filter(s => s.projectId === projectId).sort((a, b) => a.chapterNumber - b.chapterNumber)
        }
      }
    }),
    {
      name: 'novel-knowledge'
    }
  )
)

export default useKnowledgeStore
