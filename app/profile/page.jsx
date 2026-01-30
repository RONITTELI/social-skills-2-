"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    userId: "",
    name: "",
    age: "",
    height: "",
    education: "",
    personality: "",
    confidence: "",
    englishLevel: "",
    interests: [],
    goal: "",
  });

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) {
      window.location.href = "/login";
      return;
    }
    setProfile((prev) => ({ ...prev, userId: uid }));
  }, []);

  const interestOptions = ["Technology", "Music", "Sports", "Travel", "Reading", "Gaming", "Art"];

  function toggleInterest(interest) {
    setProfile((prev) => {
      const already = prev.interests.includes(interest);
      const updated = already
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  }

  async function handleSubmit() {
    const res = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(profile),
    });

    const data = await res.json();
    if (data.success) {
      alert("Profile saved!");
      window.location.href = "/scenarios";
    } else {
      alert(data.error);
    }
  }

  return (
    <div className="min-h-screen py-16 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Complete Your Profile
          </h1>
          <p className="text-slate-300 text-lg">Help us personalize your learning experience</p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border-2 border-slate-700/50">
          <div className="space-y-6">

        {/* Name */}
        <label className="block font-semibold mb-1">Full Name</label>
        <input
          type="text"
          className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 placeholder-slate-400"
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />

        {/* Age + Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Age</label>
            <input
              type="number"
              className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 placeholder-slate-400"
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Height (in cm)</label>
            <input
              type="number"
              className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 placeholder-slate-400"
              onChange={(e) => setProfile({ ...profile, height: e.target.value })}
            />
          </div>
        </div>

        {/* Education */}
        <label className="block font-semibold mb-1">Education / Profession</label>
        <input
          type="text"
          className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 placeholder-slate-400"
          onChange={(e) => setProfile({ ...profile, education: e.target.value })}
        />

        {/* Personality */}
        <label className="block font-semibold mb-1">Personality Type</label>
        <select
          className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100"
          onChange={(e) => setProfile({ ...profile, personality: e.target.value })}
        >
          <option value="">Select</option>
          <option value="introvert">Introvert</option>
          <option value="ambivert">Ambivert</option>
          <option value="extrovert">Extrovert</option>
        </select>

        {/* Confidence */}
        <label className="block font-semibold mb-1">
          Communication Confidence (1-10)
        </label>
        <input
          type="number"
          min="1"
          max="10"
          className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 placeholder-slate-400"
          onChange={(e) => setProfile({ ...profile, confidence: e.target.value })}
        />

        {/* English Level */}
        <label className="block font-semibold mb-1">English Speaking Level</label>
        <select
          className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100"
          onChange={(e) => setProfile({ ...profile, englishLevel: e.target.value })}
        >
          <option value="">Select</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {/* Interests */}
        <label className="block font-semibold mb-2">Your Interests</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              type="button"
              className={`px-4 py-2 rounded-full border ${
                profile.interests.includes(interest)
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-100 border-slate-700"
              }`}
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </button>
          ))}
        </div>

        {/* Goal */}
        <label className="block font-semibold mb-1">Your Goal</label>
        <select
          className="w-full p-3 border rounded mb-6 bg-slate-900 text-slate-100"
          onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
        >
          <option value="">Select</option>
          <option value="interview">Interview Preparation</option>
          <option value="confidence">Build Social Confidence</option>
          <option value="publicspeaking">Improve Public Speaking</option>
          <option value="fluency">Improve Fluency</option>
        </select>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all shadow-xl relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save & Continue
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
          </div>
        </div>
      </div>
    </div>
  );
}
