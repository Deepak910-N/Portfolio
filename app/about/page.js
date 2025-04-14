'use client';
import styles from '../page.module.css';

import { useState, useEffect } from 'react';


export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    setScrollPosition(window.scrollX);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className={styles.scrollContainer}>
      <div className={styles.scrollContent}>
        <div className={styles.leftContent} style={{ transform: `translateX(-${scrollPosition * 0.5}px)` }}>
          <h1>Content on the Left</h1>
          <p>Some introductory content that will slide out of view.</p>
        </div>

        <div className={styles.rightContent} style={{ transform: `translateX(${scrollPosition * 0.5}px)` }}>
          <h1>Content on the Right</h1>
          <p>New content that will slide in from the right as you scroll.</p>
        </div>

        <img
          src="/assets/rocket.png"
          alt="Rocket"
          className={styles.rocket}
          style={{
            transform: `translateX(${scrollPosition * 0.3}px)`, // Move rocket based on scroll position
          }}
        />
      </div>
    </main>
  );
}
