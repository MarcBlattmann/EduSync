import { ReactNode } from 'react';
import TopBar from '@/components/TopBar/TopBar';
import './layout.css';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {  
    return (
      <div className="protected-layout">
        <TopBar />
        <div className="protected-content">
          {children}
        </div>
      </div>
    );
}