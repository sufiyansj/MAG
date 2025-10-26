# 🔧 Error Fixes & Troubleshooting Guide

## Common Errors & Solutions

---

## 🚨 Build Errors

### Error: "Cannot find module"
**Symptoms:**
```
Error: Cannot find module '@react-spring/web'
```

**Solution:**
```bash
# Reinstall dependencies
npm install
```

---

### Error: "Port already in use"
**Symptoms:**
```
Port 3000 is in use
```

**Solution:**
Vite automatically tries the next port (3001, 3002, etc.). Just use the URL shown in terminal.

Or manually kill the process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

### Error: "Tailwind classes not working"
**Symptoms:**
- Styles not applying
- Plain HTML appearance

**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules .vite dist
npm install
npm run build
npm run dev
```

---

## 🌐 Runtime Errors

### Error: "400 Bad Request"
**Symptoms:**
```
POST https://api.groq.com/openai/v1/chat/completions 400
```

**Cause:** Invalid model name or API request

**Solution:**
1. Check if using valid Groq model:
   - ✅ `llama-3.1-8b-instant`
   - ✅ `llama-3.1-70b-versatile`
   - ✅ `mixtral-8x7b-32768`
   - ❌ `grok-beta` (invalid)

2. Clear localStorage:
```javascript
// Open browser console (F12)
localStorage.clear();
location.reload();
```

---

### Error: "401 Unauthorized"
**Symptoms:**
```
API request failed: 401 Unauthorized
```

**Cause:** Invalid or expired API key

**Solution:**
The app uses a hardcoded API key. If it's not working:
1. The API key might be rate-limited
2. Try again in a few minutes
3. Or get your own key from [console.groq.com/keys](https://console.groq.com/keys)

---

### Error: "429 Rate Limit"
**Symptoms:**
```
Too many requests
```

**Solution:**
1. Wait 1 minute
2. Try sending message again
3. Rate limits reset quickly on Groq

---

### Error: "Network Error"
**Symptoms:**
```
Failed to fetch
Network request failed
```

**Solution:**
1. Check internet connection
2. Check if Groq API is up: [status.groq.com](https://status.groq.com)
3. Disable VPN if using one
4. Check firewall settings

---

## 🎨 Style Issues

### Issue: "Glassmorphism not showing"
**Solution:**
1. Ensure your browser supports backdrop-filter
2. Update browser to latest version
3. Works best on Chrome/Firefox/Safari

**Browser Support:**
- ✅ Chrome 76+
- ✅ Firefox 103+
- ✅ Safari 9+
- ⚠️ Edge 79+

---

### Issue: "Animations stuttering"
**Solution:**
1. Close other browser tabs
2. Disable browser extensions
3. Update GPU drivers
4. Try hardware acceleration:

Chrome: `chrome://settings` → Advanced → System → Use hardware acceleration

---

### Issue: "Text not readable"
**Solution:**
Check contrast settings in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#6366f1', // Adjust if needed
  }
}
```

---

## 📱 Mobile Issues

### Issue: "Sidebar won't close on mobile"
**Solution:**
1. Tap outside the sidebar
2. Or tap the X button in top-right
3. Refresh page if stuck

---

### Issue: "Touch gestures not working"
**Solution:**
1. Ensure touch events are enabled
2. Try in different mobile browser
3. Clear browser cache

---

## 💾 Data Issues

### Issue: "Conversations disappeared"
**Cause:** localStorage cleared or corrupted

**Solution:**
Unfortunately, data is lost if not exported. For future:
1. Regularly export conversations (⋮ menu → Export)
2. Save important chats as JSON

**Recovery (if possible):**
```javascript
// Check if data exists
console.log(localStorage.getItem('grok_conversations'));
```

---

### Issue: "Can't delete conversation"
**Solution:**
1. Try refreshing the page
2. Or manually clear:
```javascript
// Open console (F12)
const convs = JSON.parse(localStorage.getItem('grok_conversations'));
const filtered = convs.filter(c => c.id !== 'CONVERSATION_ID');
localStorage.setItem('grok_conversations', JSON.stringify(filtered));
location.reload();
```

---

## 🔄 State Issues

### Issue: "App frozen/not responding"
**Solution:**
1. Refresh the page (Ctrl+R / Cmd+R)
2. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
3. Clear cache and reload

---

### Issue: "Messages not sending"
**Symptoms:**
- Input works but nothing happens
- No error shown

**Solution:**
1. Check browser console (F12)
2. Look for errors
3. Try these steps:

```javascript
// Check if API key is set
localStorage.getItem('groq_api_key');

// Check current conversation
const currentConv = localStorage.getItem('grok_last_conversation');
console.log('Current conversation:', currentConv);
```

---

## 🐛 TypeScript Errors

### Error: "Type error in components"
**Solution:**
```bash
# Check for errors
npx tsc --noEmit

# If errors exist, rebuild
npm run build
```

---

### Error: "Module declaration missing"
**Solution:**
Add to `vite-env.d.ts`:
```typescript
/// <reference types="vite/client" />
```

---

## 🔥 Emergency Fixes

### Nuclear Option: Complete Reset
If nothing works:

```bash
# 1. Delete everything
rm -rf node_modules
rm -rf .vite
rm -rf dist
rm package-lock.json

# 2. Reinstall
npm install

# 3. Rebuild
npm run build

# 4. Run
npm run dev

# 5. Clear browser data
# F12 → Application → Clear storage → Clear all
```

---

### Reset localStorage
```javascript
// Open browser console (F12)
// Copy and paste:

localStorage.clear();
console.log('✅ localStorage cleared');
location.reload();
```

---

### Reset to Default Settings
```javascript
// Open browser console (F12)
localStorage.setItem('grok_conversations', JSON.stringify([{
  id: Date.now().toString(),
  title: 'New Conversation',
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  settings: {
    model: 'llama-3.1-8b-instant',
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: 'You are a helpful AI assistant.'
  }
}]));
location.reload();
```

---

## 🔍 Debugging Tools

### Check API Connection
```javascript
// Test API directly
fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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'
  },
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: 'Hello' }]
  })
})
.then(r => r.json())
.then(d => console.log('✅ API Working:', d))
.catch(e => console.error('❌ API Error:', e));
```

---

### Check localStorage
```javascript
// See all stored data
console.log('Conversations:', localStorage.getItem('grok_conversations'));
console.log('API Key:', localStorage.getItem('groq_api_key') ? '✅ Set' : '❌ Not set');
console.log('Last Conversation:', localStorage.getItem('grok_last_conversation'));
```

---

### Check React State
```javascript
// In browser console, type:
$r // Shows selected React component state
```

---

## 📞 Getting Help

### Before Asking for Help

1. **Check browser console** (F12)
   - Note any error messages
   - Take screenshots

2. **Try the fixes above**
   - Most issues are covered

3. **Gather information**
   - What were you doing?
   - What error appeared?
   - Browser and version?
   - Operating system?

### Quick Diagnostics
```javascript
// Run in browser console (F12)
console.log('=== DIAGNOSTICS ===');
console.log('Browser:', navigator.userAgent);
console.log('localStorage available:', typeof Storage !== 'undefined');
console.log('Conversations:', JSON.parse(localStorage.getItem('grok_conversations') || '[]').length);
console.log('API Key set:', !!localStorage.getItem('groq_api_key'));
console.log('=== END ===');
```

---

## ✅ Verification Checklist

After fixing errors, verify:

- [ ] App loads without console errors
- [ ] Can create new conversation
- [ ] Can send messages
- [ ] AI responds
- [ ] Messages appear in chat
- [ ] Settings can be opened
- [ ] Model selection works
- [ ] Sidebar opens/closes
- [ ] Search works
- [ ] Export works
- [ ] No visual glitches

---

## 🎯 Specific Error Messages

### "ResizeObserver loop limit exceeded"
**Solution:** Ignore - this is a harmless warning

### "Failed to execute 'insertBefore'"
**Solution:** Refresh the page

### "Cannot read property of undefined"
**Solution:** 
1. Check console for specific line
2. Usually fixed by page refresh
3. Clear localStorage if persists

### "Hydration failed"
**Solution:**
1. This shouldn't happen (not using SSR)
2. If you see this, clear cache and refresh

---

## 🔧 Advanced Fixes

### Rebuild Tailwind CSS
```bash
# If styles look wrong
npx tailwindcss -o dist/output.css --minify
npm run build
```

### Fix TypeScript Strict Mode
```javascript
// If TypeScript complains, add to tsconfig.json:
{
  "compilerOptions": {
    "strict": false
  }
}
```

### Performance Issues
```javascript
// Disable animations temporarily
// Add to index.css:
* {
  animation: none !important;
  transition: none !important;
}
```

---

## 📚 Related Documentation

- **TROUBLESHOOTING_400.md** - API 400 errors
- **GROQ_INTEGRATION.md** - API integration
- **PROFESSIONAL_DESIGN.md** - Design system
- **README.md** - General documentation

---

## 🆘 Last Resort

If absolutely nothing works:

1. **Download fresh copy** of the project
2. **Don't copy node_modules** - install fresh
3. **Export your data first** if possible
4. **Start fresh installation**

```bash
# Fresh start
git clone <repo> # or download fresh
cd AI
npm install
npm run dev
```

---

**Remember:** 90% of errors are fixed by:
1. Refreshing the page
2. Clearing localStorage
3. Reinstalling dependencies
4. Checking browser console

**Most common fix:**
```bash
npm install
npm run dev
# Then hard refresh browser (Ctrl+Shift+R)
```

---

**Last Updated:** 2025-01-26  
**Version:** 3.0.0  
**Status:** ✅ Comprehensive Error Guide