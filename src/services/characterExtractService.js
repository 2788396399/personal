/* src/services/characterExtractService.js */
import { createAIService } from './ai/aiService';
import useSettingsStore from '../stores/settingsStore';
import { PROMPT_TEMPLATES } from '../utils/promptTemplates';

class CharacterExtractService {
  /**
   * AI 生成角色卡片
   * 
   * @param {object} basicInfo - { name, description }
   * @param {object} projectContext - { genre, worldBuilding, style }
   * @returns {Promise<object>} - 完整的角色卡片数据
   */
  async generateCharacter(basicInfo, projectContext) {
    const { aiConfig, customModels } = useSettingsStore.getState();
    const activeModel = customModels.find(m => m.id === aiConfig.activeModelId);
    const aiService = createAIService(aiConfig, activeModel);

    const systemPrompt = `你是一个小说创作专家。请根据以下基本信息和项目背景，生成一个详细的角色卡片数据。
    返回 JSON 格式，包含基本信息、性格特征、背景故事、角色弧光等。
    
    基本信息：${JSON.stringify(basicInfo)}
    项目背景：${JSON.stringify(projectContext)}
    
    返回格式示例：
    {
      "name": "李明",
      "gender": "男",
      "age": "25",
      "identity": "实习医生",
      "appearance": "清秀的面庞，总是带着一丝疲惫...",
      "personality": {
        "traits": ["善良", "温和", "严谨"],
        "habits": ["紧张时会推眼镜", "喜欢随手记录"],
        "catchphrases": ["生命只有一次"]
      },
      "background": {
        "origin": "出生于医学世家，从小耳濡目染...",
        "experiences": [],
        "secrets": ["其实他晕血，一直在通过意志力克服"]
      },
      "arc": {
        "goal": "成为一名优秀的胸外科医生，救治更多人",
        "innerConflict": "对父亲权威的挑战与对医学的热爱之间的矛盾",
        "growthTrack": "从一个青涩的实习生成长为独当一面的大医"
      }
    }`;

    try {
      const response = await aiService.chat([
        { role: 'user', content: '请生成角色卡片数据。' }
      ], systemPrompt);

      // 提取 JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('AI 返回的格式不正确');
    } catch (error) {
      console.error('Failed to generate character:', error);
      throw error;
    }
  }

  /**
   * 从内容提取角色信息
   * 
   * @param {string} content - 章节内容
   * @param {Array} existingCharacters - 现有角色列表（用于比对和更新）
   * @returns {Promise<object>} - { newCharacters: [], updates: [] }
   */
  async extractFromContent(content, existingCharacters) {
    const { aiConfig, customModels } = useSettingsStore.getState();
    const activeModel = customModels.find(m => m.id === aiConfig.activeModelId);
    const aiService = createAIService(aiConfig, activeModel);

    const systemPrompt = PROMPT_TEMPLATES.CHARACTER_EXTRACT(content);
    const userMessage = `请分析并提取其中的角色信息。现有角色列表：${existingCharacters.map(c => c.name).join(', ')}`;

    try {
      const response = await aiService.chat([
        { role: 'user', content: userMessage }
      ], systemPrompt);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { newCharacters: [], updates: [] };
    } catch (error) {
      console.error('Failed to extract characters:', error);
      return { newCharacters: [], updates: [] };
    }
  }

  /**
   * 生成角色信息摘要（用于 Prompt 注入）
   * 
   * @param {object} character - 角色卡片数据
   * @returns {string} - 角色摘要字符串
   */
  generateSummary(character) {
    if (!character) return '';
    
    const { name, identity, gender, age, personality, arc } = character;
    let summary = `${name} (${identity || '身份未知'}, ${gender || '性别未知'}, ${age || '年龄未知'}): `;
    
    if (personality?.traits?.length > 0) {
      summary += `性格${personality.traits.join('、')}。`;
    }
    
    if (arc?.goal) {
      summary += `核心目标是${arc.goal}。`;
    }
    
    return summary;
  }
}

export const characterExtractService = new CharacterExtractService();
export default characterExtractService;
