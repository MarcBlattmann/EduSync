'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebar();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profile?.role === 'admin');
      }
    };

    checkAdminStatus();
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <nav className={styles.nav}>
        <Link 
            href="/protected" 
            className={`${styles.navItem} ${pathname === '/protected' ? styles.active : ''}`}
            onClick={handleLinkClick}
          >
            Dashboard
        </Link>

        <Link 
            href="/protected/planner" 
            className={`${styles.navItem} ${pathname === '/protected/planner' ? styles.active : ''}`}
            onClick={handleLinkClick}
          >
            Planner
        </Link>

        <Link 
            href="/protected/EducationTree" 
            className={`${styles.navItem} ${pathname === '/protected/EducationTree' ? styles.active : ''}`}
            onClick={handleLinkClick}
          >
            Education Tree
        </Link>

        {isAdmin && (
          <Link 
            href="/protected/admin" 
            className={`${styles.navItem} ${pathname === '/protected/admin' ? styles.active : ''}`}
            onClick={handleLinkClick}
          >
            Admin Panel
          </Link>
        )}
      </nav>
    </div>
  );
}
