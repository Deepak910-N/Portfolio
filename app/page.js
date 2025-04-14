'use client';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    setTimeout(() => {
      router.push('/about'); // Change this to your target route
    }, 1500);
  };

  return (
    <main className={styles.container}>
      <StarryCursor />

      <div className={styles.textBlock}>
        <h3 className={styles.subheading}>A Message From Earth---------------------------------------------------</h3>
        <h2 className={styles.heading}>HELLO FELLOW GALAXY MEMBER</h2>
        <h2 className={styles.name}>----------------------------------------------------SPECIES:HOMO SAPIENS</h2>
        
        <img 
          src="/assets/clickme.png" 
          alt="Click Me" 
          className={styles.clickImage} 
          onClick={handleClick}
        />
      </div>

      <div className={`${styles.earthSection} ${animate ? styles.animateAstronaut : ''}`}>
        <img src="/assets/astronaut1.png" alt="Astronaut" className={styles.astronaut} />
      </div>

      <div className={styles.socials}>
        <a href="#"><img src="/assets/github.png" alt="GitHub" /></a>
        <a href="#"><img src="/assets/instagram.png" alt="Instagram" /></a>
        <a href="#"><img src="/assets/linkedin.png" alt="LinkedIn" /></a>
      </div>

      <a className={styles.contact} href="/contact">Contact Me</a>

      {animate && <div className={styles.overlay}></div>}
    </main>
  );
}

function StarryCursor() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const star = document.createElement('div');
      star.className = 'star-cursor';
      star.style.left = `${e.clientX}px`;
      star.style.top = `${e.clientY}px`;
      document.body.appendChild(star);

      setTimeout(() => {
        star.remove();
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <style jsx global>{`
      .star-cursor {
        position: fixed;
        width: 6px;
        height: 6px;
        background: white;
        box-shadow: 0 0 8px 3px #ffffff99;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: sparkle 0.8s ease-out forwards;
      }

      @keyframes sparkle {
        0% {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        100% {
          transform: scale(0.3) translateY(-10px);
          opacity: 0;
        }
      }
    `}</style>
  );
}
