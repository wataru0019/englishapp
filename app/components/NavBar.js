'use client';

import Link from 'next/link';
import { useAuth } from './auth/AuthProvider';
import { useState } from 'react';
import styles from './NavBar.module.css';

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          英語学習アプリ
        </Link>

        {/* モバイルメニューボタン */}
        <button 
          className={styles.menuButton} 
          onClick={toggleMenu}
          aria-label="メニューを開く"
        >
          <span className={styles.menuIcon}></span>
        </button>

        {/* ナビゲーションリンク */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`}>
          <Link href="/words" className={styles.navLink}>
            単語
          </Link>
          <Link href="/sentences" className={styles.navLink}>
            例文
          </Link>
          <Link href="/test" className={styles.navLink}>
            テスト
          </Link>
          <Link href="/about" className={styles.navLink}>
            アプリについて
          </Link>

          {isAuthenticated ? (
            <div className={styles.authLinks}>
              <span className={styles.userEmail}>
                {user?.email}
              </span>
              <button 
                className={styles.logoutButton}
                onClick={logout}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link href="/auth/login" className={styles.loginButton}>
                ログイン
              </Link>
              <Link href="/auth/signup" className={styles.signupButton}>
                登録
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
