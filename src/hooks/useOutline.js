/* src/hooks/useOutline.js */
import { useMemo, useCallback } from 'react';
import useOutlineStore from '../stores/outlineStore';

/**
 * Outline Operation Hook
 * 
 * Manages outline operations for a specific project.
 */
const useOutline = (projectId) => {
  const store = useOutlineStore();
  
  const bookOutline = useMemo(() => 
    store.getOutlineByProjectId(projectId), 
    [store, projectId]
  );

  const chapters = useMemo(() => 
    bookOutline?.chapters || [], 
    [bookOutline]
  );

  /**
   * 初始化项目大纲
   */
  const initOutline = useCallback((data) => {
    if (!bookOutline) {
      store.createBookOutline(projectId, data);
    }
  }, [bookOutline, projectId, store]);

  /**
   * 更新全书大纲信息
   */
  const updateBookOutline = useCallback((updates) => {
    store.updateBookOutline(projectId, updates);
  }, [projectId, store]);

  /**
   * 添加新章节大纲
   */
  const addChapterOutline = useCallback((data) => {
    store.addChapterOutline(projectId, data);
  }, [projectId, store]);

  /**
   * 更新指定章节大纲
   */
  const updateChapterOutline = useCallback((id, updates) => {
    store.updateChapterOutline(projectId, id, updates);
  }, [projectId, store]);

  /**
   * 删除指定章节大纲
   */
  const deleteChapterOutline = useCallback((id) => {
    store.deleteChapterOutline(projectId, id);
  }, [projectId, store]);

  /**
   * 获取统计信息
   */
  const stats = useMemo(() => {
    if (!bookOutline) return null;
    
    const totalChapters = bookOutline.chapters.length;
    const completedChapters = bookOutline.chapters.filter(c => c.status === 'completed').length;
    const totalWords = bookOutline.chapters.reduce((sum, c) => sum + (c.actualWordCount || 0), 0);
    
    return {
      totalChapters,
      completedChapters,
      totalWords,
      progress: totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0,
      wordCountProgress: bookOutline.estimatedWordCount > 0 
        ? (totalWords / bookOutline.estimatedWordCount) * 100 
        : 0
    };
  }, [bookOutline]);

  return {
    bookOutline,
    chapters,
    initOutline,
    createBookOutline: initOutline, // 兼容旧代码
    updateBookOutline,
    addChapterOutline,
    updateChapterOutline,
    deleteChapterOutline,
    stats
  };
};

export default useOutline;
