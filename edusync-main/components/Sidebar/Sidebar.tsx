'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
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