'use client';

import Link from 'next/link';
import styles from './auth.module.css';

export default function AuthPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>英語学習アプリへようこそ</h1>
        <p className={styles.authSubtitle}>続けるにはアカウントが必要です</p>
        
        <div className={styles.authButtons}>
          <Link href="/auth/login" className={styles.loginButton}>
            ログイン
          </Link>
          <Link href="/auth/signup" className={styles.signupButton}>
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
}
