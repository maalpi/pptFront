import { useRef } from "react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"; 
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam"; // Importa a webcam

interface WebcamDialogProps {
  onCapture: (image: string | null) => void;
}

export function WebcamDialog({ onCapture }: WebcamDialogProps) {
  const webcamRef = useRef<Webcam>(null); // Referência para a webcam

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      onCapture(imageSrc); // Envia a imagem capturada para o componente pai
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Tirar Foto</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-3xl justify-center'>Tirar foto</AlertDialogTitle>
          <AlertDialogDescription className='flex items-center flex-col'>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={300}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={captureImage}>Capturar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
