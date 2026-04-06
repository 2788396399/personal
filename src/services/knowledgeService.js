/* src/services/knowledgeService.js */
import { createAIService } from './ai/aiService';
import useSettingsStore from '../stores/settingsStore';
import { PROMPT_TEMPLATES } from '../utils/promptTemplates';

class KnowledgeService {
  /**
   * 生成章节摘要
   * 
   * @param {string} content - 章节内容
   * @returns {Promise<object>} - { oneLineSummary, detailedSummary, keyEvents, characters }
   */
  async generateChapterSummary(content) {
    const { aiConfig, customModels } = useSettingsStore.getState();
    const activeModel = customModels.find(m => m.id === aiConfig.activeModelId);
    const aiService = createAIService(aiConfig, activeModel);

    const systemPrompt = PROMPT_TEMPLATES.CHAPTER_SUMMARY(content);
    
    try {
      const response = await aiService.chat([
        { role: 'user', content: '请为本章生成摘要。' }
      ], systemPrompt);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('AI 返回摘要格式不正确');
    } catch (error) {
      console.error('Failed to generate summary:', error);
      throw error;
    }
  }

  /**
   * 提取实体与设定
   * 
   * @param {string} content - 章节内容
   * @returns {Promise<object>} - { newEntities: [], updatedEntities: [], newSettings: [] }
   */
  async extractKnowledge(content) {
    const { aiConfig, customModels } = useSettingsStore.getState();
    const activeModel = customModels.find(m => m.id === aiConfig.activeModelId);
    const aiService = createAIService(aiConfig, activeModel);

    const systemPrompt = `请分析以下小说章节内容，识别并提取其中的实体（地点、物品、组织、核心概念）和世界观设定。
    返回 JSON 格式。
    
    章节内容：
    """
    ${content}
    """
    
    返回示例：
    {
      "entities": [
        { "name": "青云山", "type": "location", "description": "终年云雾缭绕的神山" }
      ],
      "settings": [
        { "title": "灵气枯竭", "category": "magic_system", "content": "描述灵气稀薄的原因..." }
      ]
    }`;

    try {
      const response = await aiService.chat([
        { role: 'user', content: '请提取知识库内容。' }
      ], systemPrompt);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { entities: [], settings: [] };
    } catch (error) {
      console.error('Failed to extract knowledge:', error);
      return { entities: [], settings: [] };
    }
  }
}

export const knowledgeService = new KnowledgeService();
export default knowledgeService;
