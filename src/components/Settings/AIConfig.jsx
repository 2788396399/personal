import React, { useRef, useEffect } from 'react'
import { Check, AlertCircle } from 'lucide-react'
import './AIConfig.css'

function AIConfig({ settings, onUpdateSettings, testStatus, onTestConnection, onSetTestStatus }) {
  const testStatusTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (testStatusTimeoutRef.current) {
        clearTimeout(testStatusTimeoutRef.current)
      }
    }
  }, [])

  const clearTestStatusLater = () => {
    if (testStatusTimeoutRef.current) {
      clearTimeout(testStatusTimeoutRef.current)
    }

    testStatusTimeoutRef.current = setTimeout(() => {
      onSetTestStatus(null)
      testStatusTimeoutRef.current = null
    }, 3000)
  }

  const handleUpdateAIConfig = (key, value) => {
    onUpdateSettings({
      aiConfig: {
        ...settings.aiConfig,
        [key]: value
      }
    })
  }

  const handleTestConnection = async () => {
    onSetTestStatus('testing')
    try {
      const { createAIService } = await import('../../services/ai/aiService')
      const service = createAIService(settings.aiConfig)
      const success = await service.testConnection()
      onSetTestStatus(success ? 'success' : 'error')
      clearTestStatusLater()
    } catch (error) {
      onSetTestStatus('error')
      clearTestStatusLater()
    }
  }

  return (
    <div className="ai-config">
      {/* Model Selection */}
      <div className="config-group">
        <label className="config-label">当前模型</label>
        <select
          value={settings.aiConfig.model}
          onChange={(e) => {
            const selectedModel = e.target.value;
            const custom = (settings.customModels || []).find(m => m.name === selectedModel);
            if (custom) {
              onUpdateSettings({
                aiConfig: {
                  ...settings.aiConfig,
                  model: custom.name,
                  baseUrl: custom.baseUrl || '',
                  apiKey: custom.apiKey || '',
                  // If custom model doesn't have provider, default to 'openai'
                  // to avoid being stuck in 'ollama' mode
                  provider: custom.provider || 'openai'
                }
              });
            }
          }}
          className="config-select"
        >
          {settings.customModels && settings.customModels.length > 0 ? (
            <>
              <option value="">请选择一个模型</option>
              {settings.customModels.filter(m => m.enabled !== false).map((model) => (
                <option key={model.id} value={model.name}>{model.name}</option>
              ))}
            </>
          ) : (
            <option value="">请先在“模型管理”中添加模型</option>
          )}
        </select>
      </div>

      {/* Temperature */}
      <div className="config-group">
        <label className="config-label">
          创造性 (Temperature): {settings.aiConfig.temperature}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={settings.aiConfig.temperature}
          onChange={(e) => handleUpdateAIConfig('temperature', parseFloat(e.target.value))}
          className="config-range"
        />
        <div className="range-labels">
          <span>精确</span>
          <span>创造</span>
        </div>
      </div>

      {/* Test Connection */}
      <div className="test-connection">
        <button
          onClick={handleTestConnection}
          disabled={testStatus === 'testing'}
          className="test-btn"
        >
          {testStatus === 'testing' ? '测试中...' : '测试连接'}
        </button>

        {testStatus === 'success' && (
          <div className="test-result success">
            <Check size={16} />
            <span>连接成功</span>
          </div>
        )}

        {testStatus === 'error' && (
          <div className="test-result error">
            <AlertCircle size={16} />
            <span>连接失败</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIConfig
