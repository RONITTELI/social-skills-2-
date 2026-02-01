"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) {
      router.push("/login");
      return;
    }

    fetch(`/api/profile/${uid}`)
      .then((res) => res.json())
      .then((data) => setProfile(data.profile))
      .catch((err) => {
        console.error("Error loading profile:", err);
        router.push("/profile");
      });
  }, [router]);

  async function handleUpdate() {
    const res = await fetch("/api/profile/update", {
      method: "PUT",
      body: JSON.stringify(profile),
    });

    const data = await res.json();
    if (data.success) {
      alert("Profile updated!");
      window.location.href = "/account";
    }
  }

  if (!profile) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Edit Profile
        </h1>

        {/* Name */}
        <input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full p-3 border rounded mb-4"
        />

        {/* Age, Height, Education */}
        {/* Repeat same as earlier profile page */}
        
        <button
          onClick={handleUpdate}
          className="mt-6 w-full bg-blue-600 text-white p-4 rounded-xl text-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
