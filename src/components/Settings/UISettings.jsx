import React from 'react'
import './UISettings.css'

function UISettings({ settings, onUpdateSettings }) {
  return (
    <div className="ui-settings">
      {/* Font Size */}
      <div className="setting-group">
        <label className="setting-label">
          字体大小: {settings.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="24"
          step="1"
          value={settings.fontSize}
          onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value) })}
          className="setting-range"
        />
      </div>

      {/* Line Spacing */}
      <div className="setting-group">
        <label className="setting-label">
          行间距: {settings.lineSpacing}
        </label>
        <input
          type="range"
          min="1"
          max="2.5"
          step="0.1"
          value={settings.lineSpacing}
          onChange={(e) => onUpdateSettings({ lineSpacing: parseFloat(e.target.value) })}
          className="setting-range"
        />
      </div>

      {/* Auto Save Toggle */}
      <div className="setting-toggle-group">
        <div className="setting-toggle-info">
          <div className="setting-toggle-title">自动保存</div>
          <div className="setting-toggle-desc">自动保存对话和内容</div>
        </div>
        <button
          onClick={() => onUpdateSettings({ autoSave: !settings.autoSave })}
          className={`toggle-btn ${settings.autoSave ? 'active' : ''}`}
        >
          <div className={`toggle-indicator ${settings.autoSave ? 'active' : ''}`} />
        </button>
      </div>

      {/* Word Count Toggle */}
      <div className="setting-toggle-group">
        <div className="setting-toggle-info">
          <div className="setting-toggle-title">显示字数</div>
          <div className="setting-toggle-desc">显示章节字数统计</div>
        </div>
        <button
          onClick={() => onUpdateSettings({ showWordCount: !settings.showWordCount })}
          className={`toggle-btn ${settings.showWordCount ? 'active' : ''}`}
        >
          <div className={`toggle-indicator ${settings.showWordCount ? 'active' : ''}`} />
        </button>
      </div>
    </div>
  )
}

export default UISettings
