"use client";

import React from 'react';
import MenuIcon from './MenuIcon';
import styles from "./styles.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className="flex items-center">
          <span className="text-black font-bold">Figma</span>
        </div>
        <button className="rounded-full p-2">
          <MenuIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
