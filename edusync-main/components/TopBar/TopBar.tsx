'use client';

import Image from 'next/image';
import logoblack from "@/assets/logos/logo-black.svg";
import SearchBar from './components/SearchBar/SearchBar';
import ProfileMenu from './components/ProfileMenu/ProfileMenu';
import LoginButton from './components/LoginButton/LoginButton';
import { useSidebar } from '@/context/SidebarContext';
import { usePathname } from 'next/navigation';
import "./TopBar.css";

export default function TopBar() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const isProtectedRoute = pathname.startsWith('/protected');

  return (
    <div className={`topbar ${isProtectedRoute ? 'protected-route' : ''}`}>
      <div className="topbar-content">
        <div className="left-section">
          {isProtectedRoute && (
            <button className="menu-button" onClick={toggleSidebar}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <Image src={logoblack} alt="logo" className="topbar-logo" />
          <span className="brand-text">EduSync</span>
          <span className="beta-tag">BETA</span>
        </div>
        <div className="right-section">
          {isProtectedRoute ? (
            <>
              <SearchBar />
              <ProfileMenu />
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </div>
  );
}
