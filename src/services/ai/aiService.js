// AI服务统一接口

async function buildError(response, fallbackMessage) {
  let details = ''

  try {
    const data = await response.json()
    details = data?.error?.message || data?.message || data?.error || ''
  } catch {
    try {
      details = await response.text()
    } catch {
      details = ''
    }
  }

  const suffix = details ? `: ${details}` : `: ${response.statusText}`
  return new Error(`${fallbackMessage} (${response.status})${suffix}`)
}

/**
 * 通用 OpenAI 兼容服务
 * 绝大多数云端和本地模型（如 DeepSeek, Claude, Ollama）都支持 OpenAI 格式的 API
 */
class GenericOpenAIService {
  constructor(config) {
    this.apiKey = config.apiKey
    this.model = config.model
    this.baseUrl = config.baseUrl.replace(/\/$/, '') // 移除末尾斜杠
    this.temperature = config.temperature ?? 0.7
    this.maxTokens = config.maxTokens ?? 4000
    this.provider = config.provider || 'openai'
  }

  _buildUrl(path = '/chat/completions') {
    let url = this.baseUrl

    // 如果已经包含完整路径，直接返回
    if (url.includes(path)) return url

    // 常见 API 终点列表
    const knownEndpoints = ['/chat/completions', '/messages', '/completions', '/generate', '/models'];

    // 检查当前 baseUrl 是否已经是以某个终点结尾
    const existingEndpoint = knownEndpoints.find(ep => url.endsWith(ep));

    if (existingEndpoint) {
      // 如果 baseUrl 已经包含了一个具体的终点（例如 /messages），
      // 且我们现在需要的是另一个终点（例如测试连接时的 /models），则进行替换
      if (path !== existingEndpoint && (path === '/models' || existingEndpoint === '/models')) {
        return url.slice(0, -existingEndpoint.length) + path;
      }
      // 否则，如果用户已经提供了具体的终点，我们优先尊重用户的配置
      // 例如用户填写的 baseUrl 就是 .../v1/messages，我们就直接用它发送请求
      return url;
    }

    // 智能判断是否需要添加 /v1
    if (url.includes('/v1')) {
      return `${url}${path}`
    }

    // 否则追加 /v1 和具体路径
    return `${url}/v1${path}`
  }

  async chat(messages, systemPrompt) {
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    const url = this._buildUrl('/chat/completions')

    const headers = {
      'Content-Type': 'application/json'
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: this.model,
          messages: fullMessages,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          stream: false
        })
      })

      if (!response.ok) {
        throw await buildError(response, 'AI API错误')
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || ''
    } catch (error) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error(`网络请求失败：无法连接到 AI 服务 (${url})。请检查：\n1. 网络连接是否正常\n2. 如果是本地模型（如 Ollama），请确保它已启动\n3. 如果是跨域问题，请确保服务端已允许当前域名访问`)
      }
      throw error;
    }
  }

  async *streamChat(messages, systemPrompt) {
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    const url = this._buildUrl('/chat/completions')

    const headers = {
      'Content-Type': 'application/json'
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: this.model,
          messages: fullMessages,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          stream: true
        })
      })
    } catch (error) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error(`网络请求失败：无法连接到 AI 服务 (${url})。请检查：\n1. 网络连接是否正常\n2. 如果是本地模型（如 Ollama），请确保它已启动\n3. 如果是跨域问题，请确保服务端已允许当前域名访问`)
      }
      throw error;
    }

    if (!response.ok) {
      throw await buildError(response, 'AI API错误')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim())

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0]?.delta?.content
            if (content) {
              yield content
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  }

  async testConnection() {
    try {
      // 简单的模型列表检查作为连接测试
      const url = this._buildUrl('/models')

      const headers = {}
      if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`

      const response = await fetch(url, { headers })
      return response.ok
    } catch {
      return false
    }
  }
}

// 工厂函数
export function createAIService(config, activeModel) {
  // 合并全局配置和模型特定配置
  const mergedConfig = {
    ...activeModel,
    temperature: config.temperature,
    maxTokens: config.maxTokens
  }

  if (!mergedConfig.baseUrl || !mergedConfig.model) {
    throw new Error('AI 配置不完整，请在设置中检查模型 URL 和名称')
  }

  return new GenericOpenAIService(mergedConfig)
}
