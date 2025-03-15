'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../auth.module.css';
import { authAPI } from '../../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await authAPI.resetPassword(email);
      setMessage('パスワードリセットのメールを送信しました。メールをご確認ください。');
    } catch (err) {
      console.error('パスワードリセットエラー:', err);
      setError(err.message || 'パスワードリセットに失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>パスワードをリセット</h1>
        <p className={styles.authSubtitle}>
          登録したメールアドレスを入力してください。パスワードリセットのリンクを送信します。
        </p>
        
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              className={styles.formInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your-email@example.com"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? '送信中...' : 'リセットリンクを送信'}
          </button>
        </form>
        
        <Link href="/auth/login" className={styles.authLink}>
          ログインページに戻る
        </Link>
      </div>
    </div>
  );
}
