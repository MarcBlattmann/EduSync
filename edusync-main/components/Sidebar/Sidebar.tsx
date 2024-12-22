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
          href="/app/courses" 
          className={`${styles.navItem} ${pathname === '/app/courses' ? styles.active : ''}`}
        >
          My Courses
        </Link>
        <Link 
          href="/app/calendar" 
          className={`${styles.navItem} ${pathname === '/app/calendar' ? styles.active : ''}`}
        >
          Calendar
        </Link>
        <Link 
          href="/app/settings" 
          className={`${styles.navItem} ${pathname === '/app/settings' ? styles.active : ''}`}
        >
          Settings
        </Link>
      </nav>
    </div>
  );
}
