"use client";
import { useEffect, useRef } from "react";

export default function ChatMessages({ messages }: { messages: any[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-blue-50 via-white to-purple-50 rounded-t-xl space-y-3 transition-colors duration-300">
      {messages.map((msg, i) => (
        <div
          key={msg.id || i}
          className="flex flex-col items-start animate-fadeIn"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-blue-600 text-sm bg-blue-100 px-2 py-0.5 rounded-full shadow-sm">
              {msg.user}
            </span>
            <span className="text-xs text-gray-400">
              {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : ""}
            </span>
          </div>
          <div className="ml-2 px-4 py-2 bg-white/80 rounded-2xl shadow border border-blue-100 text-gray-800 max-w-[80%]">
            {msg.text}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
