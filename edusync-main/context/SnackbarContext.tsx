'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Snackbar, SnackbarType } from '@/components/ui/Snackbar/Snackbar';

interface SnackbarContextType {
  showSnackbar: (message: string, type: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: SnackbarType;
    id: number;
  } | null>(null);

  const showSnackbar = useCallback((message: string, type: SnackbarType) => {
    setSnackbar(prev => {
      if (prev?.message === message && prev?.type === type) {
        return prev;
      }
      return { message, type, id: Date.now() };
    });
  }, []);

  const handleClose = useCallback(() => {
    setSnackbar(null);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar && (
        <div className="snackbar-container">
          <Snackbar
            key={snackbar.id}
            message={snackbar.message}
            type={snackbar.type}
            onClose={handleClose}
          />
        </div>
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
