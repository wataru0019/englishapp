'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../../lib/api';

// 認証コンテキストの作成
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // 初期化時にユーザー情報を取得
  useEffect(() => {
    async function loadUserData() {
      // ローカルストレージからトークンを確認
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('認証エラー:', err);
        // トークンが無効な場合はクリア
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  // ログイン処理
  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem('token', data.access_token);
      
      // ログイン後にユーザー情報を取得
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      
      return true;
    } catch (err) {
      console.error('ログインエラー:', err);
      setError(err.message || 'ログインに失敗しました');
      return false;
    }
  };

  // 登録処理
  const register = async (email, password) => {
    setError(null);
    try {
      const userData = await authAPI.register({ email, password });
      return userData;
    } catch (err) {
      console.error('登録エラー:', err);
      setError(err.message || '登録に失敗しました');
      return false;
    }
  };

  // ログアウト処理
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('ログアウトエラー:', err);
    } finally {
      // トークンを削除してユーザー情報をクリア
      localStorage.removeItem('token');
      setUser(null);
      router.push('/auth/login');
    }
  };

  // 保護されたルートのチェック
  const requireAuth = () => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  };

  const contextValue = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    requireAuth,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// カスタムフック
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC：認証が必要なページを保護する
export function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { requireAuth, loading } = useAuth();
    
    useEffect(() => {
      if (!loading) {
        requireAuth();
      }
    }, [loading]);
    
    return <Component {...props} />;
  };
}
