import { useEffect, useState } from "react";
import { io } from "socket.io-client";


const socket = io("http://localhost:5000");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState(() => "User" + Math.floor(Math.random()*1000));

  useEffect(() => {
    socket.on("chatMessage", (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.off("chatMessage");
  }, []);

  const send = () => {
    if (!input.trim()) return;
    socket.emit("chatMessage", { user: name, text: input });
    setInput("");
  };

  return (
    <div style={{
      maxWidth: 500, margin: "20px auto", border: "1px solid #ddd",
      borderRadius: 8, display: "flex", flexDirection: "column", height: "80vh"
    }}>
      <div style={{background:"#4caf50",color:"#fff",padding:"10px 15px",borderRadius:"8px 8px 0 0"}}>
        Farmer ↔ Expert Chat
      </div>

      <div style={{
        flex:1, overflowY:"auto", padding:10, background:"#f9f9f9"
      }}>
        {messages.map((m, i) => (
          <div key={i}
            style={{
              margin:"5px 0",
              textAlign: m.user===name? "right":"left"
            }}>
            <div style={{
              display:"inline-block",
              padding:"8px 12px",
              borderRadius:12,
              background: m.user===name? "#DCF8C6":"#fff",
              boxShadow:"0 1px 2px rgba(0,0,0,0.1)"
            }}>
              <small style={{fontWeight:"bold"}}>{m.user}</small><br/>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"flex", padding:10, borderTop:"1px solid #ddd"}}>
        <input
          style={{flex:1,padding:10,border:"1px solid #ccc",borderRadius:20}}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && send()}
          placeholder="Type your message..."
        />
        <button
          style={{marginLeft:10, padding:"0 15px", border:"none",
                  background:"#4caf50", color:"#fff", borderRadius:20}}
          onClick={send}>Send</button>
      </div>
    </div>
  );
}
