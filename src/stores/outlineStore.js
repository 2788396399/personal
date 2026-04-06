/* src/stores/outlineStore.js */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useOutlineStore = create(
  persist(
    (set, get) => ({
      outlines: [], // Array of BookOutline

      // 基础 CRUD - 全书大纲
      createBookOutline: (projectId, data) => set((state) => ({
        outlines: [...state.outlines, {
          id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          projectId,
          title: data.title || '',
          genre: data.genre || '',
          theme: data.theme || '',
          synopsis: data.synopsis || '',
          estimatedWordCount: data.estimatedWordCount || 0,
          estimatedChapterCount: data.estimatedChapterCount || 0,
          volumes: [],
          chapters: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      })),

      updateBookOutline: (projectId, updates) => set((state) => ({
        outlines: state.outlines.map(o =>
          o.projectId === projectId ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
        )
      })),

      // 章节大纲管理
      addChapterOutline: (projectId, chapterOutline) => set((state) => ({
        outlines: state.outlines.map(o => {
          if (o.projectId !== projectId) return o;
          
          const chapterNumber = chapterOutline.chapterNumber || (o.chapters.length + 1);
          const existingChapterIndex = o.chapters.findIndex(c => c.chapterNumber === chapterNumber);
          
          const chapterData = {
            id: existingChapterIndex > -1 
              ? o.chapters[existingChapterIndex].id 
              : `chapter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            bookOutlineId: o.id,
            chapterNumber: chapterNumber,
            title: chapterOutline.title || '',
            objective: chapterOutline.objective || '',
            plotPoints: chapterOutline.plotPoints || [],
            targetWordCount: chapterOutline.targetWordCount || 0,
            characterIds: chapterOutline.characterIds || [],
            keyScenes: chapterOutline.keyScenes || [],
            foreshadowing: {
              plant: chapterOutline.foreshadowing?.plant || [],
              reveal: chapterOutline.foreshadowing?.reveal || []
            },
            status: existingChapterIndex > -1 ? o.chapters[existingChapterIndex].status : 'not_started',
            actualWordCount: existingChapterIndex > -1 ? o.chapters[existingChapterIndex].actualWordCount : 0,
            notes: existingChapterIndex > -1 ? o.chapters[existingChapterIndex].notes : '',
            createdAt: existingChapterIndex > -1 ? o.chapters[existingChapterIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          let newChapters = [...o.chapters];
          if (existingChapterIndex > -1) {
            // 如果是同一章，则替换旧内容（清除并加入新的）
            newChapters[existingChapterIndex] = chapterData;
          } else {
            // 如果是新章节，则追加并重新按章节号排序
            newChapters = [...newChapters, chapterData].sort((a, b) => a.chapterNumber - b.chapterNumber);
          }

          return {
            ...o,
            chapters: newChapters,
            updatedAt: new Date().toISOString()
          };
        })
      })),

      updateChapterOutline: (projectId, chapterOutlineId, updates) => set((state) => ({
        outlines: state.outlines.map(o => {
          if (o.projectId !== projectId) return o;
          
          return {
            ...o,
            chapters: o.chapters.map(c => 
              c.id === chapterOutlineId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
            ),
            updatedAt: new Date().toISOString()
          };
        })
      })),

      deleteChapterOutline: (projectId, chapterOutlineId) => set((state) => ({
        outlines: state.outlines.map(o => {
          if (o.projectId !== projectId) return o;
          
          return {
            ...o,
            chapters: o.chapters.filter(c => c.id !== chapterOutlineId),
            updatedAt: new Date().toISOString()
          };
        })
      })),

      // 查询
      getOutlineByProjectId: (projectId) => {
        return get().outlines.find(o => o.projectId === projectId)
      },

      getChapterOutline: (projectId, chapterNumber) => {
        const outline = get().outlines.find(o => o.projectId === projectId);
        return outline?.chapters.find(c => c.chapterNumber === chapterNumber);
      }
    }),
    {
      name: 'novel-outlines'
    }
  )
)

export default useOutlineStore
