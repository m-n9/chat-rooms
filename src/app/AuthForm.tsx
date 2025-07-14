"use client";
import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthForm({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuth();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 shadow-xl rounded-2xl px-8 py-10 flex flex-col gap-6 border border-gray-100 backdrop-blur"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {isRegister ? "Create Account" : "Sign In"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isRegister ? "Register to join the chat" : "Welcome back! Please login"}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 placeholder-gray-400 transition"
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 placeholder-gray-400 transition"
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm text-center -mt-2">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition text-lg mt-2"
        >
          {isRegister ? "Register" : "Sign In"}
        </button>
        <div className="text-center mt-2">
          <button
            type="button"
            className="text-blue-600 hover:underline font-medium text-sm"
            onClick={() => setIsRegister(r => !r)}
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
