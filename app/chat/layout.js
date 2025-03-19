'use client';

import { useState, useEffect } from 'react';
import { WordProvider } from '../context/WordContext';
import ChatThreadList from '../components/ChatThreadList';
import styles from './chatLayout.module.css';

export default function ChatLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showThreadList, setShowThreadList] = useState(false);

  // 画面サイズが変更されたときにモバイルかどうかを判定
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 初期チェック
    checkIfMobile();

    // リサイズイベントリスナーを追加
    window.addEventListener('resize', checkIfMobile);

    // クリーンアップ
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // スレッドリストの表示/非表示を切り替え
  const toggleThreadList = () => {
    setShowThreadList(!showThreadList);
  };

  return (
    <WordProvider>
      <div className={styles.layoutContainer}>
        {/* モバイル用のトグルボタン */}
        {isMobile && (
          <button 
            className={styles.toggleButton}
            onClick={toggleThreadList}
          >
            {showThreadList ? '×' : '≡'}
          </button>
        )}

        {/* スレッドリスト - モバイルでは条件付きクラス適用 */}
        <div 
          className={`${styles.threadListWrapper} ${
            isMobile && showThreadList ? styles.threadListVisible : ''
          } ${isMobile && !showThreadList ? styles.threadListHidden : ''}`}
        >
          <ChatThreadList />
        </div>

        {/* チャットコンテンツ */}
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </div>
    </WordProvider>
  );
}
