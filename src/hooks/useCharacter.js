/* src/hooks/useCharacter.js */
import { useCallback } from 'react';
import useCharacterStore from '../stores/characterStore';
import characterExtractService from '../services/characterExtractService';

/**
 * Character Operation Hook
 * 
 * Manages character card operations for a specific project.
 */
const useCharacter = (projectId) => {
  const store = useCharacterStore();
  
  const characters = store.getCharactersByProjectId(projectId);

  /**
   * AI 辅助生成角色卡片
   */
  const generateWithAI = useCallback(async (basicInfo, projectContext) => {
    try {
      const newChar = await characterExtractService.generateCharacter(basicInfo, projectContext);
      return newChar;
    } catch (error) {
      console.error('Failed to generate with AI:', error);
      throw error;
    }
  }, []);

  /**
   * 从章节内容中提取角色
   */
  const extractFromContent = useCallback(async (content) => {
    try {
      const existingCharacters = store.getCharactersByProjectId(projectId);
      const extractionData = await characterExtractService.extractFromContent(content, existingCharacters);
      return extractionData;
    } catch (error) {
      console.error('Failed to extract from content:', error);
      throw error;
    }
  }, [projectId, store]);

  /**
   * 确认并保存提取结果
   */
  const confirmExtraction = useCallback((extractionData) => {
    const { newCharacters = [], updates = [] } = extractionData;
    
    // 保存新角色
    newCharacters.forEach(char => {
      store.createCharacter({ ...char, projectId, isAIExtracted: true });
    });
    
    // 更新现有角色
    updates.forEach(update => {
      const char = store.characters.find(c => c.name === update.name && c.projectId === projectId);
      if (char) {
        store.updateCharacter(char.id, { [update.field]: update.newValue });
      }
    });
  }, [projectId, store]);

  return {
    characters,
    createCharacter: (data) => store.createCharacter({ ...data, projectId }),
    updateCharacter: store.updateCharacter,
    deleteCharacter: store.deleteCharacter,
    addRelationship: store.addRelationship,
    addAppearance: store.addAppearance,
    generateWithAI,
    extractFromContent,
    confirmExtraction
  };
};

export default useCharacter;
