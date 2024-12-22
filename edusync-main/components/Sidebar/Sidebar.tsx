import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <nav className={styles.nav}>
        <Link href="/app" className={styles.navItem}>
          Dashboard
        </Link>
        <Link href="/app/courses" className={styles.navItem}>
          My Courses
        </Link>
        <Link href="/app/calendar" className={styles.navItem}>
          Calendar
        </Link>
        <Link href="/app/settings" className={styles.navItem}>
          Settings
        </Link>
      </nav>
    </div>
  );
}
