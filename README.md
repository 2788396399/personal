# AI Long Novel Generator

A React-based AI-assisted novel writing tool that supports collaborative generation of long novels through conversational interaction with AI.

## Features

- ✨ **Conversational Creation**: Chat-style interaction with AI to gradually build novel content
- 🤖 **Multi-Model Support**: Supports Claude, OpenAI, Ollama, and other AI services
- 📚 **Project Management**: Manage multiple novel projects, save conversation history
- 📖 **Chapter Editing**: Chapter management, real-time preview, content editing
- 💾 **Local Storage**: Uses LocalStorage and IndexedDB, no backend server required
- 📤 **Multi-Format Export**: Supports TXT, Markdown, HTML, JSON format export
- 🎨 **Beautiful UI**: Dark theme, smooth animations, comfortable experience

## Quick Start

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Configure AI Service

1. Click the settings button in the top right corner
2. Select AI provider (Claude/OpenAI/Ollama)
3. Enter API Key (Ollama does not require a Key)
4. Select model
5. Test connection

### Start Creating

1. Create a new project
2. Set novel title and type
3. Enter creation instructions in the chat box
4. AI will generate content based on your instructions
5. You can edit and export at any time

## Project Structure

```
src/
├── components/          # UI Components
│   ├── Chat/           # Chat-related components
│   ├── Project/        # Project management components
│   ├── Editor/         # Editor components
│   ├── Settings/       # Settings components
│   └── Layout/         # Layout components
├── services/           # Service layer
│   ├── ai/            # AI services (Claude/OpenAI/Ollama)
│   ├── storageService.js  # Storage service
│   └── exportService.js   # Export service
├── stores/             # Zustand state management
│   ├── projectStore.js    # Project state
│   ├── chatStore.js       # Chat state
│   └── settingsStore.js   # Settings state
└── App.jsx            # Main application component
```

## Usage Tips

### Writing Techniques

- **Clear Instructions**: "Please continue writing the next chapter where the protagonist meets a mysterious stranger"
- **Style Setting**: "Describe this scene in a suspenseful tone"
- **Character Dialogue**: "Have the protagonist and antagonist engage in a heated debate"
- **Plot Twists**: "Design an unexpected plot twist"

### Shortcuts

- `Enter` - Send message
- `Shift + Enter` - New line
- `Ctrl + Enter` - Quick send

### AI Configuration Recommendations

- **Claude**: Excels at creative writing, recommended for novel creation
- **OpenAI**: Versatile, suitable for various styles
- **Ollama**: Runs locally, good privacy, requires local service configuration

## Tech Stack

- React 18
- Zustand (State Management)
- Tailwind CSS (Styling)
- React Markdown (Markdown Rendering)
- IndexedDB (Large Data Storage)
- LocalStorage (Small Data Storage)