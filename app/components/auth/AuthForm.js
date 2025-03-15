'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../auth/auth.module.css';
import { useAuth } from './AuthProvider';

export default function AuthForm({ type }) {
  const router = useRouter();
  const { login, register, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const isLogin = type === 'login';
  const title = isLogin ? 'ログイン' : '新規登録';
  const buttonText = isLogin ? 'ログイン' : 'アカウント作成';
  const alternateLink = isLogin ? '/auth/signup' : '/auth/login';
  const alternateLinkText = isLogin ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isLogin) {
        // ログイン処理
        const success = await login(email, password);
        if (success) {
          router.push('/'); // ログイン後のリダイレクト先
        } else {
          setError(authError || 'ログインに失敗しました');
        }
      } else {
        // 登録処理
        const userData = await register(email, password);
        if (userData) {
          setMessage('登録確認のメールを送信しました。メールをご確認ください。');
          // ユーザーを登録成功ページにリダイレクトするか、そのままにすることもできます
          // router.push('/auth/login');
        } else {
          setError(authError || '登録に失敗しました');
        }
      }
    } catch (err) {
      console.error('認証エラー:', err);
      setError(err.message || '処理に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>{title}</h1>
        
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
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              className={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="8文字以上のパスワード"
              minLength={8}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? '処理中...' : buttonText}
          </button>
        </form>
        
        {isLogin && (
          <Link href="/auth/forgot-password" className={styles.authLink}>
            パスワードをお忘れですか？
          </Link>
        )}
        
        <Link href={alternateLink} className={styles.authLink}>
          {alternateLinkText}
        </Link>
      </div>
    </div>
  );
}
