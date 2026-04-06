/* src/components/Log/LogPanel/LogPanel.jsx */
import React from 'react';
import useAILogStore from '../../../stores/aiLogStore';
import LogCard from '../LogCard/LogCard';
import Button from '../../common/Button/Button';
import './LogPanel.css';

const LogPanel = ({ projectId }) => {
  const { logs, confirmLog, undoLog, clearLogs } = useAILogStore();

  // Filter logs for this project
  const projectLogs = logs.filter(log => log.projectId === projectId);

  return (
    <div className="log-panel">
      <div className="log-panel-header">
        <h3 className="log-panel-title">操作日志</h3>
        {projectLogs.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearLogs}>
            清空
          </Button>
        )}
      </div>

      <div className="log-list">
        {projectLogs.length > 0 ? (
          projectLogs.map((log) => (
            <LogCard 
              key={log.id} 
              log={log} 
              onConfirm={confirmLog}
              onUndo={undoLog}
            />
          ))
        ) : (
          <div className="log-empty">
            暂无操作记录。AI 的自动操作和建议确认后将记录在此。
          </div>
        )}
      </div>
    </div>
  );
};

export default LogPanel;
