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
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-700/50 shadow-lg">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-slate-100">SocialSkill AI</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="px-3 py-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition font-medium text-sm sm:text-base">
            Home
          </Link>
          <Link href="/dashboard" className="px-3 py-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition font-medium text-sm sm:text-base">
            Dashboard
          </Link>
          <Link href="/analysis" className="px-3 py-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition font-medium text-sm sm:text-base">
            Analysis
          </Link>
          {!loggedIn && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-md font-semibold text-sm sm:text-base"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800/60 transition font-semibold text-sm sm:text-base"
              >
                Sign Up
              </Link>
            </>
          )}

          {loggedIn && (
            <>
              <Link
                href="/account"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-bold hover:shadow-lg transition shadow-md"
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
                className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition font-semibold text-sm sm:text-base"
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
