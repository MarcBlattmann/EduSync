'use client';

import Image from 'next/image';
import logoblack from "@/assets/logos/logo-black.svg";
import SearchBar from './components/SearchBar/SearchBar';
import ProfileMenu from './components/ProfileMenu/ProfileMenu';
import { useSidebar } from '@/context/SidebarContext';
import "./TopBar.css";

export default function TopBar() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="left-section">
          <button className="menu-button" onClick={toggleSidebar}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <Image src={logoblack} alt="logo" className="topbar-logo" />
          <span className="brand-text">EduSync</span>
        </div>
        <div className="right-section">
          <SearchBar />
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}
