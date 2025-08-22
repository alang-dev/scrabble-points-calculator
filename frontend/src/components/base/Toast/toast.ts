import { toast as sonnerToast } from 'sonner';

interface ToastService {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

class SonnerToastService implements ToastService {
  success(message: string): void {
    sonnerToast.success(message);
  }

  error(message: string): void {
    sonnerToast.error(message);
  }

  info(message: string): void {
    sonnerToast.info(message);
  }

  warning(message: string): void {
    sonnerToast.warning(message);
  }
}

export const toast: ToastService = new SonnerToastService();