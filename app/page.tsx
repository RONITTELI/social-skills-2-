
"use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function HomePage() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     const uid = localStorage.getItem("userId");
//     const storedEmail = localStorage.getItem("email");

//     if (uid && storedEmail) {
//       setLoggedIn(true);
//       setEmail(storedEmail);
//     } else {
//       setLoggedIn(false);
//     }
//   }, []);

//   return (
//     <div className="min-h-screen">
//       {/* HERO SECTION */}
//       <section className="relative text-center pt-20 pb-24 px-6 overflow-hidden">
//         <div className="max-w-4xl mx-auto">
//           {/* Hero Content Card */}
//           <div className="relative bg-slate-800/60 backdrop-blur rounded-3xl p-12 shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-slate-700/50 hover:shadow-[0_25px_70px_rgba(0,0,0,0.4)] transition-all duration-300">
//             <div className="relative z-10">
//               <h2 className="text-5xl md:text-6xl font-extrabold text-slate-100 leading-tight mb-6 drop-shadow-sm">
//                 Master <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Professional Communication</span> with AI
//               </h2>

//               <p className="mt-6 text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
//                 Advanced analysis of speech patterns, facial expressions, posture, and emotion detection for professional development.
//               </p>

//               <Link
//                 href="/scenarios"
//                 className="mt-10 inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all shadow-lg"
//               >
//                 Start Training
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

      {/* MODULES */}
      <section className="px-6 pb-20">
        <h3 className="text-3xl font-bold mb-8 text-slate-100 text-center">Core Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* 1. Scenario & Response */}
          <Link href="/scenarios" className="group card p-6 cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mb-2">Scenario Training</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Practice with real-world scenarios. Record and analyze your responses.
              </p>
            </div>
          </Link>
          {/* 2. Speech Analysis */}
          <Link href="/analysis" className="group card p-6 cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mb-2">Speech Analysis</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                WPM, filler words, clarity, and speech patterns.
              </p>
            </div>
          </Link>
          {/* 3. Facial Emotion */}
          <Link href="/emotion" className="group card p-6 cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mb-2">Emotion Detection</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Facial expressions, emotions, and eye contact analysis.
              </p>
            </div>
          </Link>
          {/* 4. Body Language */}
          <Link href="/posture" className="group card p-6 cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mb-2">Posture Analysis</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Body positioning, gestures, and confidence indicators.
              </p>
            </div>
          </Link>
          {/* 5. Feedback */}
          <Link href="/feedback" className="group card p-6 cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mb-2">AI Feedback</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Personalized recommendations for improvement.
              </p>
            </div>
          </Link>
          {/* 6. Dashboard */}
          <Link href="/dashboard" className="group card p-6 cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mb-2">Dashboard</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Track progress and view historical improvements.
              </p>
            </div>
          </Link>
        </div>
      </section>
// //     </div>
// //   );
// // }



import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("email");

    if (uid && storedEmail) {
      setLoggedIn(true);
      setEmail(storedEmail);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background Elements - Colorful */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -top-20 right-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-green-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 rounded-full mb-8 hover:bg-blue-500/30 transition-colors">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">AI-Powered Communication Mastery</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">Transform Your Communication Skills</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent max-w-2xl mx-auto mb-12 leading-relaxed">
              Master public speaking, body language, and emotional intelligence with AI-driven analysis and personalized feedback.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <Link
                href="/scenarios"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Training
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <Link
                href="/profile"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 hover:from-cyan-500/50 hover:to-blue-500/50 text-cyan-100 font-semibold rounded-lg border border-cyan-400/50 hover:border-cyan-300 transition-all hover:shadow-xl hover:shadow-cyan-500/30"
              >
                Create Profile
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
              <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur border border-blue-400/30 rounded-xl hover:from-blue-500/40 hover:to-purple-500/40 transition-all">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">100%</div>
                <div className="text-sm text-cyan-300">AI Analysis</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur border border-cyan-400/30 rounded-xl hover:from-cyan-500/40 hover:to-blue-500/40 transition-all">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">Real-Time</div>
                <div className="text-sm text-blue-300">Feedback</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur border border-purple-400/30 rounded-xl hover:from-purple-500/40 hover:to-pink-500/40 transition-all">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">3 Types</div>
                <div className="text-sm text-pink-300">Analysis</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="px-6 py-24 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-6">
                Everything You Need
              </h2>
              <p className="text-xl bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent max-w-2xl mx-auto">
                Comprehensive analysis tools to elevate your communication skills
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <Link href="/scenarios" className="group">
                <div className="h-full p-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur border border-blue-400/30 rounded-2xl hover:from-blue-500/40 hover:to-cyan-500/40 hover:border-blue-300/50 transition-all duration-300 cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent mb-3">Practice Scenarios</h3>
                  <p className="text-cyan-200/80 leading-relaxed">
                    Choose from diverse scenarios and practice real-world communication situations with guided prompts.
                  </p>
                </div>
              </Link>

            

              {/* Feature 3 */}
              <Link href="/emotion" className="group">
                <div className="h-full p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur border border-green-400/30 rounded-2xl hover:from-green-500/40 hover:to-emerald-500/40 hover:border-green-300/50 transition-all duration-300 cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent mb-3">Emotion Detection</h3>
                  <p className="text-green-200/80 leading-relaxed">
                    Advanced AI detects facial expressions, eye contact, and emotional states in real-time.
                  </p>
                </div>
              </Link>

              {/* Feature 4 */}
              <Link href="/posture" className="group">
                <div className="h-full p-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur border border-yellow-400/30 rounded-2xl hover:from-yellow-500/40 hover:to-orange-500/40 hover:border-yellow-300/50 transition-all duration-300 cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/30">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent mb-3">Posture Analysis</h3>
                  <p className="text-yellow-200/80 leading-relaxed">
                    Monitor body positioning, gestures, and confidence indicators for professional presence.
                  </p>
                </div>
              </Link>

            

              {/* Feature 6 */}
              <Link href="/dashboard" className="group">
                <div className="h-full p-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur border border-indigo-400/30 rounded-2xl hover:from-indigo-500/40 hover:to-purple-500/40 hover:border-indigo-300/50 transition-all duration-300 cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent mb-3">Progress Dashboard</h3>
                  <p className="text-indigo-200/80 leading-relaxed">
                    Track improvements over time with detailed analytics and historical data visualization.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="px-6 py-24 relative">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-12 md:p-16 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur border border-purple-500/30 rounded-3xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -z-10"></div>

              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
                Ready to Transform Your Communication?
              </h2>
              <p className="text-lg bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-8 leading-relaxed">
                Join thousands of professionals who are improving their speaking, body language, and presentation skills with our AI-powered platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/scenarios"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 text-center"
                >
                  Start Your Journey
                </Link>
                <Link
                  href="/profile"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-100 font-semibold rounded-lg border border-cyan-400/50 hover:from-cyan-500/50 hover:to-blue-500/50 transition-all text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="px-6 py-12 border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto text-center text-slate-500">
            <p>© 2026 Communication Mastery. Powered by Advanced AI.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
