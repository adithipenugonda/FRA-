import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const API_BASE = "http://127.0.0.1:8000";

function AssistantPage() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask me about FRA claim counts, pending workloads, district trends, IFR/CFR totals, or a specific claim like FRA00001.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const exampleQuestions = useMemo(
    () => [
      "How many pending claims are there?",
      "Show pending claims in Adilabad.",
      "Which district has the most pending claims?",
      "Give details of FRA00001.",
    ],
    []
  );

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const speakAnswer = (text) => {
    if (!("speechSynthesis" in window) || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const apiFetch = async (url, options = {}) => {
    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.");
    }

    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const sendQuery = async (questionOverride) => {
    const nextQuestion = (questionOverride || query || "").trim();
    if (!nextQuestion) return;

    setLoading(true);
    setError("");
    setMessages((prev) => [...prev, { role: "user", text: nextQuestion }]);
    setQuery("");

    try {
      const response = await apiFetch(`${API_BASE}/assistant/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: nextQuestion }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Assistant query failed");
      }

      const answer = data.answer || "No answer returned.";
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
      speakAnswer(answer);
    } catch (err) {
      setError(err.message || "Unable to contact assistant");
      setMessages((prev) => [...prev, { role: "assistant", text: err.message || "Unable to answer that query." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError("Browser speech recognition is not available on this device. Please type your question.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setError("");
    recognition.start();
    setIsListening(true);
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "var(--bg-primary, #f8fafc)", minHeight: "calc(100vh - 50px)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ marginBottom: "18px" }}>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>Intelligent Query Assistant</h1>
        <p style={{ margin: "6px 0 0", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>Ask the FRA Atlas database for real facts from the live claims table.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(240px, 0.8fr)", gap: "18px" }}>
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "16px", boxShadow: "var(--card-shadow)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: "420px" }}>
            <div style={{ flex: 1, maxHeight: "460px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "8px", padding: "12px", border: "1px solid var(--border-color, #e2e8f0)" }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", backgroundColor: msg.role === "user" ? "#2563eb" : theme === "dark" ? "#1e293b" : "#ffffff", color: msg.role === "user" ? "#fff" : "var(--text-main, #0f172a)", borderRadius: "10px", padding: "10px 12px", fontSize: "13px", lineHeight: "1.5", border: msg.role === "assistant" ? "1px solid var(--border-color, #e2e8f0)" : "none" }}>
                  {msg.text}
                </div>
              ))}
              {loading && <div style={{ alignSelf: "flex-start", fontSize: "12px", color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Querying FRA Atlas database...</div>}
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendQuery();
                }}
                placeholder="Ask a question about claims..."
                style={{ flex: 1, padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color, #cbd5e1)", backgroundColor: "var(--input-bg, #ffffff)", color: "var(--input-text, #0f172a)", fontSize: "14px" }}
              />
              <button type="button" onClick={handleVoiceToggle} style={{ padding: "10px 12px", borderRadius: "8px", backgroundColor: isListening ? "#dc2626" : "#0f172a", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
                {isListening ? "Stop" : "🎙️"}
              </button>
              <button type="button" onClick={() => sendQuery()} disabled={loading} style={{ padding: "10px 16px", borderRadius: "8px", backgroundColor: "#2563eb", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer", fontWeight: "700" }}>
                {loading ? "Thinking..." : "Send"}
              </button>
            </div>

            {error && <div style={{ color: "#dc2626", fontSize: "12px", fontWeight: "600" }}>{error}</div>}
          </div>
        </div>

        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "16px", boxShadow: "var(--card-shadow)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700", color: "var(--text-main, #0f172a)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Example Questions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {exampleQuestions.map((question) => (
              <button key={question} type="button" onClick={() => sendQuery(question)} style={{ width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color, #e2e8f0)", backgroundColor: theme === "dark" ? "#0f172a" : "#f8fafc", color: "var(--text-main, #0f172a)", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssistantPage;
