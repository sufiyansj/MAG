# 🚀 Quick Start Guide - Grok AI Chat

Get up and running in 5 minutes!

## ✅ Prerequisites

- Node.js 16+ installed
- A Grok API key from [console.x.ai](https://console.x.ai)

## 📦 Installation

1. **Navigate to the project directory:**
   ```bash
   cd E:\AI
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will automatically open or go to the URL shown in terminal
   - Usually: `http://localhost:3000` (or 3001, 3002 if ports are in use)

## 🔑 Setting Up Your API Key (Required)

**The app requires a Groq API key to function.**

1. **Get your FREE Groq API Key:**
   - Visit [console.groq.com/keys](https://console.groq.com/keys)
   - Sign up with your email (takes less than 1 minute)
   - Click **"Create API Key"**
   - Copy the key (starts with `gsk_...`)
   - **Important**: Save it somewhere safe - you won't see it again!

2. **Add the key to the app:**
   - The app will show a **"API Key Required"** screen on first launch
   - Click **"Enter API Key"**
   - Paste your API key in the field
   - Click **"Save Settings"**
   - You're ready to chat! 🎉

**Note**: The API key is completely free and no credit card is required!

## 💬 Using the App

### Starting Your First Conversation

1. Click **"New Chat"** in the sidebar
2. Type your message in the input box at the bottom
3. Press **Enter** or click the send button
4. Watch the AI respond in real-time!

### Keyboard Shortcuts

- **Enter** - Send message
- **Shift + Enter** - New line in message

### Message Actions

Hover over any message to see actions:
- **Copy** - Copy message to clipboard
- **Edit** - Edit your message (user messages only)
- **Regenerate** - Get a new response (AI messages only)
- **Translate** - Translate the message
- **Delete** - Remove the message

### Managing Conversations

- **Rename**: Click ⋮ menu on any conversation → Rename
- **Pin**: Click ⋮ menu → Pin (keeps it at top)
- **Export**: Click ⋮ menu → Export as JSON/Markdown/TXT
- **Delete**: Click ⋮ menu → Delete

## ⚙️ Configuration

### Adjusting AI Behavior

In Settings (⚙️), you can customize:

**Temperature (0.0 - 2.0)**
- `0.0 - 0.3`: Very precise and factual
- `0.4 - 0.7`: Balanced (default: 0.7)
- `0.8 - 1.5`: More creative
- `1.6 - 2.0`: Highly creative and experimental

**Max Tokens (256 - 8192)**
- Controls response length
- Higher = longer responses
- Default: 4096

**System Prompt**
- Set custom instructions for the AI
- Example: "You are a helpful coding assistant"
- Affects all messages in that conversation

**Model Selection**
- **Grok Beta**: Latest features
- **Grok 2**: Stable and reliable
- **Grok 2 Mini**: Faster, efficient

## 🎨 Features Overview

### ✨ Core Features
- ✅ Real-time streaming responses
- ✅ Unlimited conversations
- ✅ Message editing & regeneration
- ✅ Code syntax highlighting
- ✅ Markdown rendering
- ✅ Export/Import conversations
- ✅ Search functionality
- ✅ Pin important chats

### 🎯 Advanced Features
- ✅ Custom system prompts
- ✅ Temperature control
- ✅ Token limit control
- ✅ Multiple models
- ✅ Message translation
- ✅ Conversation summarization
- ✅ Code analysis

## 🐛 Troubleshooting

### App won't start?
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API Key not working?
- Check if the key is correct (starts with `gsk_` and no extra spaces)
- Verify your API key is active at console.groq.com/keys
- Check your API credits/usage at console.groq.com
- Try removing and re-adding the key in Settings
- Generate a new key if the old one expired

### Port already in use?
- Vite will automatically try the next available port
- Check the terminal output for the actual URL

### Styling looks broken?
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check if Tailwind CSS is installed: `npm list tailwindcss`

### Messages not appearing?
- Check browser console (F12) for errors
- Verify API key is set correctly
- Check internet connection

## 📱 Mobile Usage

The app is fully responsive and works on mobile devices:

1. Open the app URL on your mobile browser
2. Tap the **hamburger menu (☰)** to open sidebar
3. Use touch gestures to navigate
4. Tap outside sidebar to close it

## 💾 Data Storage

- **All conversations stored locally** in your browser's localStorage
- **No cloud sync** - data stays on your device
- **To backup**: Export conversations to JSON
- **To restore**: Import previously exported files

## 🎓 Example Use Cases

### For Coding
```
"Explain this Python function: [paste code]"
"Write a React component for a todo list"
"Debug this error: [error message]"
```

### For Writing
```
"Improve this paragraph: [paste text]"
"Write a professional email about..."
"Summarize this article: [paste text]"
```

### For Learning
```
"Explain quantum computing in simple terms"
"What are the differences between React and Vue?"
"Create a study plan for learning Python"
```

### For Translation
```
"Translate this to Spanish: Hello, how are you?"
```

## 🔗 Useful Links

- **Grok API Console**: [console.x.ai](https://console.x.ai)
- **API Documentation**: [x.ai/docs](https://x.ai/docs)
- **Full Features List**: See `FEATURES.md`
- **README**: See `README.md`

## 🆘 Getting Help

1. Check the full README.md for detailed documentation
2. Review FEATURES.md for complete feature list
3. Check browser console (F12) for error messages
4. Verify all dependencies are installed: `npm list`

## 🎉 You're Ready!

That's it! You're all set to start using your powerful AI assistant.

**Pro Tips:**
- Use system prompts to customize AI behavior
- Export important conversations regularly
- Lower temperature for factual tasks, higher for creativity
- Use markdown in your messages for better formatting

**Happy chatting!** 🚀

---

**Need more help?** Check the detailed `README.md` file for comprehensive documentation.

---

## ⚠️ Important Note

**This app requires YOUR OWN Groq API key.** 

- No API key is pre-installed
- You must get a free key from [console.groq.com/keys](https://console.groq.com/keys)
- It's completely free and takes less than 1 minute to set up
- Your API key is stored locally in your browser and never shared

**Get your free API key now:** [console.groq.com/keys](https://console.groq.com/keys) 🚀