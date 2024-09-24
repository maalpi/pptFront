import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  
  interface VencedorDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    vencedor: string | null;
  }
  
  export function VencedorDialog({ open, setOpen, vencedor }: VencedorDialogProps) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-3xl justify-center'>Resultado da Partida</AlertDialogTitle>
            <AlertDialogDescription className='flex items-center flex-col'>
              {vencedor ? `O vencedor é: ${vencedor}` : 'Aguardando resultado...'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setOpen(false)}>Fechar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  