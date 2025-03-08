'use client';

import styles from "./page.module.css";
import Link from "next/link";
import Button from "./components/Button";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Master English with Confidence</h1>
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
      </footer>
    </div>
  );
}