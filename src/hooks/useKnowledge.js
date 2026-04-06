/* src/hooks/useKnowledge.js */
import { useMemo, useCallback } from 'react';
import useKnowledgeStore from '../stores/knowledgeStore';

/**
 * Knowledge Base Operation Hook
 * 
 * Manages world settings, entities, and chapter summaries.
 */
const useKnowledge = (projectId) => {
  const store = useKnowledgeStore();
  
  const data = useMemo(() => 
    store.getKnowledgeByProjectId(projectId), 
    [store, projectId]
  );

  const worldSettings = data.worldSettings;
  const entities = data.entities;
  const summaries = data.summaries;

  /**
   * 添加/更新世界设定
   */
  const saveWorldSetting = useCallback((data) => {
    if (data.id) {
      store.updateWorldSetting(data.id, data);
    } else {
      store.addWorldSetting(projectId, data);
    }
  }, [projectId, store]);

  /**
   * 添加/更新实体
   */
  const saveEntity = useCallback((data) => {
    if (data.id) {
      store.updateEntity(data.id, data);
    } else {
      store.addEntity(projectId, data);
    }
  }, [projectId, store]);

  /**
   * 添加章节摘要
   */
  const addChapterSummary = useCallback((data) => {
    store.addSummary(projectId, data);
  }, [projectId, store]);

  /**
   * 获取所有实体的名称（用于快速匹配）
   */
  const entityNames = useMemo(() => 
    entities.map(e => e.name), 
    [entities]
  );

  return {
    worldSettings,
    entities,
    summaries,
    entityNames,
    saveWorldSetting,
    saveEntity,
    deleteWorldSetting: store.deleteWorldSetting,
    deleteEntity: store.deleteEntity,
    addChapterSummary,
    updateSummary: store.updateSummary
  };
};

export default useKnowledge;
