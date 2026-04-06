import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Cpu, Globe, Layers } from 'lucide-react'
import { useDraggable } from '../../hooks/useDraggable'
import AIConfig from './AIConfig'
import UISettings from './UISettings'
import ModelManager from './ModelManager'
import AddModelModal from './AddModelModal'
import './SettingsPanel.css'

function SettingsPanel({ isOpen, onClose, settings, onUpdateSettings }) {
  const [activeTab, setActiveTab] = useState('ai')
  const [testStatus, setTestStatus] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingModel, setEditingModel] = useState(null)

  const portalTarget = typeof document !== 'undefined' ? document.body : null
  const previousFocusRef = useRef(null)
  const modalRef = useRef(null)
  const headerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const { style: dragStyle, handleProps } = useDraggable(modalRef, headerRef, isOpen)

  const customModels = settings.customModels || []

  useEffect(() => {
    if (!isOpen || !portalTarget) return

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const frame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = Array.from(
        modalRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') || []
      ).filter((element) => element.offsetParent !== null || document.activeElement === element)

      if (focusableElements.length === 0) {
        event.preventDefault()
        modalRef.current?.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [isOpen, onClose, portalTarget])

  const handleOpenAddModel = () => {
    setEditingModel(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModel = (model) => {
    setEditingModel(model)
    setIsModalOpen(true)
  }

  const handleSaveModel = (modelData) => {
    let newCustomModels
    if (editingModel) {
      newCustomModels = customModels.map(m =>
        m.id === editingModel.id ? { ...modelData, id: m.id, provider: 'openai' } : m
      )
    } else {
      const newModel = {
        ...modelData,
        id: `custom-${Date.now()}`,
        provider: 'openai'
      }
      newCustomModels = [...customModels, newModel]
    }

    onUpdateSettings({ customModels: newCustomModels })
    setIsModalOpen(false)
  }

  const handleDeleteModel = (id) => {
    const newCustomModels = customModels.filter(m => m.id !== id)
    onUpdateSettings({ customModels: newCustomModels })
  }

  const handleToggleModel = (id) => {
    const newCustomModels = customModels.map(m =>
      m.id === id ? { ...m, enabled: m.enabled === false } : m
    )
    onUpdateSettings({ customModels: newCustomModels })
  }

  if (!isOpen || !portalTarget) return null

  const tabs = [
    { id: 'ai', label: 'AI配置', icon: Cpu },
    { id: 'models', label: '模型管理', icon: Layers },
    { id: 'ui', label: '界面设置', icon: Globe }
  ]

  return createPortal(
    <div className="settings-overlay">
      <div
        ref={modalRef}
        className="settings-modal"
        onClick={(event) => event.stopPropagation()}
        style={dragStyle}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="settings-header" ref={headerRef} {...handleProps} style={{ cursor: 'grab' }}>
          <h2 className="settings-title">设置</h2>
          <button ref={closeButtonRef} onClick={onClose} className="settings-close-btn" data-no-drag>
            <X size={20} />
          </button>
        </div>

        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'ai' && (
            <AIConfig
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              testStatus={testStatus}
              onTestConnection={() => { }}
              onSetTestStatus={setTestStatus}
            />
          )}

          {activeTab === 'models' && (
            <ModelManager
              customModels={customModels}
              onAddModel={handleOpenAddModel}
              onEditModel={handleOpenEditModel}
              onDeleteModel={handleDeleteModel}
              onToggleModel={handleToggleModel}
            />
          )}

          {activeTab === 'ui' && (
            <UISettings
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          )}
        </div>

        <AddModelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveModel}
          editingModel={editingModel}
        />
      </div>
    </div>,
    portalTarget
  )
}

export default SettingsPanel
