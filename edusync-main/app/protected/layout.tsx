import { ReactNode } from 'react';
import TopBar from '@/components/TopBar/TopBar';
import Sidebar from '@/components/Sidebar/Sidebar';
import './layout.css';
import { Snackbar } from '@/components/ui/Snackbar/Snackbar';
import { SnackbarProvider } from '@/context/SnackbarContext';
import { SidebarProvider } from '@/context/SidebarContext';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {  
    return (
      <SnackbarProvider>
        <SidebarProvider>
          <div className="protected-layout">
            <TopBar />
            <Sidebar />
            <main className="protected-content">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </SnackbarProvider>
    );
}