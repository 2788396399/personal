/* src/components/Settings/AIConfigTab/AIConfigTab.jsx */
import React, { useState } from 'react';
import useSettingsStore from '../../../stores/settingsStore';
import ModelManager from '../ModelManager';
import AddModelModal from '../AddModelModal';
import Input from '../../common/Input/Input';
import './AIConfigTab.css';

const AIConfigTab = () => {
  const { 
    aiConfig, 
    customModels, 
    updateAIConfig, 
    addCustomModel, 
    updateCustomModel, 
    deleteCustomModel 
  } = useSettingsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);

  const handleAddModel = () => {
    setEditingModel(null);
    setIsModalOpen(true);
  };

  const handleEditModel = (model) => {
    setEditingModel(model);
    setIsModalOpen(true);
  };

  const handleSaveModel = (formData) => {
    if (editingModel) {
      updateCustomModel(editingModel.id, formData);
    } else {
      addCustomModel(formData);
    }
    setIsModalOpen(false);
  };

  const handleToggleModel = (id) => {
    // 切换模型的启用状态
    const model = customModels.find(m => m.id === id);
    if (model) {
      updateCustomModel(id, { enabled: !model.enabled });
    }
  };

  const handleSelectActiveModel = (e) => {
    updateAIConfig({ activeModelId: e.target.value });
  };

  return (
    <div className="ai-config-tab">
      <h3 className="settings-section-title">AI 模型管理</h3>
      
      <div className="settings-form-group">
        <label className="input-label">当前激活模型</label>
        <select 
          className="settings-select"
          value={aiConfig.activeModelId} 
          onChange={handleSelectActiveModel}
        >
          {customModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.model})
            </option>
          ))}
        </select>
        <p className="settings-hint">选择在创作和聊天中默认使用的 AI 配置</p>
      </div>

      <div className="settings-divider" />

      <h4 className="settings-subsection-title">模型列表</h4>
      <ModelManager 
        customModels={customModels}
        onAddModel={handleAddModel}
        onEditModel={handleEditModel}
        onDeleteModel={deleteCustomModel}
        onToggleModel={handleToggleModel}
      />

      <div className="settings-divider" />

      <h4 className="settings-subsection-title">全局生成参数</h4>
      <div className="settings-form-row">
        <div className="settings-form-col">
          <label className="input-label">Temperature ({aiConfig.temperature})</label>
          <input 
            type="range" 
            min="0" 
            max="1.5" 
            step="0.1" 
            value={aiConfig.temperature} 
            onChange={(e) => updateAIConfig({ temperature: parseFloat(e.target.value) })}
          />
        </div>
        <div className="settings-form-col">
          <Input
            label="Max Tokens"
            type="number"
            value={aiConfig.maxTokens}
            onChange={(e) => updateAIConfig({ maxTokens: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <AddModelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModel}
        editingModel={editingModel}
      />
    </div>
  );
};

export default AIConfigTab;
