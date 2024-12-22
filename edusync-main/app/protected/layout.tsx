import { ReactNode } from 'react';
import TopBar from '@/components/TopBar/TopBar';
import Sidebar from '@/components/Sidebar/Sidebar';
import './layout.css';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {  
    return (
      <div className="protected-layout">
        <TopBar />
        <Sidebar />
        <main className="protected-content">
          {children}
        </main>
      </div>
    );
}