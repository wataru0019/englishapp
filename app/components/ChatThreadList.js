'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from './ChatThreadList.module.css';

// モックデータ（バックエンド実装時に置き換え）
const MOCK_THREADS = [
  { id: 1, title: 'Daily conversation practice', lastMessage: 'How was your weekend?', updatedAt: '2025-03-19T09:30:00Z', unread: false },
  { id: 2, title: 'English grammar Q&A', lastMessage: 'Can you explain the difference between "since" and "for"?', updatedAt: '2025-03-18T14:45:00Z', unread: true },
  { id: 3, title: 'Travel vocabulary', lastMessage: 'What are common phrases used at airports?', updatedAt: '2025-03-17T11:20:00Z', unread: false },
  { id: 4, title: 'Business English practice', lastMessage: 'How do I respond to this email professionally?', updatedAt: '2025-03-16T16:10:00Z', unread: false },
  { id: 5, title: 'TOEFL preparation', lastMessage: 'Let\'s practice some speaking questions.', updatedAt: '2025-03-15T08:55:00Z', unread: false },
];

export default function ChatThreadList() {
  const [threads, setThreads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // 現在のチャットスレッドIDを取得（URLから）
  const currentThreadId = pathname.includes('/chat/') 
    ? parseInt(pathname.split('/chat/')[1]) 
    : null;

  useEffect(() => {
    // バックエンド実装時にはAPIからスレッド一覧を取得する
    // ここではモックデータを使用
    setThreads(MOCK_THREADS);
  }, []);

  // 検索フィルタリング
  const filteredThreads = threads.filter(thread => 
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 新しいスレッドを作成
  const handleCreateThread = () => {
    if (!newThreadTitle.trim()) return;

    // 実際の実装では、バックエンドAPIを呼び出してスレッドを作成する
    const newThread = {
      id: Date.now(), // 一時的なIDとして現在のタイムスタンプを使用
      title: newThreadTitle,
      lastMessage: 'Start a new conversation',
      updatedAt: new Date().toISOString(),
      unread: false
    };

    setThreads([newThread, ...threads]);
    setNewThreadTitle('');
    setIsCreatingThread(false);
    
    // 新しいスレッドに移動
    router.push(`/chat/${newThread.id}`);
  };

  // 日付をフォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={styles.threadListContainer}>
      <div className={styles.threadListHeader}>
        <h2>Conversations</h2>
        <button 
          className={styles.newThreadButton}
          onClick={() => setIsCreatingThread(true)}
        >
          New Chat
        </button>
      </div>

      {isCreatingThread && (
        <div className={styles.newThreadForm}>
          <input
            type="text"
            value={newThreadTitle}
            onChange={e => setNewThreadTitle(e.target.value)}
            placeholder="Enter conversation title"
            className={styles.newThreadInput}
            autoFocus
          />
          <div className={styles.newThreadActions}>
            <button 
              className={styles.cancelButton}
              onClick={() => {
                setIsCreatingThread(false);
                setNewThreadTitle('');
              }}
            >
              Cancel
            </button>
            <button 
              className={styles.createButton}
              onClick={handleCreateThread}
              disabled={!newThreadTitle.trim()}
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.threadList}>
        {filteredThreads.length > 0 ? (
          filteredThreads.map(thread => (
            <Link 
              href={`/chat/${thread.id}`} 
              key={thread.id}
              className={`${styles.threadItem} ${currentThreadId === thread.id ? styles.activeThread : ''} ${thread.unread ? styles.unreadThread : ''}`}
            >
              <div className={styles.threadContent}>
                <div className={styles.threadHeader}>
                  <h3 className={styles.threadTitle}>{thread.title}</h3>
                  <span className={styles.threadDate}>{formatDate(thread.updatedAt)}</span>
                </div>
                <p className={styles.threadLastMessage}>{thread.lastMessage}</p>
              </div>
              {thread.unread && <div className={styles.unreadIndicator}></div>}
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
