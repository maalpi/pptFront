'use client'
import { useState, useEffect } from 'react';
import socket from '@/utils/socket';
import { Navigation } from "@/components/Nav";
import { WebcamDialog } from '@/components/Chat/WebcamDialog';
import { ImageUpload } from '@/components/Chat/ImageUpload';
import { ChatHeader } from '@/components/Chat/ChatHeader';
import { Button } from '@/components/ui/button';
import { VencedorDialog } from '@/components/Chat/WinnerDialog';

interface Props {
  params: { room: string };
}

export default function ChatBox({ params }: Props) {
  const [messages, setMessages] = useState<{ content: string; from: string }[]>([]);
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); // Armazenando o arquivo de imagem
  const [imageSent, setImageSent] = useState(false); // Flag para controlar se a imagem já foi enviada
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vencedor, setVencedor] = useState<string | null>(null);
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

      socket.on("fim-partida", (message) => {
        let mes: string = message.replace('Player 1', usersInRoom[1]);
        mes = message.replace('Player 2', usersInRoom[0]);
        setVencedor(mes); // Define o vencedor recebido da API
        setIsDialogOpen(true); // Abre o dialog
      });

      return () => {
        socket.emit("leave-room", roomId);
        socket.off("room-users");
        socket.off("message");
        socket.off("fim-partida");
      };
    };

    joinRoom();
  }, [roomId]);

  // Enviar imagem
  const sendImage = () => {
    if (imageFile && !imageSent) {
      const reader = new FileReader();

      reader.onload = () => {
        const imageData = reader.result as ArrayBuffer; // Carregar a imagem como ArrayBuffer
        socket.emit("image", { roomId, content: imageData, fileName: imageFile.name });
        setImageSent(true); // Marcar imagem como enviada
        setImageFile(null); // Limpar o arquivo após o envio
      };

      reader.readAsArrayBuffer(imageFile); // Ler a imagem como ArrayBuffer
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <Navigation />
      <ChatHeader usersInRoom={usersInRoom} />

      <div className="mt-10 flex flex-row">
        <WebcamDialog onCapture={setImageFile} /> {/* Agora setImageFile recebe o arquivo */}
        <p className='pl-3'>ou</p>
        <ImageUpload onImageSelect={setImageFile} /> {/* Enviar o arquivo de imagem */}
      </div>

      {imageFile && (
        <div className="my-4">
          <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-72 h-72" />
        </div>
      )}

      <Button onClick={sendImage} className="bg-blue-500 text-white p-2 rounded mt-2" disabled={imageSent}>
        Enviar
      </Button>

      {/* Dialog para mostrar o vencedor */}
      <VencedorDialog open={isDialogOpen} setOpen={setIsDialogOpen} vencedor={vencedor} />
    </div>
  );
}
