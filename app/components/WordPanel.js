'use client';

import { useState, useEffect } from 'react';
import styles from './WordPanel.module.css';
import { useWordContext } from '../context/WordContext';
import ToggleButton from './ToggleButton';

export default function WordPanel() {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [notes, setNotes] = useState('');
  const [savedWords, setSavedWords] = useState([]);
  // 初期設定としてサイドバーを閉じた状態にする
  const [isOpen, setIsOpen] = useState(false);
  const { selectedText } = useWordContext();
  
  // チャットから選択されたテキストが変更されたら単語フィールドに自動入力
  useEffect(() => {
    if (selectedText) {
      setWord(selectedText);
    }
  }, [selectedText]);

  // 単語保存のダミー関数（後でバックエンドAPIに接続）
  const saveWord = () => {
    if (!word.trim()) return;

    const newWord = {
      id: Date.now(),
      word: word.trim(),
      meaning: meaning.trim(),
      notes: notes.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    setSavedWords(prev => [newWord, ...prev]);
    
    // フォームをリセット
    setWord('');
    setMeaning('');
    setNotes('');
  };

  // 単語削除のダミー関数
  const deleteWord = (id) => {
    setSavedWords(prev => prev.filter(word => word.id !== id));
  };

  // モバイル表示用のトグル機能
  const togglePanel = () => {
    console.log('Toggle panel from', isOpen, 'to', !isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ToggleButton isOpen={isOpen} onClick={togglePanel} />
      <div className={`${styles.wordPanel} ${isOpen ? styles.open : styles.closed}`}>

      <div className={styles.panelContent}>
        <h2 className={styles.panelTitle}>単語帳</h2>
        
        <div className={styles.wordForm}>
          <div className={styles.formGroup}>
            <label htmlFor="word">単語</label>
            <input
              id="word"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="英単語を入力"
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="meaning">意味</label>
            <input
              id="meaning"
              type="text"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="意味を入力"
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="notes">メモ</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例文やメモを入力"
              className={styles.textarea}
            />
          </div>
          
          <button 
            onClick={saveWord} 
            className={styles.saveButton}
            disabled={!word.trim()}
          >
            保存する
          </button>
        </div>
        
        <div className={styles.wordList}>
          <h3 className={styles.listTitle}>保存した単語</h3>
          
          {savedWords.length === 0 ? (
            <p className={styles.emptyMessage}>保存された単語はありません</p>
          ) : (
            <ul className={styles.list}>
              {savedWords.map((item) => (
                <li key={item.id} className={styles.wordItem}>
                  <div className={styles.wordInfo}>
                    <div className={styles.wordHeader}>
                      <span className={styles.wordText}>{item.word}</span>
                      <button
                        onClick={() => deleteWord(item.id)}
                        className={styles.deleteButton}
                        aria-label="削除"
                      >
                        ×
                      </button>
                    </div>
                    <div className={styles.wordMeaning}>{item.meaning}</div>
                    {item.notes && <div className={styles.wordNotes}>{item.notes}</div>}
                    <div className={styles.wordDate}>保存日: {item.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
