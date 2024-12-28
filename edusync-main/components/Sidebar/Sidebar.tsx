'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <nav className={styles.nav}>
        <Link 
            href="/protected" 
            className={`${styles.navItem} ${pathname === '/protected' ? styles.active : ''}`}
          >
            Dashboard
        </Link>

        <Link 
            href="/protected/planner" 
            className={`${styles.navItem} ${pathname === '/protected/planner' ? styles.active : ''}`}
          >
            Planner
        </Link>

        <Link 
            href="/protected/EducationTree" 
            className={`${styles.navItem} ${pathname === '/protected/EducationTree' ? styles.active : ''}`}
          >
            Education Tree
        </Link>
        
      </nav>
    </div>
  );
}
