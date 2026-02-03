"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) {
      router.push("/login");
      return;
    }

    fetch(`/api/profile/${uid}`)
      .then((res) => res.json())
      .then((data) => setProfile((prev) => ({ ...prev, ...data.profile, userId: uid })))
      .catch((err) => {
        console.error("Error loading profile:", err);
        router.push("/profile");
      })
      .finally(() => setLoading(false));
  }, [router]);

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

  async function handleUpdate() {
    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    const data = await res.json();
    if (data.success) {
      alert("Profile updated!");
      window.location.href = "/account";
    }
  }

  if (loading) return <p className="p-10 text-slate-200">Loading...</p>;

  return (
    <div className="min-h-screen py-16 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Edit Profile
          </h1>
          <p className="text-slate-300 text-lg">Update your details to refine your experience</p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border-2 border-slate-700/50">
          <div className="space-y-6 text-slate-100">

            {/* Name */}
            <label className="block font-semibold mb-1 text-slate-200">Full Name</label>
            <input
              type="text"
              value={profile.name}
              className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 placeholder-slate-400 border-slate-700"
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />

            {/* Age + Height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-slate-200">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 placeholder-slate-400 border-slate-700"
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-200">Height (in cm)</label>
                <input
                  type="number"
                  value={profile.height}
                  className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 placeholder-slate-400 border-slate-700"
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                />
              </div>
            </div>

            {/* Education */}
            <label className="block font-semibold mb-1 text-slate-200">Education / Profession</label>
            <input
              type="text"
              value={profile.education}
              className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 placeholder-slate-400 border-slate-700"
              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
            />

            {/* Personality */}
            <label className="block font-semibold mb-1 text-slate-200">Personality Type</label>
            <select
              value={profile.personality}
              className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 border-slate-700"
              onChange={(e) => setProfile({ ...profile, personality: e.target.value })}
            >
              <option value="">Select</option>
              <option value="introvert">Introvert</option>
              <option value="ambivert">Ambivert</option>
              <option value="extrovert">Extrovert</option>
            </select>

            {/* Confidence */}
            <label className="block font-semibold mb-1 text-slate-200">
              Communication Confidence (1-10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={profile.confidence}
              className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 placeholder-slate-400 border-slate-700"
              onChange={(e) => setProfile({ ...profile, confidence: e.target.value })}
            />

            {/* English Level */}
            <label className="block font-semibold mb-1 text-slate-200">English Speaking Level</label>
            <select
              value={profile.englishLevel}
              className="w-full p-3 border rounded mb-4 bg-slate-900 text-slate-100 border-slate-700"
              onChange={(e) => setProfile({ ...profile, englishLevel: e.target.value })}
            >
              <option value="">Select</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {/* Interests */}
            <label className="block font-semibold mb-2 text-slate-200">Your Interests</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    profile.interests.includes(interest)
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-slate-900 text-slate-100 border-slate-700 hover:border-slate-500"
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>

            {/* Goal */}
            <label className="block font-semibold mb-1 text-slate-200">Your Goal</label>
            <select
              value={profile.goal}
              className="w-full p-3 border rounded mb-6 bg-slate-900 text-slate-100 border-slate-700"
              onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
            >
              <option value="">Select</option>
              <option value="interview">Interview Preparation</option>
              <option value="confidence">Build Social Confidence</option>
              <option value="publicspeaking">Improve Public Speaking</option>
              <option value="fluency">Improve Fluency</option>
            </select>

            <button
              onClick={handleUpdate}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all shadow-xl relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Save Changes
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
