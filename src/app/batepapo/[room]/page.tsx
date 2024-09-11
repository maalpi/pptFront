'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import socket from '@/utils/socket'; // Importando o socket compartilhado
import { TypeAnimation } from 'react-type-animation';
import { Navigation } from "@/components/Nav";

interface Props {
  params: { room: string };
}

export default function ChatBox({ params }: Props) {
  const [messages, setMessages] = useState<{ content: string; from: string }[]>([]);
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();
  const roomId = params.room;

  useEffect(() => {
    if (!roomId) return;

    const joinRoom = async () => {
      socket.emit("join-room", roomId);

      // Atualizar a lista de usuários na sala
      socket.on("room-users", (users: string[]) => {
        console.log(users)
        setUsersInRoom(users);
      });

      // Receber novas mensagens
      socket.on("message", (message) => {
        setMessages(prev => [...prev, message]);
      });

      // Limpar os listeners ao sair da sala
      return () => {
        socket.emit("leave-room", roomId);
        socket.off("room-users");
        socket.off("message");
      };
    };

    joinRoom();

  }, [roomId]);

  // Enviar mensagem
  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("message", { roomId, content: newMessage });
      setNewMessage("");
    }
  };

  // Gerar a sequência para TypeAnimation com base nos usuários
  const getTypeAnimationSequence = () => {
    if (usersInRoom.length === 2) {
      return [
        `Atenção jogadores ${usersInRoom[0]} e ${usersInRoom[1]}, adicionem as imagens clicando no botão abaixo`,
        1000
      ];
    }
    return [
      `Atenção jogadores, adicionem as imagens clicando no botão abaixo`,
      1000
    ];
  };

  if (!roomId) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <Navigation />
      {usersInRoom.length === 2 ? (
        <TypeAnimation
          sequence={getTypeAnimationSequence()}
          wrapper="span"
          speed={40}
          repeat={0}
          className="text-5xl max-w-3xl"
        />
      ) : (
        <div className="text-5xl max-w-3xl">Carregando os usuários...</div>
      )}
      <div className="messages my-4">
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
      <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded mt-2">
        Enviar
      </button>
    </div>
  );
}
