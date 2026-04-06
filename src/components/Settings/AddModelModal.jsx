import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Save } from 'lucide-react'
import { useDraggable } from '../../hooks/useDraggable'
import './AddModelModal.css'

function AddModelModal({ isOpen, onClose, onSave, editingModel }) {
  const [formData, setFormData] = useState({
    name: '',
    baseUrl: '',
    apiKey: '',
    model: '',
    enabled: true
  })
  const portalTarget = typeof document !== 'undefined' ? document.body : null
  const modalRef = useRef(null)
  const headerRef = useRef(null)
  const { style: dragStyle, handleProps } = useDraggable(modalRef, headerRef, isOpen)

  useEffect(() => {
    if (editingModel) {
      setFormData({
        name: editingModel.name || '',
        baseUrl: editingModel.baseUrl || '',
        apiKey: editingModel.apiKey || '',
        model: editingModel.model || '',
        enabled: editingModel.enabled !== false
      })
    } else {
      setFormData({
        name: '',
        baseUrl: '',
        apiKey: '',
        model: '',
        enabled: true
      })
    }
  }, [editingModel, isOpen])

  // ESC键关闭功能（可选保留，提升无障碍体验）
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !portalTarget) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return createPortal(
    // 移除 onClick={onClose}，点击背景不再关闭弹窗
    <div className="add-model-overlay">
      <div
        ref={modalRef}
        className="add-model-modal"
        onClick={(e) => e.stopPropagation()}
        style={dragStyle}
      >
        <div className="add-model-header" ref={headerRef} {...handleProps}>
          <h2 className="add-model-title">
            {editingModel ? '编辑 AI 模型' : '添加 AI 模型'}
          </h2>
          {/* 关闭按钮仍然保留关闭功能 */}
          <button className="add-model-close" onClick={onClose} style={{ cursor: 'pointer' }} data-no-drag>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-model-body">
          <div className="add-model-form-group">
            <label className="add-model-label">
              配置名称 <span className="add-model-required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例如：我的 DeepSeek 配置"
              className="add-model-input"
              required
              autoFocus
            />
          </div>

          <div className="add-model-form-group">
            <label className="add-model-label">
              模型标识 (Model Name) <span className="add-model-required">*</span>
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="例如：deepseek-chat, gpt-4o"
              className="add-model-input"
              required
            />
          </div>

          <div className="add-model-form-group">
            <label className="add-model-label">
              接口地址 (Base URL) <span className="add-model-required">*</span>
            </label>
            <input
              type="text"
              name="baseUrl"
              value={formData.baseUrl}
              onChange={handleChange}
              placeholder="https://api.openai.com/v1"
              className="add-model-input"
              required
            />
          </div>

          <div className="add-model-form-group">
            <label className="add-model-label">
              API 密钥 (API Key) <span className="add-model-required">*</span>
            </label>
            <input
              type="password"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="sk-..."
              className="add-model-input add-model-password-input"
              required
            />
          </div>

          <div className="add-model-footer">
            <button type="button" className="add-model-cancel" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="add-model-confirm">
              <Save size={16} />
              <span>保存配置</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    portalTarget
  )
}

export default AddModelModal