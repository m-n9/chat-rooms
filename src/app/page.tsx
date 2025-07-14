"use client";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthForm from "./AuthForm";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

function RoomSelector({ room, setRoom, rooms, onCreateRoom }: any) {
  const [newRoom, setNewRoom] = useState("");
  return (
    <div className="flex gap-2 items-center mb-4">
      <select value={room} onChange={e => setRoom(e.target.value)} className="p-2 border rounded">
        {rooms.map((r: string) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <input
        value={newRoom}
        onChange={e => setNewRoom(e.target.value)}
        placeholder="New room name"
        className="p-2 border rounded"
      />
      <button className="btn btn-secondary" onClick={() => { if (newRoom.trim()) { onCreateRoom(newRoom); setNewRoom(""); } }}>Create</button>
    </div>
  );
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [room, setRoom] = useState("general");
  const [rooms, setRooms] = useState<string[]>(["general"]);
  const [messages, setMessages] = useState<any[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const TECH_STACK = [
    "Next.js",
    "React 19",
    "Firebase (Firestore + Auth)",
    "Tailwind CSS",
    "emoji-picker-react",
    "TypeScript",
    "ESLint",
    "@types/*",
    "autoprefixer",
    "postcss"
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    async function fetchRooms() {
      const snap = await getDocs(collection(db, "rooms"));
      const roomNames = snap.docs.map(doc => doc.id);
      setRooms(roomNames.length ? roomNames : ["general"]);
      if (!roomNames.includes(room)) setRoom(roomNames[0] || "general");
    }
    fetchRooms();
    const q = query(collection(db, "rooms"));
    return onSnapshot(q, snap => {
      const roomNames = snap.docs.map(doc => doc.id);
      setRooms(roomNames.length ? roomNames : ["general"]);
      if (!roomNames.includes(room)) setRoom(roomNames[0] || "general");
    });
  }, [room]);

  useEffect(() => {
    if (!room) return;
    const q = query(collection(db, "rooms", room, "messages"), orderBy("createdAt"));
    return onSnapshot(q, snap => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [room]);

  const handleSend = async (text: string) => {
    if (!user) return;
    await addDoc(collection(db, "rooms", room, "messages"), {
      text,
      user: user.email,
      createdAt: serverTimestamp(),
    });
  };

  const handleCreateRoom = async (roomName: string) => {
    await setDoc(doc(db, "rooms", roomName), { createdAt: serverTimestamp() });
    setRoom(roomName);
  };

  if (!user) return <AuthForm onAuth={() => {}} />;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 transition-colors duration-300">
      <header className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg rounded-b-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight drop-shadow">ChatRx</h1>
        <div className="flex items-center gap-4">
          <span className="bg-white/20 px-4 py-2 rounded-full text-base font-medium shadow-inner">{user.email}</span>
          <button className="btn btn-sm btn-error shadow" onClick={() => signOut(auth)}>
            Sign Out
          </button>
        </div>
      </header>
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowInfo(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full relative animate-fadeIn" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-blue-500" onClick={() => setShowInfo(false)} aria-label="Close info">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-lg font-bold mb-2 text-blue-600">Tech Stack</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              {TECH_STACK.map(pkg => (
                <li key={pkg}>{pkg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full py-8 px-2 sm:px-0">
        <div className="mb-4">
          <RoomSelector room={room} setRoom={setRoom} rooms={rooms} onCreateRoom={handleCreateRoom} />
        </div>
        <div className="flex flex-col flex-1 border border-blue-100 rounded-3xl bg-white/80 shadow-xl overflow-hidden">
          <ChatMessages messages={messages} />
          <ChatInput onSend={handleSend} />
        </div>
      </main>
      {/* Floating Tech Stack Button */}
      <button
        type="button"
        className="fixed bottom-6 right-6 flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:bg-blue-700/90 transition z-40"
        onClick={() => setShowInfo(true)}
        aria-label="Show tech stack info"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>
        <span className="ml-1">Tech Stack</span>
      </button>
    </div>
  );
}
