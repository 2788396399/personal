/* src/services/agent/AgentService.js */

import Parser from './Parser';
import ActionMap from './ActionMap';

/**
 * Main Agent Service for coordinating AI actions and Store operations.
 */
const AgentService = {
  /**
   * Parse AI text for actions and process them.
   * @param {string} text - AI text
   * @param {string} projectId - Current project ID
   * @param {string} chapterId - Current chapter ID
   * @returns {Array} List of identified actions
   */
  detectActions(text, projectId, chapterId) {
    if (!text) return [];

    const parsedActions = Parser.parse(text);
    
    // Add context to each action for the Confirm UI
    return parsedActions.map(action => ({
      ...action,
      projectId,
      chapterId,
      label: this._getActionLabel(action.type),
      execute: () => this._execute(action, projectId, chapterId)
    }));
  },

  /**
   * Execute an action directly.
   */
  async _execute(action, projectId, chapterId) {
    const handler = ActionMap[action.type];
    if (handler) {
      if (action.type === 'update_chapter') {
        return handler(projectId, chapterId, action.data);
      }
      
      // For actions that need chapter context
      if (['add_world_setting', 'add_entity', 'add_summary'].includes(action.type)) {
        return handler(projectId, action.data, chapterId);
      }

      return handler(projectId, action.data);
    }
    console.warn(`No handler found for action type: ${action.type}`);
    return null;
  },

  /**
   * Get human-readable label for the action type.
   */
  _getActionLabel(type) {
    const labels = {
      'update_title': '修改作品标题',
      'update_synopsis': '修改作品简介',
      'update_genre': '修改题材',
      'update_theme': '修改主题',
      'update_outline': '更新全书大纲',
      'add_chapter_outline': '添加章节大纲',
      'add_character': '创建角色卡片',
      'update_character': '更新角色卡片',
      'add_foreshadowing': '添加情节伏笔',
      'add_conflict': '记录矛盾冲突',
      'add_world_setting': '添加世界设定',
      'add_entity': '添加知识实体',
      'add_summary': '更新章节摘要',
      'update_chapter': '生成/更新正文内容'
    };
    return labels[type] || `执行操作: ${type}`;
  },

  /**
   * Utility for cleaning text before display
   */
  cleanDisplayContent(text) {
    return Parser.cleanText(text);
  }
};

export default AgentService;
