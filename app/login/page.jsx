"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  function validateEmail(email) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleLogin() {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Login successful");
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("email", email);   // <-- IMPORTANT

      window.location.href = "/profile";
    } else {
      alert(data.error);
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur p-8 shadow-xl rounded-2xl w-full max-w-md border border-slate-700/50">
        <h1 className="text-3xl font-bold mb-2 text-slate-100">Welcome back</h1>
        <p className="text-slate-300 mb-6">Sign in to continue</p>

        <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className={`w-full p-3 border rounded-lg mb-1 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-800 text-slate-100 placeholder-slate-400 ${emailError ? 'border-red-500' : ''}`}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
        />
        {emailError && (
          <div className="text-red-400 text-xs mb-3">{emailError}</div>
        )}

        <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-800 text-slate-100 placeholder-slate-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 font-semibold shadow-lg hover:shadow-xl transition"
        >
          Login
        </button>

        <p className="text-sm text-slate-400 mt-4">Don't have an account? <a href="/signup" className="text-cyan-400 hover:underline">Sign up</a></p>
      </div>
    </div>
  );
}
