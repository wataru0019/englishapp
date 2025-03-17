'use client';

import styles from './ToggleButton.module.css';

export default function ToggleButton({ isOpen, onClick }) {
  // パネルの状態に応じてボタンの位置を設定
  const buttonStyle = {
    right: isOpen ? '320px' : '0'
  };

  return (
    <button 
      className={styles.toggleButton}
      onClick={onClick}
      aria-label={isOpen ? "閉じる" : "開く"}
      style={buttonStyle}
    >
      {isOpen ? '‹' : '›'}
    </button>
  );
}
