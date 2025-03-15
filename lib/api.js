/**
 * APIクライアント
 * FastAPIバックエンドへのリクエストを管理するモジュール
 */

// バックエンドAPIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * APIリクエストを送信する
 * @param {string} endpoint - APIエンドポイント
 * @param {Object} options - フェッチオプション
 * @returns {Promise} レスポンスデータ
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // デフォルトヘッダーを設定
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // 認証トークンがあれば追加
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // リクエスト設定
  const config = {
    method: options.method || 'GET',
    headers,
    ...options,
  };
  
  // GETリクエスト以外でbodyがあれば追加
  if (config.method !== 'GET' && options.body) {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, config);
    
    // JSONデータを取得
    const data = await response.json();
    
    // エラーレスポンスの場合
    if (!response.ok) {
      const error = new Error(data.detail || 'APIリクエストエラー');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * 認証関連のAPI
 */
export const authAPI = {
  /**
   * ユーザー登録
   * @param {Object} userData - ユーザーデータ（email, password）
   * @returns {Promise} 登録結果
   */
  register: (userData) => fetchAPI('/api/v1/auth/register', {
    method: 'POST',
    body: userData,
  }),
  
  /**
   * ログイン
   * @param {Object} credentials - 認証情報（email, password）
   * @returns {Promise} ログイン結果とトークン
   */
  login: (credentials) => fetchAPI('/api/v1/auth/login', {
    method: 'POST',
    body: credentials,
  }),
  
  /**
   * ログアウト
   * @returns {Promise} ログアウト結果
   */
  logout: () => fetchAPI('/api/v1/auth/logout', {
    method: 'POST',
  }),
  
  /**
   * 現在のユーザー情報を取得
   * @returns {Promise} ユーザー情報
   */
  getCurrentUser: () => fetchAPI('/api/v1/auth/me'),
  
  /**
   * パスワードリセットメールの送信
   * @param {string} email - メールアドレス
   * @returns {Promise} 送信結果
   */
  resetPassword: (email) => fetchAPI('/api/v1/auth/reset-password', {
    method: 'POST',
    body: { email },
  }),
};

/**
 * 単語関連のAPI（必要に応じて追加）
 */
export const wordsAPI = {
  // ...
};

export default {
  auth: authAPI,
  words: wordsAPI,
};
