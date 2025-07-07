import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const suggestions = [
  "Exemples de sujets de philo",
  "Comment réviser efficacement ?",
  "Astuces pour la dissertation",
  "Méthodologie du commentaire de texte",
  "Conseils pour l’oral d’anglais"
];

const FloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    // Historique persistant
    const saved = localStorage.getItem('assistantHistory');
    return saved ? JSON.parse(saved) : [
      { from: "bot", text: "Bonjour ! Pose-moi une question sur le bac L ou choisis une suggestion." }
    ];
  });
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    localStorage.setItem('assistantHistory', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userMsg = { from: "user", text };
    setMessages(msgs => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ia/ask`, {
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
      handleSend(input);
    }
  };

  const handleSuggestion = (s) => {
    setInput(s);
    setTimeout(() => handleSend(s), 200);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        className="bg-violet-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-all animate-bounce text-base md:text-lg"
        onClick={() => setOpen(true)}
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ouvrir l'assistant IA"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M12 4h9"/><path d="M4 12h16"/></svg>
        <span className="hidden sm:inline font-semibold">Assistant IA</span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-0 max-w-md w-full relative flex flex-col h-[70vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
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
                    <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm shadow ${msg.from === 'user' ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="px-4 pb-2">
                <div className="flex gap-2 flex-wrap mb-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      className="bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-violet-200 px-2 py-1 rounded text-xs hover:bg-violet-200 dark:hover:bg-violet-700 transition"
                      onClick={() => handleSuggestion(s)}
                      disabled={loading}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <form className="flex gap-2" onSubmit={e => { e.preventDefault(); handleSend(input); }}>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingAssistant;
