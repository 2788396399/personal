import React, { useState } from 'react'
import { Plus, ChevronDown, ChevronRight, Edit2, Trash2, Shield, Cpu, Sparkles, Globe } from 'lucide-react'
import './ModelManager.css'

function ModelManager({ 
  customModels, 
  onAddModel, 
  onEditModel, 
  onDeleteModel, 
  onToggleModel 
}) {
  const [isCustomExpanded, setIsCustomExpanded] = useState(true)

  return (
    <div className="model-manager">
      <div className="model-manager-header">
        <button onClick={onAddModel} className="add-model-btn">
          <Plus size={16} />
          <span>添加模型</span>
        </button>
      </div>

      <div className="model-table">
        <div className="table-header">
          <div className="col-model">模型名称</div>
          <div className="col-actions text-center">操作</div>
        </div>

        {/* Custom Section */}
        <div className="table-section">
          <div className="section-header" onClick={() => setIsCustomExpanded(!isCustomExpanded)}>
            {isCustomExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span>自定义模型</span>
          </div>
          
          {isCustomExpanded && (
            <div className="section-content">
              {customModels.length === 0 ? (
                <div className="empty-row">还可以通过上方按钮添加自定义模型</div>
              ) : (
                customModels.map((model) => (
                  <div key={model.id} className="model-row custom">
                    <div className="col-model">
                      <div className="model-info-main">
                        <Shield size={16} className="provider-icon custom-model" />
                        <span className="model-name">{model.name}</span>
                      </div>
                      <div className="model-info-sub">
                        <span className="model-id-tag">{model.model}</span>
                        <span className="model-url-hint">{model.baseUrl}</span>
                      </div>
                    </div>
                    <div className="col-actions">
                      <div className="actions-group">
                        <button 
                          onClick={() => onEditModel(model)} 
                          className="action-icon-btn" 
                          title="编辑"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => onDeleteModel(model.id)} 
                          className="action-icon-btn danger" 
                          title="删除"
                        >
                          <Trash2 size={13} />
                        </button>
                        <div className="toggle-container">
                          <input
                            type="checkbox"
                            role="switch"
                            id={`toggle-${model.id}`}
                            checked={model.enabled !== false}
                            onChange={() => onToggleModel(model.id)}
                            className="toggle-switch"
                          />
                          <label htmlFor={`toggle-${model.id}`} className="toggle-slider"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModelManager

