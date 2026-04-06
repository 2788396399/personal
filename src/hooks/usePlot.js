/* src/hooks/usePlot.js */
import { useMemo, useCallback } from 'react';
import usePlotStore from '../stores/plotStore';

/**
 * Plot Operation Hook
 * 
 * Manages plot tracking, foreshadowing, and conflicts for a specific project.
 */
const usePlot = (projectId) => {
  const store = usePlotStore();
  
  const foreshadowing = useMemo(() => 
    store.getForeshadowingByProjectId(projectId), 
    [store, projectId]
  );

  const pendingForeshadowing = useMemo(() => 
    store.getPendingForeshadowing(projectId), 
    [store, projectId]
  );

  const conflicts = useMemo(() => 
    store.getConflictsByProjectId(projectId), 
    [store, projectId]
  );

  const activeConflicts = useMemo(() => 
    store.getActiveConflicts(projectId), 
    [store, projectId]
  );

  /**
   * 添加新伏笔
   */
  const addForeshadowing = useCallback((data) => {
    store.addForeshadowing(projectId, data);
  }, [projectId, store]);

  /**
   * 添加新冲突
   */
  const addConflict = useCallback((data) => {
    store.addConflict(projectId, data);
  }, [projectId, store]);

  /**
   * 标记伏笔已揭示
   */
  const revealForeshadowing = useCallback((id, chapterId) => {
    store.updateForeshadowing(id, { 
      status: 'revealed', 
      revealChapter: chapterId 
    });
  }, [store]);

  /**
   * 解决冲突
   */
  const resolveConflict = useCallback((id, chapterId, resolution) => {
    store.updateConflict(id, { 
      status: 'resolved', 
      resolveChapter: chapterId,
      resolution
    });
  }, [store]);

  /**
   * 获取情节概况
   */
  const stats = useMemo(() => ({
    totalForeshadowing: foreshadowing.length,
    pendingForeshadowing: pendingForeshadowing.length,
    revealedForeshadowing: foreshadowing.length - pendingForeshadowing.length,
    totalConflicts: conflicts.length,
    activeConflicts: activeConflicts.length,
    resolvedConflicts: conflicts.length - activeConflicts.length
  }), [foreshadowing, pendingForeshadowing, conflicts, activeConflicts]);

  return {
    foreshadowing,
    pendingForeshadowing,
    conflicts,
    activeConflicts,
    addForeshadowing,
    addConflict,
    revealForeshadowing,
    resolveConflict,
    updateForeshadowing: store.updateForeshadowing,
    updateConflict: store.updateConflict,
    deleteForeshadowing: store.deleteForeshadowing,
    deleteConflict: store.deleteConflict,
    stats
  };
};

export default usePlot;
