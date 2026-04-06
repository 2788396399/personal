/* src/services/agent/ActionMap.js */

import useOutlineStore from '../../stores/outlineStore';
import useCharacterStore from '../../stores/characterStore';
import usePlotStore from '../../stores/plotStore';
import useKnowledgeStore from '../../stores/knowledgeStore';
import useProjectStore from '../../stores/projectStore';

/**
 * Maps AI tags to actual Store operations.
 */
const ActionMap = {
  // --- 独立属性修改 (Independent Property Updates) ---
  
  // 修改作品标题
  'update_title': (projectId, data) => {
    const title = typeof data === 'object' ? data.title : data;
    useProjectStore.getState().updateProject(projectId, { name: title });
    useOutlineStore.getState().updateBookOutline(projectId, { title });
  },

  // 修改作品简介/梗概
  'update_synopsis': (projectId, data) => {
    const synopsis = typeof data === 'object' ? data.synopsis : data;
    useProjectStore.getState().updateProject(projectId, { description: synopsis });
    useOutlineStore.getState().updateBookOutline(projectId, { synopsis });
  },

  // 修改题材
  'update_genre': (projectId, data) => {
    const genre = typeof data === 'object' ? data.genre : data;
    useProjectStore.getState().updateProject(projectId, { genre });
    useOutlineStore.getState().updateBookOutline(projectId, { genre });
  },

  // 修改主题
  'update_theme': (projectId, data) => {
    const theme = typeof data === 'object' ? data.theme : data;
    useProjectStore.getState().updateProject(projectId, { theme });
    useOutlineStore.getState().updateBookOutline(projectId, { theme });
  },

  // --- 结构化数据修改 (Structured Data Updates) ---

  // 更新全书大纲 (保留此项用于批量更新或深度大纲修改)
  'update_outline': (projectId, data) => {
    // 如果 data 中包含基本信息，同步更新项目信息
    const projectUpdates = {};
    if (data.title) projectUpdates.name = data.title;
    if (data.synopsis) projectUpdates.description = data.synopsis;
    if (data.genre) projectUpdates.genre = data.genre;
    if (data.theme) projectUpdates.theme = data.theme;
    if (data.estimatedWordCount) projectUpdates.targetWordCount = data.estimatedWordCount;

    if (Object.keys(projectUpdates).length > 0) {
      useProjectStore.getState().updateProject(projectId, projectUpdates);
    }

    return useOutlineStore.getState().updateBookOutline(projectId, data);
  },
  
  'add_chapter_outline': (projectId, data) => 
    useOutlineStore.getState().addChapterOutline(projectId, data),

  // Character actions
  'add_character': (projectId, data) => 
    useCharacterStore.getState().createCharacter({ ...data, projectId }),

  'update_character': (projectId, data) => 
    useCharacterStore.getState().updateCharacter(data.id, data),

  // Plot actions
  'add_foreshadowing': (projectId, data) => 
    usePlotStore.getState().addForeshadowing(projectId, data),

  'add_conflict': (projectId, data) => 
    usePlotStore.getState().addConflict(projectId, data),

  // Knowledge actions
  'add_world_setting': (projectId, data, chapterId) => {
    // Get chapter number from project store if possible
    const projects = useProjectStore.getState().projects;
    const project = projects.find(p => p.id === projectId);
    const chapter = project?.chapters?.find(c => c.id === chapterId);
    const chapterNumber = chapter?.chapterNumber || 1;

    return useKnowledgeStore.getState().addWorldSetting(projectId, data, { chapterId, chapterNumber });
  },

  'add_entity': (projectId, data, chapterId) => {
    const projects = useProjectStore.getState().projects;
    const project = projects.find(p => p.id === projectId);
    const chapter = project?.chapters?.find(c => c.id === chapterId);
    const chapterNumber = chapter?.chapterNumber || 1;

    return useKnowledgeStore.getState().addEntity(projectId, data, { chapterId, chapterNumber });
  },

  'add_summary': (projectId, data, chapterId) => {
    const projects = useProjectStore.getState().projects;
    const project = projects.find(p => p.id === projectId);
    const chapter = project?.chapters?.find(c => c.id === chapterId);
    const chapterNumber = chapter?.chapterNumber || 1;

    return useKnowledgeStore.getState().addSummary(projectId, { 
      ...data, 
      chapterId, 
      chapterNumber 
    });
  },

  // Content actions (Handled in page level for reactivity, but mapped here)
  'update_chapter': (projectId, chapterId, content) => 
    useProjectStore.getState().updateChapter(projectId, chapterId, { content })
};

export default ActionMap;
