'use client';

import { useState, useEffect } from 'react';
import socket from '@/utils/socket';
import { Navigation } from "@/components/Nav";
import { WebcamDialog } from '@/components/Chat/WebcamDialog';
import { ImageUpload } from '@/components/Chat/ImageUpload';
import { ChatHeader } from '@/components/Chat/ChatHeader';
import { Button } from '@/components/ui/button';

interface Props {
  params: { room: string };
}

export default function ChatBox({ params }: Props) {
  const [messages, setMessages] = useState<{ content: string; from: string }[]>([]);
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageSent, setImageSent] = useState(false); // Flag para controlar se a imagem já foi enviada
  const roomId = params.room;

  useEffect(() => {
    if (!roomId) return;

    const joinRoom = async () => {
      socket.emit("join-room", roomId);

      socket.on("room-users", (users: string[]) => {
        setUsersInRoom(users);
      });

      socket.on("message", (message) => {
        setMessages(prev => [...prev, message]);
      });

      return () => {
        socket.emit("leave-room", roomId);
        socket.off("room-users");
        socket.off("message");
      };
    };

    joinRoom();
  }, [roomId]);

  // Enviar imagem
  const sendMessage = () => {
    if (image && !imageSent) {
      socket.emit("image", { roomId, content: image });
      setImageSent(true); // Marcar imagem como enviada
      setImage(null); // Limpar a imagem após o envio
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <Navigation />
      <ChatHeader usersInRoom={usersInRoom} />

      <div className="mt-10 flex flex-row">
        <WebcamDialog onCapture={setImage} />
        <p className='pl-3'>ou</p>
        <ImageUpload onImageSelect={setImage} />
      </div>

      {image && (
        <div className="my-4">
          <img src={image} alt="Preview" className="w-72 h-72" />
        </div>
      )}

      <Button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded mt-2" disabled={imageSent}>
        Enviar
      </Button>
    </div>
  );
}
