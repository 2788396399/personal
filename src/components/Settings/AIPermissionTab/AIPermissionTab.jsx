/* src/components/Settings/AIPermissionTab/AIPermissionTab.jsx */
import React from 'react';
import useSettingsStore from '../../../stores/settingsStore';
import './AIPermissionTab.css';

const AIPermissionTab = () => {
  const { aiPermissions = {}, updateAIPermissions } = useSettingsStore();

  const handleToggle = (key) => {
    updateAIPermissions({ [key]: !aiPermissions[key] });
  };

  const permissionGroups = [
    {
      title: '内容生成',
      items: [
        { key: 'autoApplyContent', label: '自动应用内容', description: 'AI 生成内容后自动更新到正文' },
        { key: 'showAIReasoning', label: '显示推理过程', description: '在聊天界面显示 AI 的思考过程' },
        { key: 'allowReadAllChapters', label: '获取所有章节正文', description: '允许 AI 读取项目中所有已创作章节的完整正文内容' },
      ]
    },
    {
      title: '角色管理',
      items: [
        { key: 'autoExtractCharacter', label: '自动提取角色', description: '写作完成后自动识别并提取新角色' },
        { key: 'confirmCharacterChange', label: '变更前确认', description: '修改已有角色信息前需手动确认' },
      ]
    },
    {
      title: '情节追踪',
      items: [
        { key: 'autoDetectPlot', label: '自动识别情节', description: '自动分析章节中的重要情节点和伏笔' },
        { key: 'confirmForeshadowingChange', label: '伏笔变更确认', description: '伏笔状态更新（如揭示）前需确认' },
        { key: 'showConsistencyWarning', label: '显示一致性警告', description: '当情节与设定发生冲突时显示警告' },
      ]
    },
    {
      title: '知识库与摘要',
      items: [
        { key: 'autoGenerateSummary', label: '自动生成摘要', description: '章节完成后自动生成剧情梗概' },
        { key: 'autoDetectEntity', label: '自动识别实体', description: '自动提取章节中的地点、道具、组织等实体' },
        { key: 'showSettingConflict', label: '设定冲突警告', description: '当新内容违反既有世界设定时提示' },
      ]
    }
  ];

  return (
    <div className="ai-permission-tab">
      <h3 className="settings-section-title">AI 权限与自动化设置</h3>

      <div className="permission-groups">
        {permissionGroups.map(group => (
          <div key={group.title} className="permission-group">
            <h4 className="permission-group-title">{group.title}</h4>
            <div className="permission-items">
              {group.items.map(item => (
                <div key={item.key} className="permission-item">
                  <div className="permission-info">
                    <span className="permission-label">{item.label}</span>
                    <p className="permission-desc">{item.description}</p>
                  </div>
                  <label className="ai-toggle-switch">
                    <input
                      type="checkbox"
                      checked={aiPermissions[item.key]}
                      onChange={() => handleToggle(item.key)}
                    />
                    <span className="ai-toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPermissionTab;
