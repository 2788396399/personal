import { create } from 'zustand'

const useChatStore = create((set, get) => ({
  messages: [],
  isStreaming: false,
  currentStreamingContent: '',

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: message.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: message.timestamp || new Date().toISOString()
    }]
  })),

  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(m =>
      m.id === id ? { ...m, ...updates } : m
    )
  })),

  deleteMessage: (id) => set((state) => ({
    messages: state.messages.filter(m => m.id !== id)
  })),

  clearMessages: () => set({ messages: [] }),

  setStreaming: (isStreaming) => set({ isStreaming }),

  appendStreamContent: (content) => set((state) => ({
    currentStreamingContent: state.currentStreamingContent + content
  })),

  clearStreamContent: () => set({ currentStreamingContent: '' }),

  loadMessages: (messages) => set({ messages })
}))

export default useChatStore
