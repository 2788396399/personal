// 存储服务 - 使用 IndexedDB 处理大数据

const DB_NAME = 'novel-generator-db'
const DB_VERSION = 1

class StorageService {
  constructor() {
    this.db = null
    this.conversationMigrationPromise = null
  }

  getConversationStorageId(projectId, conversationId) {
    return `${projectId}-${conversationId}`
  }

  normalizeConversationId(projectId, storedId) {
    const prefix = `${projectId}-`
    return storedId.startsWith(prefix) ? storedId.slice(prefix.length) : storedId
  }

  async migrateConversationKeys() {
    if (!this.db) await this.init()

    if (this.conversationMigrationPromise) {
      return this.conversationMigrationPromise
    }

    this.conversationMigrationPromise = new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readwrite')
      const store = transaction.objectStore('conversations')
      const request = store.getAll()

      request.onerror = () => {
        this.conversationMigrationPromise = null
        reject(request.error)
      }

      request.onsuccess = () => {
        const conversations = request.result || []
        const legacyConversations = conversations.filter((conversation) => {
          if (!conversation.projectId || !conversation.id) return false
          return conversation.id !== this.getConversationStorageId(
            conversation.projectId,
            this.normalizeConversationId(conversation.projectId, conversation.id)
          )
        })

        if (legacyConversations.length === 0) {
          resolve()
          return
        }

        legacyConversations.forEach((conversation) => {
          const normalizedId = this.normalizeConversationId(conversation.projectId, conversation.id)
          const storageId = this.getConversationStorageId(conversation.projectId, normalizedId)
          const migratedConversation = {
            ...conversation,
            id: storageId,
            projectId: conversation.projectId
          }

          store.put(migratedConversation)
          store.delete(conversation.id)
        })
      }

      transaction.oncomplete = () => {
        console.log('Conversation key migration completed')
        resolve()
      }
      transaction.onerror = () => {
        this.conversationMigrationPromise = null
        reject(transaction.error)
      }
      transaction.onabort = () => {
        this.conversationMigrationPromise = null
        reject(transaction.error)
      }
    }).finally(() => {
      this.conversationMigrationPromise = null
    })

    return this.conversationMigrationPromise
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = async () => {
        this.db = request.result
        try {
          await this.migrateConversationKeys()
          resolve(this.db)
        } catch (error) {
          reject(error)
        }
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // 创建对象存储
        if (!db.objectStoreNames.contains('conversations')) {
          db.createObjectStore('conversations', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('chapters')) {
          db.createObjectStore('chapters', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('exports')) {
          db.createObjectStore('exports', { keyPath: 'id' })
        }
      }
    })
  }

  // 保存对话历史
  async saveConversation(projectId, conversation) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readwrite')
      const store = transaction.objectStore('conversations')
      const legacyId = conversation.id
      const storageId = this.getConversationStorageId(projectId, conversation.id)

      const data = {
        ...conversation,
        id: storageId,
        projectId,
        updatedAt: new Date().toISOString()
      }

      const cleanupLegacyRequest = legacyId !== storageId ? store.delete(legacyId) : null
      if (cleanupLegacyRequest) {
        cleanupLegacyRequest.onerror = () => {
          console.error('Failed to clean up legacy conversation key:', cleanupLegacyRequest.error)
        }
      }

      const request = store.put(data)
      request.onsuccess = () => {
        console.log('Conversation saved successfully:', data.id)
        resolve(request.result)
      }
      request.onerror = () => {
        console.error('Failed to save conversation:', request.error)
        reject(request.error)
      }
    })
  }

  // 获取单个对话
  async getConversation(projectId, conversationId) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readonly')
      const store = transaction.objectStore('conversations')
      const storageId = this.getConversationStorageId(projectId, conversationId)
      const prefixedRequest = store.get(storageId)

      prefixedRequest.onsuccess = () => {
        if (prefixedRequest.result) {
          resolve(prefixedRequest.result)
          return
        }

        const legacyRequest = store.get(conversationId)
        legacyRequest.onsuccess = () => resolve(legacyRequest.result || null)
        legacyRequest.onerror = () => reject(legacyRequest.error)
      }
      prefixedRequest.onerror = () => reject(prefixedRequest.error)
    })
  }

  // 删除对话
  async deleteConversation(projectId, conversationId) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readwrite')
      const store = transaction.objectStore('conversations')
      const storageId = this.getConversationStorageId(projectId, conversationId)

      console.log('Attempting to delete conversation keys:', [storageId, conversationId])

      const prefixedRequest = store.delete(storageId)
      prefixedRequest.onerror = () => {
        console.error('Failed to delete conversation from DB:', prefixedRequest.error)
        reject(prefixedRequest.error)
      }
      prefixedRequest.onsuccess = () => {
        if (conversationId === storageId) {
          console.log('Conversation deleted from DB successfully')
          resolve()
          return
        }

        const legacyRequest = store.delete(conversationId)
        legacyRequest.onsuccess = () => {
          console.log('Conversation deleted from DB successfully')
          resolve()
        }
        legacyRequest.onerror = () => {
          console.error('Failed to delete legacy conversation from DB:', legacyRequest.error)
          reject(legacyRequest.error)
        }
      }
    })
  }

  // 获取项目的所有对话
  async getConversations(projectId) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readonly')
      const store = transaction.objectStore('conversations')
      const request = store.getAll()

      request.onsuccess = () => {
        console.log('All conversations in store:', request.result.map(c => c.id))
        const conversations = request.result.filter(c => c.projectId === projectId)
        resolve(conversations)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // 保存章节数据
  async saveChapter(projectId, chapter) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['chapters'], 'readwrite')
      const store = transaction.objectStore('chapters')

      const data = {
        id: `${projectId}-${chapter.id}`,
        projectId,
        ...chapter,
        updatedAt: new Date().toISOString()
      }

      const request = store.put(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // 获取项目的所有章节
  async getChapters(projectId) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['chapters'], 'readonly')
      const store = transaction.objectStore('chapters')
      const request = store.getAll()

      request.onsuccess = () => {
        const chapters = request.result.filter(c => c.projectId === projectId)
        resolve(chapters)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // 导出数据
  async exportProject(projectId) {
    const conversations = await this.getConversations(projectId)
    const chapters = await this.getChapters(projectId)

    return {
      projectId,
      conversations,
      chapters,
      exportedAt: new Date().toISOString()
    }
  }

  // 导入数据
  async importProject(data) {
    if (data.conversations) {
      for (const conversation of data.conversations) {
        await this.saveConversation(data.projectId, conversation)
      }
    }

    if (data.chapters) {
      for (const chapter of data.chapters) {
        await this.saveChapter(data.projectId, chapter)
      }
    }
  }

  // 清除所有数据
  async clearAll() {
    if (!this.db) await this.init()

    const transaction = this.db.transaction(
      ['conversations', 'chapters', 'exports'],
      'readwrite'
    )

    const promises = []
    for (const storeName of ['conversations', 'chapters', 'exports']) {
      const store = transaction.objectStore(storeName)
      promises.push(new Promise((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = resolve
        request.onerror = reject
      }))
    }

    await Promise.all(promises)
  }
}

export default new StorageService()
