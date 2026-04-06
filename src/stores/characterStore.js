/* src/stores/characterStore.js */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCharacterStore = create(
  persist(
    (set, get) => ({
      characters: [],

      // 基础 CRUD
      createCharacter: (character) => set((state) => {
        const existingIndex = state.characters.findIndex(
          c => c.projectId === character.projectId && c.name.toLowerCase() === character.name?.toLowerCase()
        );

        if (existingIndex > -1) {
          // 如果已存在同名角色，则进行合并（覆盖更新）
          const existing = state.characters[existingIndex];
          const newCharacters = [...state.characters];
          newCharacters[existingIndex] = {
            ...existing,
            ...character,
            updatedAt: new Date().toISOString()
          };
          return { characters: newCharacters };
        }

        // 否则创建新角色
        return {
          characters: [...state.characters, {
            ...character,
            id: `char-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isAIExtracted: character.isAIExtracted || false,
            appearances: {
              chapters: [],
              keyScenes: [],
              lastMentionChapter: null,
              ...character.appearances
            },
            relationships: character.relationships || [],
            personality: {
              traits: [],
              habits: [],
              catchphrases: [],
              ...character.personality
            },
            background: {
              origin: '',
              experiences: [],
              secrets: [],
              ...character.background
            },
            arc: {
              goal: '',
              innerConflict: '',
              growthTrack: '',
              ...character.arc
            }
          }]
        };
      }),

      updateCharacter: (id, updates) => set((state) => ({
        characters: state.characters.map(c =>
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        )
      })),

      deleteCharacter: (id) => set((state) => ({
        characters: state.characters.filter(c => c.id !== id)
      })),

      // 关系管理
      addRelationship: (characterId, relationship) => set((state) => ({
        characters: state.characters.map(c =>
          c.id === characterId 
            ? { ...c, relationships: [...c.relationships, relationship], updatedAt: new Date().toISOString() }
            : c
        )
      })),

      // 出场记录
      addAppearance: (characterId, chapterId, sceneDescription) => set((state) => ({
        characters: state.characters.map(c => {
          if (c.id !== characterId) return c;
          const chapters = Array.from(new Set([...c.appearances.chapters, chapterId]));
          const keyScenes = sceneDescription 
            ? [...c.appearances.keyScenes, { chapterId, sceneDescription }] 
            : c.appearances.keyScenes;
          
          return {
            ...c,
            appearances: {
              ...c.appearances,
              chapters,
              keyScenes,
              lastMentionChapter: chapterId
            },
            updatedAt: new Date().toISOString()
          };
        })
      })),

      // 智能查询
      getCharactersByProjectId: (projectId) => {
        return get().characters.filter(c => c.projectId === projectId)
      },

      getCharacterById: (id) => {
        return get().characters.find(c => c.id === id)
      }
    }),
    {
      name: 'novel-characters'
    }
  )
)

export default useCharacterStore
