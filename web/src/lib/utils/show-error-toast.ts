import { toast } from '../../components/ui/toast/use-toast';

export default function showErrorToast(errorMessage?: string) {
  toast({
    title: 'Error',
    description: errorMessage ?? 'Something went wrong. Please try again.',
    variant: 'destructive',
  });
}
