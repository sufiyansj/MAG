# 🚀 QUICK SETUP - Add Your Instagram Link

## ⚡ Fast Setup (2 Minutes)

You need to replace `YOUR_INSTAGRAM_LINK_HERE` with your actual Instagram link in **3 places**.

---

## 📍 Location 1: ChatContext.tsx

**File:** `contexts/ChatContext.tsx`  
**Line:** Around 73

### Find This:
```
You can find him on Instagram at [Instagram profile link - to be added by creator].
```

### Replace With:
```
You can find him on Instagram at https://instagram.com/YOUR_USERNAME
```

**Example:** If your username is `abusufiyan.dev`:
```
You can find him on Instagram at https://instagram.com/abusufiyan.dev
```

---

## 📍 Location 2: App.tsx (Welcome Screen)

**File:** `App.tsx`  
**Line:** Around 596

### Find This:
```jsx
<a
  href="YOUR_INSTAGRAM_LINK_HERE"
  target="_blank"
  rel="noopener noreferrer"
  className="text-primary-400 hover:text-primary-300 transition-colors font-semibold"
>
  Abusufiyan Jahagirdar
</a>
```

### Change `href` To:
```jsx
href="https://instagram.com/YOUR_USERNAME"
```

---

## 📍 Location 3: App.tsx (Footer)

**File:** `App.tsx`  
**Line:** Around 653

### Find This:
```jsx
<a
  href="YOUR_INSTAGRAM_LINK_HERE"
  target="_blank"
  rel="noopener noreferrer"
  className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
>
  Abusufiyan Jahagirdar
</a>
```

### Change `href` To:
```jsx
href="https://instagram.com/YOUR_USERNAME"
```

---

## 🔧 Easy Method: Find & Replace

Use your code editor's **Find and Replace** (Ctrl+H or Cmd+H):

1. **Find:** `YOUR_INSTAGRAM_LINK_HERE`
2. **Replace with:** `https://instagram.com/YOUR_USERNAME`
3. Click **Replace All**

This updates both locations in `App.tsx` at once!

Then manually update `ChatContext.tsx` line 73.

---

## 📝 Instagram Link Format

Your link should look like:
```
https://instagram.com/username
```

**Examples:**
- `https://instagram.com/abusufiyan`
- `https://instagram.com/abusufiyan.dev`
- `https://instagram.com/abusufiyan_jahagirdar`

**Don't include:**
- ❌ No `@` symbol
- ❌ No trailing slash
- ❌ No spaces

---

## ✅ After Adding Your Link

### Test It Works:
1. Run your app
2. Click on "Abusufiyan Jahagirdar" link
3. Should open your Instagram profile in new tab

### Ask MAG AI:
- "Who created you?"
- "Who made this?"
- Should respond with your name and Instagram link

---

## 📂 Summary of Changes

### What's Already Done ✅
- ✅ App renamed to "MAG AI"
- ✅ Model name hidden
- ✅ Creator credits added (3 locations)
- ✅ System prompt updated

### What You Need to Do ⏳
- ⏳ Add your Instagram link (3 locations)
- ⏳ Test the links work

---

## 🎯 Where Credits Appear

1. **Welcome Screen** - Below the feature cards
2. **Input Footer** - Below "Press Enter to send" message
3. **AI Responses** - When users ask who created MAG AI

---

## 💬 Need Help?

If you have questions or need assistance:
1. Check `MAG_AI_UPDATES.md` for full details
2. Check `ADD_INSTAGRAM_LINK.md` for detailed instructions

---

**Your MAG AI is ready! Just add your Instagram link and launch! 🚀**

Made by Abusufiyan Jahagirdar ❤️