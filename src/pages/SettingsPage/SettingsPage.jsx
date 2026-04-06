/* src/pages/SettingsPage/SettingsPage.jsx */
import React, { useState } from 'react';
import Header from '../../components/Layout/Header/Header';
import AIConfigTab from '../../components/Settings/AIConfigTab/AIConfigTab';
import AIPermissionTab from '../../components/Settings/AIPermissionTab/AIPermissionTab';
import useSettingsStore from '../../stores/settingsStore';
import './SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('ai-config');
  const { theme, setTheme, fontSize, updateUISettings } = useSettingsStore();

  const tabs = [
    { id: 'ai-config', label: 'AI 服务', icon: '🤖' },
    { id: 'ai-permission', label: 'AI 权限', icon: '🛡️' },
    { id: 'ui-settings', label: '界面设置', icon: '🎨' },
    { id: 'about', label: '关于', icon: 'ℹ️' },
  ];

  return (
    <div className="settings-page">
      <Header title="系统设置" showBack />
      
      <div className="settings-container">
        <aside className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </aside>

        <main className="settings-content">
          {activeTab === 'ai-config' && <AIConfigTab />}
          {activeTab === 'ai-permission' && <AIPermissionTab />}
          
          {activeTab === 'ui-settings' && (
            <div className="ui-settings-tab">
              <h3 className="settings-section-title">界面设置</h3>
              
              <div className="settings-form-group">
                <label className="input-label">主题模式</label>
                <div className="theme-options">
                  <button 
                    className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    ☀️ 明亮模式
                  </button>
                  <button 
                    className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    🌙 深色模式
                  </button>
                </div>
              </div>

              <div className="settings-form-group">
                <label className="input-label">编辑器字体大小 ({fontSize}px)</label>
                <input 
                  type="range" 
                  min="12" 
                  max="24" 
                  step="1" 
                  value={fontSize} 
                  onChange={(e) => updateUISettings({ fontSize: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="about-tab">
              <h3 className="settings-section-title">关于 AI 小说创作助手</h3>
              <p>版本: v1.0.0</p>
              <p>旨在为长篇小说创作提供智能化辅助，包括角色卡片管理、情节追踪、世界设定维护及 AI 辅助内容生成。</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
