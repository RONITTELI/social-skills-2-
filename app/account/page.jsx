"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("email");

    if (!uid) {
      router.push("/login");
      return;
    }

    setEmail(storedEmail);

    fetch(`/api/profile/${uid}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.profile);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <p className="p-10">Loading...</p>;

  if (!profile) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-800 text-lg mb-4">
          No profile found. Please create your profile first.
        </p>
        <a
          href="/profile"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Create Profile
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">My Account</h1>
          <p className="text-gray-700 text-lg">Manage your profile and preferences</p>
        </div>

        <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border-2 border-white/50">
          <div className="flex items-center gap-6 mb-8 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white flex items-center justify-center text-3xl font-bold shadow-2xl">
              {profile.name.charAt(0).toUpperCase()}
            </div>

        <div>
          <p className="text-2xl font-semibold text-gray-900">{profile.name}</p>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur p-6 rounded-2xl shadow-lg">
          <p className="text-sm text-gray-600 font-medium mb-1">Age</p>
          <p className="text-2xl font-bold text-gray-900">{profile.age}</p>
        </div>
        <div className="bg-white/60 backdrop-blur p-6 rounded-2xl shadow-lg">
          <p className="text-sm text-gray-600 font-medium mb-1">Height</p>
          <p className="text-2xl font-bold text-gray-900">{profile.height} cm</p>
        </div>
        <div className="bg-white/60 backdrop-blur p-6 rounded-2xl shadow-lg">
          <p className="text-sm text-gray-600 font-medium mb-1">Education</p>
          <p className="text-lg font-semibold text-gray-900">{profile.education}</p>
        </div>
        <div className="bg-white/60 backdrop-blur p-6 rounded-2xl shadow-lg">
          <p className="text-sm text-gray-600 font-medium mb-1">Personality</p>
          <p className="text-lg font-semibold text-gray-900 capitalize">{profile.personality}</p>
        </div>
        <div className="bg-white/60 backdrop-blur p-6 rounded-2xl shadow-lg">
          <p className="text-sm text-gray-600 font-medium mb-1">Confidence Level</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{profile.confidence}/10</p>
        </div>
        <div className="bg-white/60 backdrop-blur p-6 rounded-2xl shadow-lg">
          <p className="text-sm text-gray-600 font-medium mb-1">English Level</p>
          <p className="text-lg font-semibold text-gray-900 capitalize">{profile.englishLevel}</p>
        </div>
        <div className="bg-white/60 backdrop-blur p-6 rounded-2xl shadow-lg md:col-span-2">
          <p className="text-sm text-gray-600 font-medium mb-2">Interests</p>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, i) => (
              <span key={i} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold">
                {interest}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur p-6 rounded-2xl shadow-lg md:col-span-2">
          <p className="text-sm text-gray-600 font-medium mb-1">Goal</p>
          <p className="text-lg font-semibold text-gray-900 capitalize">{profile.goal}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <a
          href="/profile/edit"
          className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all shadow-xl font-semibold text-center"
        >
          Edit Profile
        </a>
        <a
          href="/scenarios"
          className="flex-1 px-6 py-4 bg-white text-gray-900 rounded-2xl hover:shadow-xl hover:scale-105 transition-all shadow-lg font-semibold text-center border-2 border-gray-200"
        >
          Start Practicing
        </a>
      </div>
    </div>
      </div>
    </div>
  );
}
