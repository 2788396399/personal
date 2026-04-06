/* src/components/Layout/Navigation/Navigation.jsx */
import React from 'react';
import './Navigation.css';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'editor', label: '正文', icon: '📝' },
    { id: 'characters', label: '角色', icon: '👥' },
    { id: 'outline', label: '大纲', icon: '📋' },
    { id: 'plot', label: '情节', icon: '🧵' },
    { id: 'knowledge', label: '知识库', icon: '📚' },
    { id: 'logs', label: '日志', icon: '📜' }
  ];

  return (
    <nav className="navigation">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'is-active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-item-icon">{tab.icon}</span>
          <span className="nav-item-label">{tab.label}</span>
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
