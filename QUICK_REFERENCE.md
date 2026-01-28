# Quick Reference Guide - New Features & Design

## 🎨 Design Changes Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Theme** | Light pastel colors | Dark professional theme |
| **Background** | Light blue/purple/pink | Dark slate (#0f172a) |
| **Accent Colors** | Multiple gradients | Blue (#3b82f6) + Cyan (#06b6d4) |
| **Text Color** | Dark gray | Light slate (#f1f5f9) |
| **Cards** | White background | Semi-transparent dark with blur |
| **Buttons** | Gradient with pink/purple | Solid or blue-to-cyan gradient |
| **Overall Feel** | Childish, cartoon-like | Professional, enterprise-grade |

---

## ✨ New Analysis Selection Feature

### The Flow
```
Select Scenario → Pick Analyses → Record → View Results
                  (NEW!)         (shows  (only shows
                                selected) selected
                                         analyses)
```

### What Users Can Choose
- 🎤 **Speech Analysis** - WPM, filler words, clarity
- 😊 **Emotion Detection** - Coming soon (placeholder ready)
- 🧍 **Posture Analysis** - Coming soon (placeholder ready)

### Default Selection
All three are checked by default for optimal experience.

---

## 📱 File Locations

### Key Updated Files
| File | Purpose |
|------|---------|
| `app/globals.css` | Color scheme & component styles |
| `app/layout.tsx` | Page metadata & layout |
| `components/Navbar.tsx` | Navigation header |
| `app/page.tsx` | Home page |
| `app/scenarios/page.tsx` | Scenario selection with picker |
| `app/prompt/page.tsx` | Prompt display |
| `app/record/page.tsx` | Recording interface |
| `app/analysis/page.tsx` | Results display (conditional) |
| `components/AnalysisPicker.tsx` | **NEW - Analysis selection modal** |

---

## 🎯 User Journey

### Step 1: Home Page
- Click "Start Training" button
- Or navigate directly to /scenarios

### Step 2: Scenarios Page
- View 4 scenario cards (Job Interview, Networking, etc.)
- Click any scenario card
- **Modal appears** with analysis checkboxes
- Select which analyses to perform
- Click "Continue"

### Step 3: Prompt Page
- See scenario prompt and tips
- Click "Start Recording" to proceed

### Step 4: Record Page
- Record video/audio
- See live transcript
- Shows selected analyses at top
- Click "Continue to Analysis"

### Step 5: Analysis Results
- Only selected analyses appear
- Full feedback and recommendations
- "Try Another Scenario" or "View Dashboard" buttons

---

## 💾 localStorage Keys

When you select analyses and record:

```javascript
{
  "scenario": {
    "title": "Job Interview",
    "prompt": "Tell me about yourself..."
  },
  "selectedAnalyses": ["speech", "emotion", "posture"],
  "transcript": "My name is John and I...",
  "duration": "45"
}
```

---

## 🎨 Color Reference

### New Professional Palette
```css
Primary: #3b82f6 (Blue)
Accent:  #06b6d4 (Cyan)
Dark BG: #0f172a (Very Dark Slate)
Dark BG: #1e293b (Dark Slate)
Cards:   rgba(15, 23, 42, 0.7) (With 10px blur)
Text:    #f1f5f9 (Light Slate)
Muted:   #64748b (Muted Slate)
```

---

## 🧩 Component Classes

### New CSS Classes Available

```tsx
// Card component
<div className="card p-6">Content</div>
// Renders with: dark background, blur, border, hover effect

// Primary button
<button className="btn-primary">Click me</button>
// Renders with: blue background, hover effect

// Secondary button
<button className="btn-secondary">Cancel</button>
// Renders with: slate background, hover effect

// Ghost button
<button className="btn-ghost">Link</button>
// Renders with: transparent, hover effect
```

---

## 🚀 How to Test the New Feature

### Test Analysis Selection
```bash
1. npm run dev
2. Go to http://localhost:3000
3. Click "Start Training"
4. Click a scenario card
5. Check/uncheck analysis boxes
6. Click "Continue"
7. Record something
8. View results - should only show selected analyses
```

### Verify localStorage
```bash
1. Open DevTools (F12)
2. Go to Application → LocalStorage
3. Look for keys: scenario, selectedAnalyses, transcript, duration
4. Values should be JSON strings
```

---

## 🔮 Placeholder Features (Ready for Implementation)

### Emotion Detection
Currently shows: "Coming Soon"  
Ready for: Face detection API integration  
Uses: MediaPipe FaceMesh (already in package.json)

### Posture Analysis
Currently shows: "Coming Soon"  
Ready for: Body pose detection  
Uses: MediaPipe Pose (already in package.json)

---

## ⚙️ Customization Guide

### To Change Colors
Edit `app/globals.css`:
```css
:root {
  --primary: #3b82f6;        /* Change primary color */
  --accent: #06b6d4;         /* Change accent color */
  --background: #0f172a;     /* Change background */
  --foreground: #f1f5f9;     /* Change text color */
}
```

### To Add More Analyses
Edit `components/AnalysisPicker.tsx`:
```tsx
const analyses = [
  {
    id: "speech",
    name: "Speech Analysis",
    description: "...",
    icon: "🎤",
  },
  // Add new entry here
  {
    id: "voice-tone",
    name: "Voice Tone Analysis",
    description: "...",
    icon: "🔊",
  },
];
```

### To Change Scenarios
Edit `app/scenarios/page.tsx`:
```tsx
const scenarios = [
  { id: 1, title: "Job Interview", prompt: "..." },
  // Add or modify scenarios here
];
```

---

## 📊 Analysis Results Display Logic

```typescript
const isSpeechSelected = selectedAnalyses.includes('speech');
const isEmotionSelected = selectedAnalyses.includes('emotion');
const isPostureSelected = selectedAnalyses.includes('posture');

// Then conditional rendering:
if (isSpeechSelected) {
  // Show speech metrics, feedback, recommendations
}
if (isEmotionSelected) {
  // Show emotion detection results (placeholder)
}
if (isPostureSelected) {
  // Show posture analysis results (placeholder)
}
```

---

## 🎓 CSS Glassmorphism Effect

The cards use a professional glassmorphism effect:

```css
.card {
  background: rgba(15, 23, 42, 0.7);      /* Semi-transparent */
  backdrop-filter: blur(10px);             /* Blur effect */
  border: 1px solid rgba(148, 163, 184, 0.1);  /* Subtle border */
}
```

This creates a frosted glass look that's modern and professional.

---

## 🔗 Important Code Patterns

### Analysis Selection Persistence
```typescript
// Save
localStorage.setItem("selectedAnalyses", JSON.stringify(selectedAnalyses));

// Load
const analyses = localStorage.getItem("selectedAnalyses");
if (analyses) {
  setSelectedAnalyses(JSON.parse(analyses));
}
```

### Conditional Rendering
```typescript
{isSpeechSelected && analysis && feedback && (
  <SpeechAnalysisSection />
)}
```

### Modal Pattern
```typescript
{selectedScenario && (
  <Modal 
    onClose={() => setSelectedScenario(null)}
  />
)}
```

---

## 📋 Deployment Checklist

Before deploying:
- [ ] Test all scenarios load correctly
- [ ] Test analysis picker modal
- [ ] Test recording with different selections
- [ ] Test analysis results display
- [ ] Test localStorage persistence
- [ ] Test responsive design on mobile
- [ ] Test all buttons and navigation
- [ ] Check browser console for errors
- [ ] Verify dark theme appears correctly
- [ ] Test on different browsers

---

## 🆘 Common Issues & Solutions

**Q: Analyses not showing on results page?**
A: Check if `selectedAnalyses` is saved in localStorage

**Q: Modal doesn't close?**
A: Ensure onClose callback is properly connected

**Q: Colors look different?**
A: Clear browser cache (Ctrl+Shift+Delete) and refresh

**Q: Buttons don't respond?**
A: Check console for JavaScript errors (F12)

---

## 📞 Need Help?

Check these files for reference:
- Design system: `app/globals.css`
- Component examples: `components/AnalysisPicker.tsx`
- Page structure: `app/scenarios/page.tsx`
- Data flow: `app/record/page.tsx` and `app/analysis/page.tsx`

---

**Last Updated**: January 28, 2026  
**Design System**: v2.0 (Professional Dark Theme)  
**Features**: Analysis Selection v1.0
