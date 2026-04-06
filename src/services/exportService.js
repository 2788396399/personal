// 导出服务

class ExportService {
  // 导出为TXT
  exportToTXT(novel) {
    let content = `${novel.name}\n`
    content += `作者: AI创作助手\n`
    content += `创建时间: ${novel.createdAt}\n\n`
    content += `${'='.repeat(50)}\n\n`

    if (novel.description) {
      content += `简介:\n${novel.description}\n\n`
      content += `${'='.repeat(50)}\n\n`
    }

    novel.chapters.forEach((chapter, index) => {
      content += `第${index + 1}章 ${chapter.title}\n\n`
      content += `${chapter.content}\n\n`
      content += `${'─'.repeat(50)}\n\n`
    })

    this.download(content, `${novel.name}.txt`, 'text/plain')
  }

  // 导出为Markdown
  exportToMarkdown(novel) {
    let content = `# ${novel.name}\n\n`
    content += `> 作者: AI创作助手\n`
    content += `> 创建时间: ${novel.createdAt}\n\n`

    if (novel.description) {
      content += `## 简介\n\n${novel.description}\n\n---\n\n`
    }

    novel.chapters.forEach((chapter, index) => {
      content += `## 第${index + 1}章 ${chapter.title}\n\n`
      content += `${chapter.content}\n\n---\n\n`
    })

    this.download(content, `${novel.name}.md`, 'text/markdown')
  }

  // 导出为JSON
  exportToJSON(project) {
    const content = JSON.stringify(project, null, 2)
    this.download(content, `${project.name}-project.json`, 'application/json')
  }

  // 导出为HTML
  exportToHTML(novel) {
    let content = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${novel.name}</title>
  <style>
    body {
      font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.8;
      color: #333;
    }
    h1 {
      text-align: center;
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    .meta {
      text-align: center;
      color: #666;
      margin-bottom: 40px;
    }
    .description {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 40px;
    }
    .chapter {
      margin-bottom: 40px;
    }
    .chapter-title {
      font-size: 1.5em;
      border-bottom: 2px solid #8b5cf6;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .chapter-content {
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <h1>${novel.name}</h1>
  <div class="meta">AI创作助手 | ${new Date(novel.createdAt).toLocaleDateString('zh-CN')}</div>
  ${novel.description ? `<div class="description">${novel.description}</div>` : ''}
  ${novel.chapters.map((chapter, index) => `
    <div class="chapter">
      <h2 class="chapter-title">第${index + 1}章 ${chapter.title}</h2>
      <div class="chapter-content">${chapter.content}</div>
    </div>
  `).join('')}
</body>
</html>`

    this.download(content, `${novel.name}.html`, 'text/html')
  }

  // 下载文件
  download(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType + ';charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 从JSON导入项目
  async importFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const project = JSON.parse(e.target.result)
          resolve(project)
        } catch (error) {
          reject(new Error('无效的JSON文件'))
        }
      }
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file)
    })
  }
}

export default new ExportService()
