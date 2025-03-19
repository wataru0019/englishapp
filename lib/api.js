/**
 * API client for English learning application
 * Handles all API requests to the backend FastAPI service
 */

// Base URL for backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ========================================================
// 認証関連 API
// ========================================================

/**
 * 認証関連のAPI関数をまとめたオブジェクト
 */
export const authAPI = {
  /**
   * ユーザー登録
   * 
   * @param {string} email - メールアドレス
   * @param {string} password - パスワード
   * @returns {Promise<Object>} - 登録結果
   */
  register: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || `API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  /**
   * ログイン
   * 
   * @param {string} email - メールアドレス
   * @param {string} password - パスワード
   * @returns {Promise<Object>} - ログイン結果（トークンを含む）
   */
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || `API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  /**
   * ログアウト
   * 
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  /**
   * 現在のユーザー情報を取得
   * 
   * @returns {Promise<Object>} - ユーザー情報
   */
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // 認証切れ
          return null;
        }
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * パスワードリセットリクエスト
   * 
   * @param {string} email - メールアドレス
   * @returns {Promise<Object>} - リクエスト結果
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || `API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },
};

// ========================================================
// チャット関連 API
// ========================================================

/**
 * Send a chat message to the AI assistant
 * 
 * @param {string} message - User's message text
 * @param {string} sessionId - Optional session ID for conversation continuity
 * @returns {Promise<Object>} - AI response data
 */
export async function sendChatMessage(message, sessionId = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || `API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

/**
 * Get grammar correction for text
 * 
 * @param {string} text - Text to check for grammar issues
 * @returns {Promise<Object>} - Correction data with suggestions
 */
export async function getGrammarCorrection(text) {
  try {
    const response = await fetch(`${API_BASE_URL}/grammar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting grammar correction:', error);
    throw error;
  }
}

/**
 * Get vocabulary suggestions based on a topic or context
 * 
 * @param {string} topic - Topic to get vocabulary for
 * @param {string} level - English proficiency level (beginner, intermediate, advanced)
 * @returns {Promise<Object>} - Vocabulary suggestions
 */
export async function getVocabularySuggestions(topic, level = 'intermediate') {
  try {
    const response = await fetch(`${API_BASE_URL}/vocabulary?topic=${encodeURIComponent(topic)}&level=${encodeURIComponent(level)}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting vocabulary suggestions:', error);
    throw error;
  }
}

/**
 * Start a new chat session
 * 
 * @param {string} level - English proficiency level
 * @param {string} focus - Learning focus (conversation, grammar, vocabulary, etc)
 * @returns {Promise<Object>} - Session data including session_id
 */
export async function startChatSession(level = 'intermediate', focus = 'conversation') {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ level, focus }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error starting chat session:', error);
    throw error;
  }
}

/**
 * Get suggested conversation topics
 * 
 * @param {string} category - Optional category filter
 * @param {number} count - Number of suggestions to return
 * @returns {Promise<Array>} - List of topic suggestions
 */
export async function getConversationTopics(category = null, count = 5) {
  try {
    let url = `${API_BASE_URL}/topics?count=${count}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting conversation topics:', error);
    throw error;
  }
}

/**
 * Get user's learning progress
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Learning progress data
 */
export async function getUserProgress(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/progress`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
}

/**
 * Default export with all API functions
 */
// デフォルトエクスポート
export default {
  // 認証関連
  authAPI,
  
  // チャット関連
  sendChatMessage,
  getGrammarCorrection,
  getVocabularySuggestions,
  startChatSession,
  getConversationTopics,
  getUserProgress
};
