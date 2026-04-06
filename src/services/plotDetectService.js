/* src/services/plotDetectService.js */
import { createAIService } from './ai/aiService';
import useSettingsStore from '../stores/settingsStore';
import { PROMPT_TEMPLATES } from '../utils/promptTemplates';

class PlotDetectService {
  /**
   * 自动识别伏笔与揭示
   * 
   * @param {string} content - 章节内容
   * @param {Array} pendingForeshadowing - 待回收的伏笔列表
   * @returns {Promise<object>} - { newForeshadowing: [], reveals: [] }
   */
  async detectForeshadowing(content, pendingForeshadowing) {
    const { aiConfig, customModels } = useSettingsStore.getState();
    const activeModel = customModels.find(m => m.id === aiConfig.activeModelId);
    const aiService = createAIService(aiConfig, activeModel);

    const systemPrompt = PROMPT_TEMPLATES.FORESHADOWING_DETECT(content, pendingForeshadowing);
    const userMessage = `请分析内容并返回结果。`;

    try {
      const response = await aiService.chat([
        { role: 'user', content: userMessage }
      ], systemPrompt);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { newForeshadowing: [], reveals: [] };
    } catch (error) {
      console.error('Failed to detect foreshadowing:', error);
      return { newForeshadowing: [], reveals: [] };
    }
  }

  /**
   * 自动识别冲突
   * 
   * @param {string} content - 章节内容
   * @returns {Promise<object>} - { newConflicts: [], updates: [] }
   */
  async detectConflicts(content) {
    const { aiConfig, customModels } = useSettingsStore.getState();
    const activeModel = customModels.find(m => m.id === aiConfig.activeModelId);
    const aiService = createAIService(aiConfig, activeModel);

    const systemPrompt = `请分析以下小说章节内容，识别并提取冲突（矛盾）。
    返回 JSON 格式，包含新冲突（newConflicts）和现有冲突状态更新（updates）。
    
    章节内容：
    """
    ${content}
    """`;

    try {
      const response = await aiService.chat([
        { role: 'user', content: '请提取冲突。' }
      ], systemPrompt);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { newConflicts: [], updates: [] };
    } catch (error) {
      console.error('Failed to detect conflicts:', error);
      return { newConflicts: [], updates: [] };
    }
  }
}

export const plotDetectService = new PlotDetectService();
export default plotDetectService;
