'use client';

import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('https://englishapp-1088649073221.asia-northeast1.run.app/api/v1/words/');
        const data = await response.json();
        setHealthStatus(data);
      } catch (err) {
        setError('Failed to fetch health status');
        console.error(err);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {error && <p className={styles.error}>{error}</p>}
        {healthStatus && (
          <div className={styles.healthStatus}>
            <p>API Status: {JSON.stringify(healthStatus)}</p>
          </div>
        )}
        <h1>自信を持って英語をマスターしよう</h1>
        <p className={styles.subtitle}>
          Interactive lessons, real-world practice, and personalized feedback
        </p>
        
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h3>Daily Practice</h3>
            <p>Learn with bite-sized lessons that fit your schedule</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Interactive Speaking</h3>
            <p>Practice pronunciation with AI-powered feedback</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Progress Tracking</h3>
            <p>Monitor your improvement with detailed analytics</p>
          </div>
        </div>

        <div className={styles.ctas}>
          <Link href="/signup" className={styles.primary}>
            Get Started Free
          </Link>
          <Link href="/about" className={styles.secondary}>
            Learn More
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/sentences">Sentences</Link>
      </footer>
    </div>
  );
}
