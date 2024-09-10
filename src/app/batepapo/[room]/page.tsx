'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3001");

interface Props {
  params: { room: string };
}

export default function ChatBox({ params }: Props) {
  const [messages, setMessages] = useState<{ content: string; from: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();
  const roomId = params.room;

  useEffect(() => {
    if (!roomId) return;

    // Entrar na sala de chat
    socket.emit("join-room", roomId);

    // Receber novas mensagens
    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Limpa os listeners ao sair da sala
    return () => {
      socket.emit("leave-room", roomId);
      socket.off("message");
    };
  }, [roomId]);

  // Enviar mensagem
  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    socket.emit("message", { roomId, content: newMessage });
    setNewMessage("");
  };

  if (!roomId) return <div>Loading...</div>;

  return (
    <div className="flex justify-center top-10 items-center min-h-screen fixed w-full px-4">
      <h1>Sala de Chat {roomId}</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.from}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="border p-2 rounded"
        placeholder="Digite sua mensagem..."
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">
        Enviar
      </button>
    </div>
  );
}
