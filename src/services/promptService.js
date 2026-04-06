/* src/services/promptService.js */
import { PROMPT_TEMPLATES } from '../utils/promptTemplates';

/**
 * Prompt assembly service for AI小说创作助手
 * 
 * This service assembles prompts from various modules (characters, plot, outline, knowledge)
 * and manages token constraints.
 */
class PromptService {
  constructor() {
    this.weights = {
      outline: 0.2,
      character: 0.2,
      plot: 0.2,
      knowledge: 0.2,
      history: 0.2
    };
  }

  /**
   * Assemble a prompt for content generation with Agent capabilities
   * 
   * @param {object} params - data from stores
   * @returns {string} - formatted prompt
   */
  assembleContentPrompt(params) {
    const {
      projectId,
      chapterId,
      outline,
      characters,
      plot,
      knowledge,
      summaries,
      previousChapters, // Array of { chapterNumber, title, content }
      previousChapterTail,
      instruction
    } = params;

    const context = {
      projectId,
      chapterId,
      outline: outline ? this.formatOutline(outline) : '',
      characters: characters ? this.formatCharacters(characters) : '',
      plot: plot ? this.formatPlot(plot) : '',
      knowledge: knowledge ? this.formatKnowledge(knowledge) : '',
      summaries: summaries ? this.formatSummaries(summaries) : '',
      previousChapters: previousChapters ? this.formatPreviousChapters(previousChapters) : '',
      previousChapterTail: previousChapterTail || '',
      instruction
    };

    return PROMPT_TEMPLATES.AGENT_SYSTEM(context);
  }

  /**
   * Assemble a prompt for character extraction
   */
  assembleCharacterExtractPrompt(content) {
    return PROMPT_TEMPLATES.CHARACTER_EXTRACT(content);
  }

  /**
   * Assemble a prompt for chapter summary
   */
  assembleChapterSummaryPrompt(content) {
    return PROMPT_TEMPLATES.CHAPTER_SUMMARY(content);
  }

  /**
   * Assemble a prompt for Agent interaction
   */
  assembleAgentPrompt(params) {
    return this.assembleContentPrompt(params);
  }

  // Helper formatting methods
  formatOutline(outline) {
    if (!outline) return '';
    if (typeof outline === 'string') return outline;

    // Handle BookOutline structure
    let result = '';
    if (outline.title) result += `《${outline.title}》\n`;
    if (outline.synopsis) result += `梗概：${outline.synopsis}\n`;
    
    // If it's a specific chapter outline
    if (outline.chapterNumber) {
      result += `[当前章节大纲: 第${outline.chapterNumber}章 ${outline.title || ''}]\n`;
      if (outline.targetWordCount) result += `目标字数：${outline.targetWordCount}\n`;
      if (outline.objective) result += `目标：${outline.objective}\n`;
      if (outline.plotPoints?.length > 0) {
        result += `情节点：\n${outline.plotPoints.map(p => `  - ${p}`).join('\n')}\n`;
      }
    }

    return result;
  }

  formatKnowledge(knowledge) {
    if (!knowledge) return '';
    const { worldSettings = [], entities = [] } = knowledge;
    
    let result = '';
    if (worldSettings.length > 0) {
      result += '【世界设定】\n' + worldSettings.map(s => `- ${s.title}: ${s.content}`).join('\n') + '\n';
    }
    if (entities.length > 0) {
      result += '【知识实体】\n' + entities.map(e => `- ${e.name} (${e.type}): ${e.description}`).join('\n') + '\n';
    }
    return result;
  }

  formatCharacters(characters) {
    if (Array.isArray(characters)) {
      return characters.map(c => {
        const traits = c.personality?.traits?.join('、') || '';
        return `- ${c.name}: ${c.identity || ''}${traits ? ` (性格: ${traits})` : ''}${c.arc?.goal ? ` [目标: ${c.arc.goal}]` : ''}`;
      }).join('\n');
    }
    return characters;
  }

  formatPlot(plot) {
    if (!plot) return '';
    const { activeConflicts = [], pendingForeshadowing = [] } = plot;
    
    let result = '';
    if (activeConflicts.length > 0) {
      result += '【活跃冲突】\n' + activeConflicts.map(c => `- ${c.parties?.join('VS') || c.description}: ${c.description}`).join('\n') + '\n';
    }
    if (pendingForeshadowing.length > 0) {
      result += '【待回收伏笔】\n' + pendingForeshadowing.map(f => `- ${f.content}`).join('\n') + '\n';
    }
    return result;
  }

  formatSummaries(summaries) {
    if (Array.isArray(summaries)) {
      return summaries.map(s => `第${s.chapterNumber}章: ${s.oneLine || s.oneLineSummary}`).join('\n');
    }
    return summaries;
  }

  formatPreviousChapters(chapters) {
    if (!Array.isArray(chapters) || chapters.length === 0) return '';
    return chapters.map(c => `[第${c.chapterNumber}章 ${c.title || ''} 正文回顾]\n${c.content}\n---`).join('\n\n');
  }
}

export const promptService = new PromptService();
export default promptService;
