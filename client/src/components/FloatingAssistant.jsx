import React, { useState, useRef, useEffect } from 'react';

const FloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Bonjour ! Pose-moi une question sur le bac L ou demande de l'aide sur un sujet." }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ia/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg.text })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { from: "bot", text: data.answer || "Je n'ai pas compris, peux-tu reformuler ?" }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { from: "bot", text: "Erreur de connexion à l'IA." }]);
    }
    setLoading(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="bg-violet-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-all animate-bounce text-base md:text-lg"
        onClick={() => setOpen(true)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M12 4h9"/><path d="M4 12h16"/></svg>
        <span className="hidden sm:inline font-semibold">Assistant IA</span>
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-0 max-w-md w-full relative flex flex-col h-[70vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-2 px-6 pt-6">Assistant IA</h2>
            <div className="flex-1 overflow-y-auto px-6 pb-2">
              {messages.map((msg, i) => (
                <div key={i} className={`my-2 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm shadow ${msg.from === 'user' ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className="p-4 border-t flex gap-2" onSubmit={e => { e.preventDefault(); handleSend(); }}>
              <textarea
                className="flex-1 border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
                rows={2}
                placeholder="Écris ta question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                type="submit"
                className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading || !input.trim()}
              >
                {loading ? '...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingAssistant;
