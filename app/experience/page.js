'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './experience.module.css';
import NebulaBackground from '../components/NebulaBackground';
import { useWarpTransition } from '../components/WarpTransition';

const TIMELINE = [
  {
    year: '2026',
    type: 'MISSION',
    org: 'SAP Labs India',
    role: 'Scholar Program — MD\'s Office, Innovation Team',
    desc: 'Selected for the SAP Scholar Program — a prestigious rotational track combining work and higher education. First rotation placed in the MD\'s Office Innovation Team, working on high-impact internal initiatives. Pursuing an M.Tech in Software Engineering from BITS Pilani alongside the role.',
    tags: ['SAP', 'Innovation', 'Scholar Program', 'BITS Pilani', 'M.Tech'],
  },
  {
    year: '2025–26',
    type: 'MISSION',
    org: 'EXL Services',
    role: 'Data Analyst Intern — NLP Team (Onsite)',
    desc: 'Analyzed quarterly team-wise cost consumption patterns using SQL and Excel to identify key trends and insights. Developed an internal PHI Masking Tool using FastAPI, Click CLI, SQLite, and pytest — enabling secure and efficient data masking for the NLP team.',
    tags: ['Python', 'FastAPI', 'SQLite', 'SQL', 'pytest', 'Click CLI'],
  },
  {
    year: '2025',
    type: 'MISSION',
    org: 'Elevate Labs',
    role: 'SQL Developer Intern (Remote)',
    desc: 'Implemented a Hospital Management System using MySQL Workbench. Studied and applied advanced SQL concepts including Triggers, Stored Procedures, and User-Defined Functions in a real-world schema.',
    tags: ['MySQL', 'MySQL Workbench', 'SQL', 'Triggers', 'Functions'],
  },
  {
    year: '2024',
    type: 'DISCOVERY',
    org: 'Technoteen Ideathon',
    role: 'First Place — ₹10,000 Cash Prize',
    desc: 'Won first place at Technoteen, a college-level ideathon conducted across various departments. Presented a working prototype and took home a cash prize of ₹10,000.',
    tags: ['Ideathon', 'Prototype', 'Problem Solving'],
  },
  {
    year: '2024',
    type: 'DISCOVERY',
    org: 'GDG Solution Challenge',
    role: 'National Hackathon — Top 100 Teams',
    desc: 'Participated in the national-level Google Developer Groups Solution Challenge hackathon. Shortlisted among the initial top 100 teams out of thousands of entries across India.',
    tags: ['Google', 'GDG', 'Hackathon', 'National Level'],
  },
  {
    year: '2022',
    type: 'LAUNCH',
    org: 'LICET — Chennai',
    role: 'B.E. Computer Science & Engineering',
    desc: 'Pursuing Computer Science and Engineering at Loyola ICAM College of Engineering and Technology. CGPA: 8.52 / 10. Core coursework covers algorithms, operating systems, databases, and software engineering.',
    tags: ['Algorithms', 'DBMS', 'OS', 'Software Engineering'],
  },
  {
    year: '2022',
    type: 'ORIGIN',
    org: 'Bethel Matric. Hr. Sec. School',
    role: 'HSC — 94.6%',
    desc: 'Completed higher secondary schooling in Chennai with a score of 94.6% in the Tamil Nadu HSC board examinations.',
    tags: ['HSC', 'Tamil Nadu Board', '94.6%'],
  },
];

const CERTS = [
  { issuer: 'Infosys Springboard', title: 'HTML5 & Software Engineering' },
  { issuer: 'Oracle Academy', title: 'Database Programming with SQL' },
  { issuer: 'LeetCode', title: 'MySQL Badge' },
];

const TYPE_COLORS = {
  MISSION:   '#3a6ee8',
  DISCOVERY: '#6496c8',
  LAUNCH:    '#8a4ee8',
  ORIGIN:    '#3a8ec8',
};

export default function Experience() {
  const triggerWarp = useWarpTransition();
  const sectionsRef = useRef([]);
  const [coords, setCoords] = useState({ lat: "12°58'14\"N", lon: "077°34'22\"E" });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add(styles.visible);
        });
      },
      { threshold: 0.12 }
    );
    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let sec = 14, lsec = 22;
    const id = setInterval(() => {
      sec = (sec + 1) % 60;
      lsec = (lsec + 1) % 60;
      setCoords({
        lat: `12°58'${String(sec).padStart(2, '0')}"N`,
        lon: `077°34'${String(lsec).padStart(2, '0')}"E`,
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const addRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el);
  };

  return (
    <main className={styles.page}>
      <NebulaBackground />
      <StarField />

      <nav className={styles.nav}>
        <a href="/about" className={styles.navBack} onClick={(e) => { e.preventDefault(); triggerWarp('/about'); }}>← CREW MANIFEST</a>
        <span className={styles.navCenter}>
          <span className={styles.navTitle}>DEEPAK.DEV</span>
          <span className={styles.navCoords}>
            LAT: {coords.lat} &nbsp;·&nbsp; LON: {coords.lon} &nbsp;·&nbsp; ALT: 408 KM
          </span>
        </span>
        <a href="/contact" className={styles.navNext} onClick={(e) => { e.preventDefault(); triggerWarp('/contact'); }}>TRANSMIT SIGNAL →</a>
      </nav>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Mission Log</p>
        <h1 className={styles.title}>Missions</h1>
        <p className={styles.subtitle}>Internships, achievements, and the academic launch pad.</p>
      </section>

      <section className={styles.timelineSection}>
        <div className={styles.line} />
        {TIMELINE.map((item, i) => (
          <div
            key={i}
            className={`${styles.entry} ${i % 2 === 0 ? styles.left : styles.right} ${styles.revealEntry}`}
            ref={addRef}
          >
            <div className={styles.dot} style={{ '--dot-color': TYPE_COLORS[item.type] ?? '#3a6ee8' }} />
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardType} style={{ color: TYPE_COLORS[item.type] ?? '#3a6ee8' }}>
                  ◆ {item.type}
                </span>
                <span className={styles.cardYear}>{item.year}</span>
              </div>
              <h3 className={styles.cardOrg}>{item.org}</h3>
              <p className={styles.cardRole}>{item.role}</p>
              <p className={styles.cardDesc}>{item.desc}</p>
              <div className={styles.tags}>
                {item.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.certsSection}>
        <h2 className={styles.certsTitle}>Certifications</h2>
        <div className={styles.certsGrid}>
          {CERTS.map((c) => (
            <div key={c.title} className={styles.certCard}>
              <span className={styles.certIssuer}>{c.issuer}</span>
              <span className={styles.certTitle}>{c.title}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Built with Next.js · Designed in the cosmos</p>
        <div className={styles.footerLinks}>
          <a href="https://github.com/Deepak910-N" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume ↓</a>
        </div>
      </footer>
    </main>
  );
}

function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      opacity: Math.random(),
      delta: (Math.random() * 0.004 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
    }));

    const shootingStars = [];
    let frameCount = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.opacity += s.delta;
        if (s.opacity >= 1 || s.opacity <= 0) s.delta *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${s.opacity})`;
        ctx.fill();
      });

      frameCount++;
      if (frameCount % 160 === 0 && Math.random() < 0.65) {
        shootingStars.push({
          x: Math.random() * canvas.width * 0.7,
          y: Math.random() * canvas.height * 0.4,
          vx: 5 + Math.random() * 5,
          vy: 2.5 + Math.random() * 2.5,
          length: 90 + Math.random() * 70,
          opacity: 1,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const grad = ctx.createLinearGradient(
          s.x - s.vx * (s.length / 8), s.y - s.vy * (s.length / 8), s.x, s.y
        );
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, `rgba(220,235,255,${s.opacity})`);
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * (s.length / 8), s.y - s.vy * (s.length / 8));
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
        s.x += s.vx;
        s.y += s.vy;
        s.opacity -= 0.011;
        if (s.opacity <= 0) shootingStars.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.starCanvas} aria-hidden="true" />;
}
