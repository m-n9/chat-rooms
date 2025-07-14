"use client";
import { useState, useRef } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText("");
      setShowEmoji(false);
    }
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setText(prev => prev + emojiData.emoji);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex gap-3 p-5 bg-white/70 backdrop-blur-lg border-t border-blue-100 rounded-b-3xl shadow-xl relative"
      style={{boxShadow: '0 4px 24px 0 rgba(80, 80, 180, 0.07)'}}
    >
      <div className="relative flex items-center">
        {/* Emoji Button */}
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-100 transition mr-2"
          onClick={() => setShowEmoji(v => !v)}
          tabIndex={-1}
        >
          {/* Smiley face SVG for emoji button */}
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>
        </button>
        {showEmoji && (
          <div className="absolute bottom-12 left-0 z-50">
            <EmojiPicker onEmojiClick={handleEmojiSelect} theme="light" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        className="flex-1 px-5 py-3 rounded-2xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 text-gray-800 placeholder-gray-400 shadow-inner transition-all duration-200 text-base"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message..."
        required
        autoFocus
      />
      <button
        type="submit"
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 focus:ring-2 focus:ring-blue-400 text-base"
      >
        <span>Send</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
      </button>
    </form>
  );
}
