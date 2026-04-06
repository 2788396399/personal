import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useSettingsStore = create(
  persist(
    (set, get) => ({
      // AI 配置
      aiConfig: {
        activeModelId: 'default-openai',
        temperature: 0.7,
        maxTokens: 4000
      },

      // 模型列表
      customModels: [
        {
          id: 'default-openai',
          name: 'OpenAI (Default)',
          baseUrl: 'https://api.openai.com/v1',
          apiKey: '',
          model: 'gpt-4o',
          provider: 'openai'
        }
      ],

      // 主题设置
      theme: 'dark',

      // UI 设置
      fontSize: 16,
      chatFontSize: 14,
      lineSpacing: 1.6,
      autoSave: true,
      showWordCount: true,

      // AI 权限设置
      aiPermissions: {
        // 内容生成
        autoApplyContent: false,       // 生成内容后自动应用到正文
        showAIReasoning: true,        // 显示 AI 推理过程
        allowReadAllChapters: false,   // 允许 AI 读取所有章节正文内容

        // 角色卡片
        autoExtractCharacter: false,   // 自动从内容提取角色信息
        confirmCharacterChange: true, // 角色信息变更前确认

        // 情节追踪
        autoDetectPlot: false,         // 自动识别情节点
        confirmForeshadowingChange: true, // 伏笔状态变更前确认
        showConsistencyWarning: true,  // 一致性警告

        // 知识图谱
        autoGenerateSummary: true,    // 章节完成后自动生成摘要
        autoDetectSetting: false,      // 自动识别世界设定
        autoDetectEntity: true,       // 自动识别实体
        showSettingConflict: true,    // 设定冲突警告

        // 大纲
        showOutlineDeviation: true,   // 偏离大纲警告
        autoAdjustOutline: false      // 自动调整大纲（不推荐）
      },

      updateAIConfig: (config) => set((state) => ({
        aiConfig: { ...state.aiConfig, ...config }
      })),

      addCustomModel: (model) => set((state) => ({
        customModels: [...state.customModels, { ...model, id: Date.now().toString() }]
      })),

      updateCustomModel: (id, updates) => set((state) => ({
        customModels: state.customModels.map(m => m.id === id ? { ...m, ...updates } : m)
      })),

      deleteCustomModel: (id) => set((state) => ({
        customModels: state.customModels.filter(m => m.id !== id),
        aiConfig: state.aiConfig.activeModelId === id ? { ...state.aiConfig, activeModelId: state.customModels[0]?.id || '' } : state.aiConfig
      })),

      updateAIPermissions: (permissions) => set((state) => ({
        aiPermissions: { ...state.aiPermissions, ...permissions }
      })),

      updateSettings: (settings) => set((state) => ({
        ...state,
        ...settings
      })),

      setTheme: (theme) => set({ theme }),

      updateUISettings: (settings) => set((state) => ({
        ...state,
        ...settings
      }))
    }),
    {
      name: 'novel-settings'
    }
  )
)

export default useSettingsStore
