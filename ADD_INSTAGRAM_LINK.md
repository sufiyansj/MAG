# 📸 How to Add Your Instagram Link

## Quick Instructions

You need to replace `YOUR_INSTAGRAM_LINK_HERE` with your actual Instagram profile link in 3 locations:

---

## 1️⃣ Update System Prompt (ChatContext.tsx)

**File:** `E:\AI\contexts\ChatContext.tsx`

**Line 73:** Find this text:
```
You can find him on Instagram at [Instagram profile link - to be added by creator].
```

**Replace with:**
```
You can find him on Instagram at https://instagram.com/YOUR_USERNAME
```

---

## 2️⃣ Update Welcome Screen (App.tsx)

**File:** `E:\AI\App.tsx`

**Around Line 596:** Find:
```jsx
href="YOUR_INSTAGRAM_LINK_HERE"
```

**Replace with:**
```jsx
href="https://instagram.com/YOUR_USERNAME"
```

---

## 3️⃣ Update Footer Credits (App.tsx)

**File:** `E:\AI\App.tsx`

**Around Line 653:** Find:
```jsx
href="YOUR_INSTAGRAM_LINK_HERE"
```

**Replace with:**
```jsx
href="https://instagram.com/YOUR_USERNAME"
```

---

## 📝 Example

If your Instagram username is `abusufiyan.dev`, replace all instances with:
```
https://instagram.com/abusufiyan.dev
```

---

## ✅ What This Does

1. **AI Response:** When users ask "Who made this?" or "Who created you?", MAG AI will respond with your name and Instagram link
2. **Welcome Screen:** Shows "Created by Abusufiyan Jahagirdar" with clickable link on the welcome screen
3. **Footer:** Shows "Made by Abusufiyan Jahagirdar" with clickable link below the message input

---

## 🎨 Current Implementation

- ✅ Name updated to "MAG AI" throughout the app
- ✅ Model name hidden from chat messages
- ✅ Creator credits added in 3 locations
- ⏳ Instagram link needs to be added (replace placeholder)

---

## 🔍 Search and Replace (Easy Method)

Use your code editor's "Find and Replace" feature:

**Find:** `YOUR_INSTAGRAM_LINK_HERE`

**Replace with:** `https://instagram.com/YOUR_USERNAME`

This will update all 2 locations in App.tsx at once!

---

**Made by Abusufiyan Jahagirdar** 🚀