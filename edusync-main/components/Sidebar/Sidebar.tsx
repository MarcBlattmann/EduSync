'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebar();

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
      </nav>
    </div>
  );
}
