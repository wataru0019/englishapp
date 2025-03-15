"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import WordCard from './WordCard';
import styles from "./styles.module.css";

export default function WordsPage() {
  const router = useRouter();
  const [showMeaning, setShowMeaning] = useState({
    word1: false,
    word2: false,
    word3: false,
    word4: false,
  });

  // ダミーデータ - 実際のアプリでは、APIやデータベースからデータを取得します
  const words = [
    {
      id: 'word1',
      title: 'Perseverance',
      example: 'His perseverance paid off and he finally achieved his goal after years of hard work.',
      meaning: '忍耐力、粘り強さ。困難や障害にもかかわらず、目標に向かって継続する能力。'
    },
    {
      id: 'word2',
      title: 'Meticulous',
      example: 'She is meticulous in her work, paying attention to every small detail.',
      meaning: '几帳面な、綿密な。非常に注意深く、細部まで気を配る様子。'
    },
    {
      id: 'word3',
      title: 'Versatile',
      example: 'The versatile actor can perform in comedy, drama, and action films with equal skill.',
      meaning: '多才な、多目的の。様々な状況や目的に対応できる能力を持つこと。'
    },
    {
      id: 'word4',
      title: 'Paradigm',
      example: 'The discovery of DNA created a new paradigm in our understanding of genetics.',
      meaning: 'パラダイム、規範。特定の分野や状況における考え方や概念の枠組み。'
    }
  ];

  // 意味を表示/非表示の切り替え
  const toggleMeaning = (wordId) => {
    setShowMeaning(prev => ({
      ...prev,
      [wordId]: !prev[wordId]
    }));
  };

  // ホーム画面に戻る
  const goBack = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className="p-6">
        <h1 className={styles.title}>今日の英単語</h1>
        
        <div className="mb-4">
          <h2 className={styles.sectionTitle}>単語</h2>
          <hr className={styles.divider} />
        </div>

        <div className="space-y-4">
          {words.map((word) => (
            <WordCard 
              key={word.id}
              word={word}
              showMeaning={showMeaning[word.id]}
              toggleMeaning={() => toggleMeaning(word.id)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={goBack}
            className={styles.backButton}
          >
            戻る
          </button>
        </div>
      </main>
    </div>
  );
}
