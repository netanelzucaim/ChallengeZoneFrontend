import React, { useState } from "react";
import aiService from "../services/ai_service";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const response = await aiService.getChatResponse(newMessages);

    setMessages([...newMessages, { role: "assistant", content: response }]);
    setLoading(false);
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-center mb-4">
        <h2
          className="p-3"
          style={{
            backgroundColor: "#007bff", // צבע הרקע
            color: "white", // צבע הטקסט
            padding: "10px 20px", // ריווח פנימי
            borderRadius: "5px", // עיגול קצוות
          }}
        >
          Talk With Me
        </h2>
      </div>
      <div className="chat-box bg-light p-3 border rounded-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex ${msg.role === "user" ? "justify-content-end" : "justify-content-start"} mb-3`}
          >
            <div
              className={`p-3 rounded-3 ${msg.role === "user" ? "bg-primary text-white" : "bg-secondary text-white"}`}
              style={{ maxWidth: "70%", wordBreak: "break-word" }}
            >
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-center text-muted">Loading...</div>}
      </div>
      <div className="d-flex mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="form-control me-2"
        />
        <button onClick={handleSendMessage} disabled={loading} className="btn btn-success">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
