/* src/services/consistencyService.js */
import { createAIService } from './ai/aiService';
import useSettingsStore from '../stores/settingsStore';

class ConsistencyService {
  /**
   * 检查章节内容与已有设定的一致性
   * 
   * @param {string} content - 当前章节内容
   * @param {object} context - 包含大纲、角色、历史情节等上下文
   * @returns {Promise<Array>} - 冲突项列表 [{ type, severity, description, suggestion }]
   */
  async checkConsistency(content, context) {
    const { aiConfig, customModels } = useSettingsStore.getState();
    const activeModel = customModels.find(m => m.id === aiConfig.activeModelId);
    const aiService = createAIService(aiConfig, activeModel);

    const systemPrompt = `你是一个资深小说编辑。请检查当前章节内容与已知设定（大纲、角色、情节）之间是否存在冲突。
    
    【已知设定】
    ${JSON.stringify(context)}
    
    请分析当前章节内容，寻找逻辑漏洞、角色性格偏差、设定冲突或伏笔遗漏。
    返回 JSON 格式的列表。`;

    const userMessage = `当前章节内容：
    """
    ${content}
    """`;

    try {
      const response = await aiService.chat([
        { role: 'user', content: userMessage }
      ], systemPrompt);

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Consistency check failed:', error);
      return [];
    }
  }
}

export const consistencyService = new ConsistencyService();
export default consistencyService;
