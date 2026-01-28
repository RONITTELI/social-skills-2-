# Code Examples - Before & After

## 1. Color Scheme Change

### BEFORE (Childish)
```css
background: linear-gradient(to-br, from-blue-50 via-purple-50 to-pink-50);
text-color: text-gray-800;
button: bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600;
```

### AFTER (Professional)
```css
background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
text-color: text-slate-100;
button: bg-gradient-to-r from-blue-600 to-cyan-600;

/* Plus glassmorphism effect */
.card {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}
```

---

## 2. Card Styling

### BEFORE
```tsx
<div className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition">
  <h2 className="text-xl font-semibold text-blue-600 mb-2">Title</h2>
  <p className="text-gray-600 text-sm">Description</p>
</div>
```

### AFTER
```tsx
<div className="card p-8 cursor-pointer">
  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 
                  flex items-center justify-center shadow-lg mb-4">
    <svg className="w-6 h-6 text-white" />
  </div>
  <h2 className="text-lg font-bold text-slate-100 mb-2">Title</h2>
  <p className="text-slate-400 text-sm">Description</p>
</div>
```

---

## 3. Navbar Changes

### BEFORE
```tsx
<header className="sticky top-0 z-30 
           bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 shadow-lg">
  <span className="inline-flex h-9 w-9 items-center justify-center 
                   rounded-lg bg-white text-blue-600">SS</span>
  <span className="text-lg sm:text-xl font-extrabold text-white">SocialSkill AI</span>
</header>
```

### AFTER
```tsx
<header className="sticky top-0 z-30 
           bg-slate-900/95 backdrop-blur border-b border-slate-700/50 shadow-lg">
  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 
                  flex items-center justify-center shadow-lg">
    <span className="text-white font-bold text-lg">AI</span>
  </div>
  <span className="text-lg sm:text-xl font-bold text-slate-100">SocialSkill AI</span>
</header>
```

---

## 4. Home Page Hero

### BEFORE
```tsx
<h2 className="text-4xl font-bold text-gray-800 leading-snug">
  Build Your <span className="text-blue-600">Confidence</span> & Social Skills with AI
</h2>
<p className="mt-4 text-gray-600 text-lg">
  Practice speaking, improve expressions, fix posture...
</p>
<Link href="/profile" className="mt-8 inline-block px-8 py-4 bg-blue-600 
      text-white rounded-xl text-lg hover:bg-blue-700">
  Start Assessment
</Link>
```

### AFTER
```tsx
<div className="relative bg-slate-800/60 backdrop-blur rounded-3xl p-12 
                shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-slate-700/50">
  <h2 className="text-5xl md:text-6xl font-extrabold text-slate-100 leading-tight mb-6">
    Master <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 
                            bg-clip-text text-transparent">Professional Communication</span> with AI
  </h2>
  <p className="mt-6 text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
    Advanced analysis of speech patterns, facial expressions, posture, and emotion detection...
  </p>
  <Link href="/scenarios" className="mt-10 inline-block px-10 py-4 
        bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl 
        text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all shadow-lg">
    Start Training
  </Link>
</div>
```

---

## 5. Analysis Picker Component

### NEW FEATURE
```tsx
<div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50">
  <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
    <h2 className="text-2xl font-bold text-slate-100">Select Analysis Tools</h2>
    
    {analyses.map((analysis) => (
      <label className="flex items-center gap-4 p-4 
                         bg-slate-700/50 hover:bg-slate-700/70 rounded-lg">
        <input type="checkbox" checked={selectedAnalyses.includes(analysis.id)} 
               className="w-5 h-5 accent-blue-500" />
        <div>
          <h3 className="font-semibold text-slate-100">{analysis.name}</h3>
          <p className="text-sm text-slate-400">{analysis.description}</p>
        </div>
      </label>
    ))}
  </div>
</div>
```

---

## 6. Scenario Card Changes

### BEFORE
```tsx
<Link href={{pathname: "/prompt", query: {title: s.title, prompt: s.prompt}}}>
  <div className="group relative h-full p-8 bg-white/90 backdrop-blur 
                  shadow-xl rounded-3xl hover:shadow-2xl cursor-pointer 
                  transition-all duration-300 border border-gray-100">
    <div className={`w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br ${gradient.badge} 
                    flex items-center justify-center shadow-lg`}>
      <span className="text-2xl font-bold text-white">{s.id}</span>
    </div>
    <h2 className="text-xl font-bold mb-3 text-gray-900">{s.title}</h2>
    <p className="text-blue-600 font-semibold">Start practicing →</p>
  </div>
</Link>
```

### AFTER
```tsx
<button onClick={() => setSelectedScenario(scenario)} 
        className="group relative h-full p-8 card text-left overflow-hidden 
                   hover:scale-105 transition-transform">
  <div className="relative flex flex-col h-full">
    <div className="w-12 h-12 mb-4 rounded-lg 
                    bg-gradient-to-br from-blue-500 to-cyan-500 
                    flex items-center justify-center shadow-lg">
      <span className="text-xl font-bold text-white">{scenario.id}</span>
    </div>
    <h2 className="text-2xl font-bold mb-3 text-slate-100">{scenario.title}</h2>
    <p className="text-slate-400 text-sm mb-4 flex-grow">{scenario.prompt}</p>
    <p className="text-blue-400 font-semibold">Start training →</p>
  </div>
</button>

{selectedScenario && (
  <AnalysisPicker
    scenarioTitle={selectedScenario.title}
    scenarioPrompt={selectedScenario.prompt}
    onClose={() => setSelectedScenario(null)}
  />
)}
```

---

## 7. Record Page - Selected Analyses Display

### NEW FEATURE
```tsx
{selectedAnalyses.length > 0 && (
  <div className="card p-6 mb-8">
    <h2 className="font-bold text-xl text-slate-100 mb-2">{promptData.title}</h2>
    <p className="text-slate-300 text-lg">{promptData.prompt}</p>
    <div className="mt-4 pt-4 border-t border-slate-700">
      <p className="text-sm text-slate-400 mb-2">Analyses to run:</p>
      <div className="flex gap-2 flex-wrap">
        {selectedAnalyses.includes('speech') && 
          <span className="inline-block px-3 py-1 bg-blue-600/20 
                           text-blue-300 rounded-full text-sm">Speech</span>}
        {selectedAnalyses.includes('emotion') && 
          <span className="inline-block px-3 py-1 bg-purple-600/20 
                           text-purple-300 rounded-full text-sm">Emotion</span>}
        {selectedAnalyses.includes('posture') && 
          <span className="inline-block px-3 py-1 bg-cyan-600/20 
                           text-cyan-300 rounded-full text-sm">Posture</span>}
      </div>
    </div>
  </div>
)}
```

---

## 8. Analysis Page - Conditional Display

### NEW FEATURE
```tsx
{!loading && !error && (
  <div className="space-y-8">
    {/* Selected Analyses Badge */}
    {selectedAnalyses.length > 0 && (
      <div className="card p-4 flex gap-2 flex-wrap">
        <span className="text-sm text-slate-400">Analyses performed:</span>
        {isSpeechSelected && <span className="px-3 py-1 bg-blue-600/20 
                                             text-blue-300 rounded-full text-sm">
          🎤 Speech
        </span>}
        {isEmotionSelected && <span className="px-3 py-1 bg-purple-600/20 
                                              text-purple-300 rounded-full text-sm">
          😊 Emotion
        </span>}
      </div>
    )}

    {/* Speech Analysis Section - Only if selected */}
    {isSpeechSelected && analysis && feedback && (
      <>
        {/* Metrics display */}
        {/* Feedback display */}
      </>
    )}

    {/* Emotion Analysis Placeholder */}
    {isEmotionSelected && (
      <div className="card p-8 border-l-4 border-purple-500">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <span className="text-2xl">😊</span>
          Emotion Detection
        </h2>
        <p className="text-slate-400">Coming soon...</p>
      </div>
    )}
  </div>
)}
```

---

## 9. localStorage Usage

### Analysis Selection Persistence
```typescript
// When user selects analyses
localStorage.setItem("selectedAnalyses", JSON.stringify([
  "speech",
  "emotion",
  "posture"
]));

// When recording page loads
const analyses = localStorage.getItem("selectedAnalyses");
if (analyses) {
  setSelectedAnalyses(JSON.parse(analyses));
}

// In analysis page - conditional rendering
const isSpeechSelected = selectedAnalyses.includes('speech');
const isEmotionSelected = selectedAnalyses.includes('emotion');
const isPostureSelected = selectedAnalyses.includes('posture');

// Then use these to conditionally render:
{isSpeechSelected && <SpeechAnalysisResults />}
{isEmotionSelected && <EmotionAnalysisResults />}
{isPostureSelected && <PostureAnalysisResults />}
```

---

## 10. Button Styles

### BEFORE
```tsx
className="px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
           text-white rounded-2xl hover:shadow-2xl hover:scale-105"
```

### AFTER
```tsx
// Primary button
className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white 
           rounded-lg hover:shadow-lg transition-all font-semibold"

// Secondary button
className="px-6 py-4 bg-slate-700 text-slate-100 rounded-lg 
           hover:bg-slate-600 transition-all font-semibold"

// Ghost button
className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 
           rounded-lg font-semibold transition-all"
```

---

## 11. Responsive Design Example

### BEFORE
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### AFTER
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
  {/* Better spacing and max-width for readability */}
</div>
```

---

## Key Takeaways

1. **Professional Colors**: Dark theme with blue/cyan accents
2. **Glassmorphism**: Backdrop blur for modern look
3. **User Control**: Analysis selection before recording
4. **Conditional Display**: Show only relevant results
5. **Better UX**: Clear visual hierarchy and better spacing
6. **Responsive**: Works on all device sizes
7. **localStorage**: Persist user selections across pages

---

All changes maintain backward compatibility while improving the user experience significantly!
