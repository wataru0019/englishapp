"use client";

import React, { useState } from 'react';
import styles from './sentences.module.css';

const passage = `The quick brown fox jumps over the lazy dog. This is a sample passage for the English reading comprehension app. It is designed to test your understanding of the English language.`;

const questions = [
  {
    id: 1,
    text: 'What does the fox jump over?',
    options: ['The lazy dog', 'The quick dog', 'The brown dog'],
    answer: 'The lazy dog',
  },
  {
    id: 2,
    text: 'What color is the fox?',
    options: ['Red', 'Brown', 'Black'],
    answer: 'Brown',
  },
];

const SentencesPage = () => {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.answer) {
        correctAnswers++;
      }
    });

    setFeedback(`You got ${correctAnswers} out of ${questions.length} questions correct!`);
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>English Reading Comprehension</h1>
      <div className={styles.passage}>
        <h2>Passage</h2>
        <p>{passage}</p>
      </div>
      <div>
        <h2>Questions</h2>
        {questions.map((question) => (
          <div key={question.id} className={styles.question}>
            <p>{question.text}</p>
            <ul className={styles.optionsList}>
              {question.options.map((option) => (
                <li key={option} className={styles.optionItem}>
                  <label className={styles.radioLabel}>
                    <input
                      className={styles.radioInput}
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      onChange={() => handleAnswerChange(question.id, option)}
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>
            {feedback && answers[question.id] !== question.answer && (
              <p className={styles.correctAnswer}>Correct answer: {question.answer}</p>
            )}
          </div>
        ))}
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
        {feedback && <p className={styles.feedback}>{feedback}</p>}
      </div>
    </div>
  );
};

export default SentencesPage;
