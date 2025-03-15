"use client";

import React from 'react';
import styles from "./styles.module.css";

const WordCard = ({ word, showMeaning, toggleMeaning }) => {
  return (
    <div className={styles.card}>
      <div className="space-y-2">
        <h3 className={styles.wordTitle}>{word.title}</h3>
        <p className={styles.example}>{word.example}</p>
        {showMeaning && (
          <p className={styles.meaning}>{word.meaning}</p>
        )}
      </div>
      <div className="w-full">
        <button
          onClick={toggleMeaning}
          className={styles.checkButton}
        >
          {showMeaning ? "意味を隠す" : "意味を確認する"}
        </button>
      </div>
    </div>
  );
};

export default WordCard;
