'use client';

import styles from './page.module.css';
import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ParallaxStarfield from './components/ParallaxStarfield';
import NebulaBackground from './components/NebulaBackground';
import { useWarpTransition } from './components/WarpTransition';

export default function Home() {
  const triggerWarp = useWarpTransition();
  const [animate, setAnimate] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [coords, setCoords] = useState({ lat: "12°58'14\"N", lon: "077°34'22\"E" });

  const handleClick = () => {
    setAnimate(true);
    setTimeout(() => {
      triggerWarp('/about');
    }, 900);
  };

  useEffect(() => {
    let sec = 14;
    let lsec = 22;
    const id = setInterval(() => {
      sec = (sec + 1) % 60;
      lsec = (lsec + 1) % 60;
      setCoords({
        lat: `12°58'${String(sec).padStart(2,'0')}"N`,
        lon: `077°34'${String(lsec).padStart(2,'0')}"E`,
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <main className={styles.container}>
        <NebulaBackground />
        <ParallaxStarfield />
        <StarryCursor />

        <nav className={styles.topNav}>
          <span className={styles.navBrand}>DEEPAK.DEV</span>
          <span className={styles.navCoords}>
            LAT: {coords.lat} &nbsp;·&nbsp; LON: {coords.lon} &nbsp;·&nbsp; ALT: 408 KM
          </span>
          <a className={styles.contact} href="/contact" onClick={(e) => { e.preventDefault(); triggerWarp('/contact'); }}>
            Contact
          </a>
        </nav>

        <div className={styles.textBlock}>
          <p className={styles.subheading}>A MESSAGE FROM EARTH</p>
          <h2 className={styles.heading}>HELLO FELLOW GALAXY MEMBER</h2>
          <p className={styles.name}>SPECIES: HOMO SAPIENS</p>

          <img
            src="/assets/clickme.png"
            alt="Click Me"
            className={styles.clickImage}
            onClick={handleClick}
          />
          <p className={`${styles.enterHint} ${animate ? styles.enterHintHidden : ''}`}>
            CLICK TO ENTER ↓
          </p>
        </div>

        <div className={`${styles.earthSection} ${animate ? styles.animateAstronaut : ''}`}>
          <img src="/assets/astronaut1.png" alt="Astronaut" className={styles.astronaut} />
        </div>

        <div className={styles.socials}>
          <a href="https://github.com/Deepak910-N" target="_blank" rel="noopener noreferrer"><img src="/assets/github.png" alt="GitHub" /></a>
          <a href="https://www.instagram.com/_deepak_n23_?igsi=MXRubjJqcHc5NWRlMw==" target="_blank" rel="noopener noreferrer"><img src="/assets/instagram.png" alt="Instagram" /></a>
          <a href="https://www.linkedin.com/in/deepak-n-b546b4300/" target="_blank" rel="noopener noreferrer"><img src="/assets/linkedin.png" alt="LinkedIn" /></a>
        </div>

        <div className={styles.planet} aria-hidden="true" />

        <footer className={styles.homeFooter}>
          <a href="https://github.com/Deepak910-N" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume ↓</a>
        </footer>
      </main>
    </>
  );
}

function StarryCursor() {
  useEffect(() => {
    let lastX = 0, lastY = 0;

    const handleMouseMove = (e) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      lastX = e.clientX;
      lastY = e.clientY;

      const count = Math.min(Math.floor(speed * 0.4) + 1, 5);
      for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star-cursor';
        const offset = 6;
        star.style.left = `${e.clientX + (Math.random() - 0.5) * offset}px`;
        star.style.top  = `${e.clientY + (Math.random() - 0.5) * offset}px`;
        const size = Math.random() * 5 + 3;
        star.style.width  = `${size}px`;
        star.style.height = `${size}px`;
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 700);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <style jsx global>{`
      .star-cursor {
        position: fixed;
        background: white;
        box-shadow: 0 0 6px 2px rgba(180, 210, 255, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: sparkle 0.7s cubic-bezier(0.4, 0, 0.6, 1) forwards;
      }

      @keyframes sparkle {
        0%   { transform: scale(1) translateY(0);    opacity: 1; }
        60%  { transform: scale(0.6) translateY(-8px); opacity: 0.6; }
        100% { transform: scale(0) translateY(-14px); opacity: 0; }
      }
    `}</style>
  );
}
