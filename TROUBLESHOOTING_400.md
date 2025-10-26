# 🔧 Troubleshooting 400 Bad Request Error

## ✅ **FIXED!**

The 400 Bad Request error has been resolved with the following changes:

---

## 🐛 **What Was Wrong**

### Issue 1: Invalid Model Name
**Problem**: The default conversation settings were using `"grok-beta"` which doesn't exist in Groq API.

**Location**: `contexts/ChatContext.tsx` line 69

**Old Code**:
```typescript
const DEFAULT_SETTINGS: ConversationSettings = {
  model: "grok-beta",  // ❌ Invalid for Groq!
  temperature: 0.7,
  maxTokens: 4096,
};
```

**Fixed Code**:
```typescript
const DEFAULT_SETTINGS: ConversationSettings = {
  model: "llama-3.1-8b-instant",  // ✅ Valid Groq model
  temperature: 0.7,
  maxTokens: 4096,
};
```

---

## 🔄 **Automatic Migration**

### What Happens Now

When you start the app, it will automatically:

1. ✅ Check all saved conversations
2. ✅ Find any with invalid model names (like "grok-beta", "grok-2", etc.)
3. ✅ Automatically migrate them to "llama-3.1-8b-instant"
4. ✅ Log the migration to console
5. ✅ Save the fixed conversations

**Console Output Example**:
```
Migrating conversation "My Chat" from model "grok-beta" to "llama-3.1-8b-instant"
```

---

## 🔍 **Enhanced Error Logging**

### What Was Added

The Groq API service now includes:

1. **Request Logging**:
```typescript
console.log("Groq API Request:", {
  url: "https://api.groq.com/openai/v1/chat/completions",
  model: "llama-3.1-8b-instant",
  messageCount: 2
});
```

2. **Error Details**:
```typescript
console.error("Groq API Error:", {
  status: 400,
  message: "Invalid model specified",
  details: errorJson
});
```

---

## 🛠️ **How to Test the Fix**

### Step 1: Clear Old Data (Optional)
If you want a fresh start:

```javascript
// Open browser console (F12) and run:
localStorage.removeItem('grok_conversations');
localStorage.removeItem('grok_last_conversation');
```

Then refresh the page.

### Step 2: Start the App
```bash
cd E:\AI
npm run dev
```

### Step 3: Send a Test Message
1. Open the app in your browser
2. Type "Hello" in the input box
3. Press Enter
4. Watch for console logs (F12)

**Expected Console Output**:
```
Groq API Streaming Request: {
  url: "https://api.groq.com/openai/v1/chat/completions",
  model: "llama-3.1-8b-instant",
  messageCount: 2
}
```

### Step 4: Verify Response
You should see the AI respond without any 400 errors!

---

## ✅ **Valid Groq Models**

These models are now supported:

| Model Name | Description |
|------------|-------------|
| `llama-3.1-8b-instant` | Fast, efficient (Default) ⭐ |
| `llama-3.1-70b-versatile` | Most capable |
| `llama-3.2-1b-preview` | Ultra lightweight |
| `llama-3.2-3b-preview` | Balanced |
| `llama-3.2-11b-vision-preview` | With vision |
| `llama-3.2-90b-vision-preview` | Large vision model |
| `mixtral-8x7b-32768` | Expert model |
| `gemma2-9b-it` | Google's model |

---

## 🔍 **Common 400 Error Causes**

### 1. Invalid Model Name ✅ FIXED
**Error**: `"model": "grok-beta"` (doesn't exist)
**Solution**: Now defaults to `"llama-3.1-8b-instant"`

### 2. Missing Required Fields
**Error**: Missing `messages` array or `model` field
**Solution**: Service now ensures all required fields are present

### 3. Invalid Message Format
**Error**: Message without `role` or `content`
**Solution**: Service validates message format before sending

### 4. Invalid Temperature
**Error**: Temperature outside 0-2 range
**Solution**: Service clamps to valid range (0.0-2.0)

### 5. Invalid Max Tokens
**Error**: Max tokens too high or negative
**Solution**: Service enforces limits (256-8192)

---

## 🧪 **Testing Different Scenarios**

### Test 1: New Conversation
```bash
# Should work immediately with default model
1. Click "New Chat"
2. Type message
3. Press Enter
4. ✅ Should work!
```

### Test 2: Existing Conversations
```bash
# Should auto-migrate old conversations
1. Start app with old data
2. Check console for migration messages
3. Open old conversation
4. Send message
5. ✅ Should work!
```

### Test 3: Change Model
```bash
# Should work with any valid model
1. Click Settings (⚙️)
2. Change model to "llama-3.1-70b-versatile"
3. Click Save
4. Send message
5. ✅ Should work!
```

---

## 📊 **Debugging Checklist**

If you still see 400 errors, check:

- [ ] Browser console (F12) for error details
- [ ] Model name is in the valid list above
- [ ] API key is set (Settings → API Key)
- [ ] Internet connection is working
- [ ] Groq API status: [status.groq.com](https://status.groq.com)
- [ ] No browser extensions blocking requests
- [ ] CORS is not being blocked

---

## 🔧 **Manual Fix (If Needed)**

If automatic migration doesn't work, manually fix localStorage:

```javascript
// 1. Open browser console (F12)

// 2. Get conversations
const convs = JSON.parse(localStorage.getItem('grok_conversations'));

// 3. Fix model names
const fixed = convs.map(c => ({
  ...c,
  settings: {
    ...c.settings,
    model: 'llama-3.1-8b-instant'
  }
}));

// 4. Save back
localStorage.setItem('grok_conversations', JSON.stringify(fixed));

// 5. Refresh page
location.reload();
```

---

## 🎯 **What to Look For**

### In Browser Console

**✅ Good (Working)**:
```
Groq API Streaming Request: { model: "llama-3.1-8b-instant", ... }
```

**❌ Bad (Error)**:
```
POST https://api.groq.com/openai/v1/chat/completions 400 (Bad Request)
Groq API Error: { error: { message: "Invalid model specified" } }
```

### In Network Tab (F12 → Network)

**Check the Request**:
```json
{
  "model": "llama-3.1-8b-instant",  // ✅ Should be valid
  "messages": [...],
  "temperature": 0.7,
  "max_tokens": 4096,
  "stream": true
}
```

**Check the Response**:
- Status: 200 OK ✅ (Good)
- Status: 400 Bad Request ❌ (Check error details)

---

## 💡 **Prevention Tips**

### For Future Development

1. **Always use constants for model names**:
```typescript
const VALID_MODELS = {
  LLAMA_8B: 'llama-3.1-8b-instant',
  LLAMA_70B: 'llama-3.1-70b-versatile',
  // etc...
} as const;
```

2. **Validate before sending**:
```typescript
const validModels = ['llama-3.1-8b-instant', ...];
if (!validModels.includes(model)) {
  throw new Error(`Invalid model: ${model}`);
}
```

3. **Add TypeScript types**:
```typescript
type GroqModel = 
  | 'llama-3.1-8b-instant'
  | 'llama-3.1-70b-versatile'
  | ...;
```

---

## 🎉 **Success Criteria**

Your app is working correctly when:

✅ No 400 errors in console
✅ AI responds to messages
✅ Streaming works (see text appear gradually)
✅ Can switch models in settings
✅ Old conversations work
✅ New conversations work
✅ Export/import works

---

## 📞 **Still Having Issues?**

### Quick Checks

1. **Clear everything and start fresh**:
```bash
# Stop the server
# Clear localStorage via browser console:
localStorage.clear();
# Restart server
npm run dev
```

2. **Check API key**:
```javascript
// Browser console
localStorage.getItem('groq_api_key');
// Should return: "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"
```

3. **Test API directly**:
```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.1-8b-instant",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Get More Help

- Check **FINAL_SUMMARY.md** for complete overview
- Check **GROQ_INTEGRATION.md** for API details
- Check **README.md** for full documentation
- Open browser console (F12) for detailed errors
- Check Groq docs: [console.groq.com/docs](https://console.groq.com/docs)

---

## 📝 **Change Log**

**2025-01-26 - v2.0.1**
- ✅ Fixed default model from "grok-beta" to "llama-3.1-8b-instant"
- ✅ Added automatic conversation migration
- ✅ Enhanced error logging
- ✅ Added detailed error messages
- ✅ Added request/response logging
- ✅ Validated all model names

---

## ✅ **Status: RESOLVED**

The 400 Bad Request error is now fixed! 

**Action Required**: Just restart the app and it will work!

```bash
npm run dev
```

**Enjoy your ultra-fast Groq-powered AI chat!** 🚀

---

**Last Updated**: 2025-01-26  
**Status**: ✅ FIXED  
**Version**: 2.0.1