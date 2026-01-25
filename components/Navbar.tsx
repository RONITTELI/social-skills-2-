"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const uid = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const storedEmail = typeof window !== "undefined" ? localStorage.getItem("email") : null;
    if (uid && storedEmail) {
      setLoggedIn(true);
      setEmail(storedEmail);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 shadow-lg">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 font-bold shadow-md">SS</span>
          <span className="text-lg sm:text-xl font-extrabold text-white">SocialSkill AI</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/" className="px-3 py-2 rounded-lg text-white hover:bg-white/10 transition font-semibold">Home</Link>
          <Link href="/dashboard" className="px-3 py-2 rounded-lg text-white hover:bg-white/10 transition font-semibold">Dashboard</Link>
          <Link href="/analysis" className="px-3 py-2 rounded-lg text-white hover:bg-white/10 transition font-semibold">Analysis</Link>
          {!loggedIn && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-gray-100 transition shadow-md font-semibold"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg border-2 border-white text-white hover:bg-white/20 transition font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}

          {loggedIn && (
            <>
              <Link
                href="/account"
                className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold hover:bg-gray-100 shadow-md transition"
                title={email}
              >
                {email.charAt(0).toUpperCase()}
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("userId");
                  localStorage.removeItem("email");
                  window.location.href = "/login";
                }}
                className="px-4 py-2 rounded-lg bg-white text-red-600 hover:bg-gray-100 transition shadow-md font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
