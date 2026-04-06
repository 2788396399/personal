/* src/hooks/useAIPermission.js */
import { useCallback } from 'react';
import useSettingsStore from '../stores/settingsStore';
import useAILogStore from '../stores/aiLogStore';

/**
 * AI Permission Hook
 * 
 * Manages checking AI permissions and recording operations.
 */
const useAIPermission = () => {
  const { aiPermissions } = useSettingsStore();
  const { addLog } = useAILogStore();

  /**
   * Check if an AI action requires manual confirmation
   * 
   * @param {string} permissionKey - Key in aiPermissions
   * @returns {boolean} - true if confirmation is required
   */
  const needsConfirmation = useCallback((permissionKey) => {
    // If key doesn't exist, default to confirmation required
    if (!(permissionKey in aiPermissions)) return true;
    
    return aiPermissions[permissionKey] === true;
  }, [aiPermissions]);

  /**
   * Record an AI operation to the log
   * 
   * @param {object} operation - operation details
   * { projectId, operationType, operationName, module, details }
   */
  const recordOperation = useCallback((operation) => {
    addLog({
      ...operation,
      userConfirmed: false,
      timestamp: new Date().toISOString()
    });
  }, [addLog]);

  /**
   * Check if an action can be performed automatically
   * 
   * @param {string} autoKey - Key in aiPermissions (e.g. 'autoApplyContent')
   * @returns {boolean} - true if can be performed automatically
   */
  const canAutoPerform = useCallback((autoKey) => {
    return aiPermissions[autoKey] === true;
  }, [aiPermissions]);

  return {
    aiPermissions,
    needsConfirmation,
    recordOperation,
    canAutoPerform
  };
};

export default useAIPermission;
