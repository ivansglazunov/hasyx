import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Hook for handling errors with toast notifications
 * Shows toast only once when error changes
 * @param error - error object or null
 * @param prefix - prefix for error message (default "Error")
 */
export function useToastHandleError(error: any, prefix: string = "Error") {
  const lastErrorRef = useRef<string | null>(null);

  useEffect(() => {
    // Если ошибки нет, сбрасываем последнюю ошибку
    if (!error) {
      lastErrorRef.current = null;
      return;
    }

    // Получаем текст ошибки
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    
    // Если ошибка изменилась, показываем тост
    if (errorMessage !== lastErrorRef.current) {
      lastErrorRef.current = errorMessage;
      
      // Показываем тост с ошибкой
      toast.error(`${prefix}: ${errorMessage}`, {
        duration: 5000,
        // @ts-ignore
        position: 'top-center',
      });
    }
  }, [error, prefix]);
}

/**
 * Hook for handling loading errors with toast notifications
 * @param error - error object or null
 * @param resourceName - name of the resource being loaded (default "data")
 */
export function useToastHandleLoadingError(error: any, resourceName: string = "data") {
  useToastHandleError(error, `Error loading ${resourceName}`);
}
