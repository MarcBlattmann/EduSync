'use client';

import Image from 'next/image';
import logoblack from "@/assets/logos/logo-black.svg";
import SearchBar from './components/SearchBar/SearchBar';
import ProfileMenu from './components/ProfileMenu/ProfileMenu';
import "./TopBar.css";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="left-section">
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
