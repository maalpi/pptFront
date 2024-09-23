import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  onImageSelect: (image: string | null) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(reader.result as string); // Envia a imagem carregada para o componente pai
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
    />
  );
}
