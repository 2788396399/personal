/* src/App.jsx */
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useProjectStore from './stores/projectStore';
import storageService from './services/storageService';

import ProjectManagement from './pages/ProjectManagement/ProjectManagement';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import ChapterPage from './pages/ChapterPage/ChapterPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import './App.css';

function App() {
  // Initialize storage
  useEffect(() => {
    storageService.init().catch(console.error);
  }, []);

  return (
    <div className="app">
      <Routes>
        {/* 作品管理页 */}
        <Route path="/" element={<ProjectManagement />} />
        
        {/* 作品详情页 */}
        <Route path="/project/:id" element={<ProjectDetail />} />
        
        {/* 章节写作页 */}
        <Route path="/project/:id/chapter/:chapterId" element={<ChapterPage />} />
        
        {/* 系统设置页 */}
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* 404 重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
