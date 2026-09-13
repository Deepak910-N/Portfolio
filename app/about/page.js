'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './about.module.css';
import NebulaBackground from '../components/NebulaBackground';
import { useWarpTransition } from '../components/WarpTransition';

const SKILLS = [
  { label: 'Python', level: 80, note: '3 yrs' },
  { label: 'MySQL / SQL', level: 85, note: '3 yrs' },
  { label: 'React / React Native', level: 75, note: '2 yrs' },
  { label: 'Java', level: 70, note: '2 yrs' },
  { label: 'FastAPI', level: 75, note: '1 yr' },
  { label: 'Git & Docker', level: 70, note: '2 yrs' },
];

const PROJECTS = [
  {
    title: 'Dépense',
    desc: 'Full-stack personal expense tracker. Track daily spending, auto-log recurring payments, visualise budgets with pie/bar charts, and get daily email reminders — all on free-tier infrastructure.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Python', 'FastAPI', 'PostgreSQL'],
    link: 'https://github.com/Deepak910-N/Depense',
    role: 'Full-Stack Developer',
    status: 'Personal Project',
    highlights: [
      'Manual expense entry with date, amount, vendor & payment method',
      'Vendor auto-suggest that learns from your spending history',
      'Recurring expense auto-logging for rent, subscriptions & EMIs',
      'Dashboard with pie charts (by vendor) and monthly bar charts',
      'Budget tracking with progress bar, alerts & month-over-month comparison',
      'Logging streak gamification + daily email reminders (2×/day)',
    ],
  },
  {
    title: 'HealO',
    desc: 'Production-ready MVP healthcare platform with AI-powered symptom triage, doctor discovery and appointment booking, and role-based access for patients and doctors.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    link: 'https://github.com/Deepak910-N/HealO',
    role: 'Full-Stack Developer',
    status: 'MVP',
    highlights: [
      'AI triage engine — patient inputs symptoms, gets specialty & urgency recommendation',
      'Doctor discovery and appointment booking flow',
      'Doctor dashboard to manage and view upcoming appointments',
      'Role-based access control (patient vs. doctor)',
      'Supabase PostgreSQL backend with Row-Level Security',
      'App Router API routes for AI, auth, and appointment management',
    ],
  },
  {
    title: 'PHI Masker',
    desc: 'Production-grade CLI and REST API pipeline that detects and masks 17+ PHI/PII entity types in medical datasets using the nvidia/gliner-PII model, with quality grading and async job tracking.',
    tech: ['Python', 'FastAPI', 'GLiNER', 'HuggingFace', 'Docker'],
    link: 'https://github.com/Deepak910-N/PHI_MASKER',
    role: 'ML / Backend Engineer',
    status: 'Production-Grade Tool',
    highlights: [
      'Detects 17+ PHI/PII entity types — names, SSNs, phones, emails, medical record numbers',
      '6-step orchestrated pipeline: load → preprocess → detect → mask → validate → export',
      'Post-masking residual PHI validation using regex pattern matching',
      'Quality grading (A/B/C/D) based on confidence scores and entity coverage',
      'REST API with sync and async processing modes + in-memory job manager',
      'Dockerised deployment; output in Parquet, CSV, or JSON',
    ],
  },
];

/* ── Split text helpers ─────────────────────────────────────────── */

function SplitChars({ text, className, charClass }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className={charClass}
          style={{ '--i': i }}
          aria-hidden="true"
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

function SplitWords({ text, className, wordClass }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span key={i} className={styles.wordOuter}>
          <span
            className={wordClass}
            style={{ '--i': i }}
            aria-hidden="true"
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ── Scramble title hook ────────────────────────────────────────── */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

function useScramble(targetText, triggered) {
  const [display, setDisplay] = useState(targetText);
  const rafRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!triggered) return;
    frameRef.current = 0;
    const totalFrames = targetText.length * 4;

    const tick = () => {
      frameRef.current++;
      const progress = frameRef.current / totalFrames;
      const resolved = Math.floor(progress * targetText.length);
      setDisplay(
        targetText
          .split('')
          .map((ch, i) => {
            if (i < resolved) return ch;
            if (ch === ' ') return ' ';
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );
      if (frameRef.current < totalFrames) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(targetText);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [triggered, targetText]);

  return display;
}

/* ── Scramble title component ───────────────────────────────────── */
function ScrambleTitle({ text, className }) {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);
  const display = useScramble(text, triggered);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <h2 ref={ref} className={className} aria-label={text}>
      {display}
    </h2>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function About() {
  const triggerWarp = useWarpTransition();
  const sectionsRef = useRef([]);
  const [coords, setCoords] = useState({ lat: "12°58'14\"N", lon: "077°34'22\"E" });
  const [expanded, setExpanded] = useState(null);
  const [displayExpanded, setDisplayExpanded] = useState(null);
  const [projExiting, setProjExiting] = useState(false);
  const exitTimerRef = useRef(null);

  const handleExpand = (title) => {
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    setProjExiting(true);
    exitTimerRef.current = setTimeout(() => {
      setExpanded(title);
      setDisplayExpanded(title);
      setProjExiting(false);
    }, 260);
  };

  const handleCollapse = () => {
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    setProjExiting(true);
    exitTimerRef.current = setTimeout(() => {
      setExpanded(null);
      setDisplayExpanded(null);
      setProjExiting(false);
    }, 260);
  };

  useEffect(() => () => clearTimeout(exitTimerRef.current), []);
  const [scrollY, setScrollY] = useState(0);

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

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    const dy = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-dy * 0.012}deg) rotateY(${dx * 0.012}deg) translateY(-6px)`;
  };

  const resetTilt = (e) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <main className={styles.page}>
      <NebulaBackground />
      <StarField />

      <nav className={styles.nav}>
        <a href="/" className={styles.navBack} onClick={(e) => { e.preventDefault(); triggerWarp('/'); }}>← MISSION BASE</a>
        <span className={styles.navCenter}>
          <span className={styles.navTitle}>DEEPAK.DEV</span>
          <span className={styles.navCoords}>
            LAT: {coords.lat} &nbsp;·&nbsp; LON: {coords.lon} &nbsp;·&nbsp; ALT: 408 KM
          </span>
        </span>
        <a href="/experience" className={styles.navContact} onClick={(e) => { e.preventDefault(); triggerWarp('/experience'); }}>MISSIONS →</a>
      </nav>

      {/* Hero / Bio */}
      <section className={`${styles.section} ${styles.hero}`} ref={addRef}>
        <div className={styles.heroInner}>

          {/* Greeting — chars slide up from clip */}
          <p className={styles.greeting} aria-label="Hello, universe. I'm">
            {'Hello, universe. I\'m'.split('').map((ch, i) => (
              <span
                key={i}
                className={styles.greetingChar}
                style={{ '--i': i, animationDelay: `${0.03 + i * 0.04}s` }}
                aria-hidden="true"
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </p>

          {/* Hero name — letters scale up from small + stagger */}
          <h1 className={styles.heroName} aria-label="Deepak">
            {'Deepak'.split('').map((ch, i) => (
              <span
                key={i}
                className={styles.heroNameChar}
                style={{ '--i': i, animationDelay: `${0.2 + i * 0.07}s` }}
                aria-hidden="true"
              >
                {ch}
              </span>
            ))}
          </h1>

          {/* Bio — word-by-word reveal with clip-path */}
          <p className={styles.heroBio} aria-label="CS engineer from Chennai specialising in backend systems, databases, and full-stack development. Currently at SAP as a Scholar, pursuing an M.Tech at BITS Pilani. Deeply interested in AI systems and agentic workflows — building software that thinks, adapts, and acts.">
            {'CS engineer from Chennai specialising in backend systems, databases, and full-stack development. Currently at SAP as a Scholar, pursuing an M.Tech at BITS Pilani. Deeply interested in AI systems and agentic workflows — building software that thinks, adapts, and acts.'.split(' ').map((word, i) => (
              <span key={i} className={styles.bioWordOuter}>
                <span
                  className={styles.bioWord}
                  style={{ animationDelay: `${0.5 + i * 0.055}s` }}
                  aria-hidden="true"
                >
                  {word}{' '}
                </span>
              </span>
            ))}
          </p>

          {/* CTAs — slide up staggered */}
          <div className={styles.heroCta}>
            <button
              className={`${styles.btn} ${styles.ctaBtn}`}
              style={{ animationDelay: '1.4s' }}
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Projects
            </button>
            <a
              href="/contact"
              className={`${styles.btnOutline} ${styles.ctaBtn}`}
              style={{ animationDelay: '1.55s' }}
              onClick={(e) => { e.preventDefault(); triggerWarp('/contact'); }}
            >
              Get in Touch
            </a>
          </div>
        </div>
        <div className={styles.orbitRing} aria-hidden="true" />
        <div className={styles.moon} aria-hidden="true" />
      </section>

      {/* Skills */}
      <section id="skills" className={`${styles.section} ${styles.skillsSection}`} ref={addRef}>
        <ScrambleTitle text="Skills" className={styles.sectionTitle} />
        <div className={styles.skillsGrid}>
          {SKILLS.map((s, i) => (
            <div
              key={s.label}
              className={styles.skillItem}
              style={{ '--skill-i': i }}
            >
              <div className={styles.skillHeader}>
                <span>{s.label}</span>
                <span className={styles.skillMeta}>
                  <span className={styles.skillNote}>{s.note}</span>
                  <span className={styles.skillPct}>{s.level}%</span>
                </span>
              </div>
              <div className={styles.skillBar}>
                <div className={styles.skillFill} style={{ '--fill': `${s.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className={`${styles.section} ${styles.projectsSection}`} ref={addRef}>
        <ScrambleTitle text="Projects" className={styles.sectionTitle} />

        {!displayExpanded ? (
          <div className={`${styles.projectsGrid} ${projExiting ? styles.projExit : ''}`}>
            {PROJECTS.map((p, i) => (
              <div
                key={p.title}
                className={`${styles.card} ${styles.cardAnimated}`}
                style={{ '--card-i': i }}
                onClick={() => handleExpand(p.title)}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardDesc}>{p.desc}</p>
                <div className={styles.techStack}>
                  {p.tech.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
                <span className={styles.cardArrow}>↗</span>
                <span className={styles.expandHint}>↓ EXPAND</span>
              </div>
            ))}
          </div>
        ) : (() => {
          const expandedIdx = PROJECTS.findIndex(q => q.title === displayExpanded);
          const p = PROJECTS[expandedIdx];
          const siblings = PROJECTS.filter(q => q.title !== displayExpanded);
          const siblingsRow = (
            <div className={styles.siblingsRow}>
              {siblings.map((s) => (
                <div
                  key={s.title}
                  className={styles.card}
                  onClick={() => handleExpand(s.title)}
                  onMouseMove={handleTilt}
                  onMouseLeave={resetTilt}
                >
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  <p className={styles.cardDesc}>{s.desc}</p>
                  <div className={styles.techStack}>
                    {s.tech.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
                  </div>
                  <span className={styles.cardArrow}>↗</span>
                </div>
              ))}
            </div>
          );
          const expandedCard = (
            <div
              key={p.title}
              className={`${styles.card} ${styles.cardExpanded} ${projExiting ? styles.projExit : ''}`}
              onClick={handleCollapse}
            >
              <button
                className={styles.collapseBtn}
                onClick={(e) => { e.stopPropagation(); handleCollapse(); }}
                aria-label="Collapse"
              >✕</button>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.desc}</p>
              <div className={styles.techStack}>
                {p.tech.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
              <div className={styles.expandedContent}>
                <div className={styles.expandedMeta}>
                  <span className={styles.metaRole}>⌖ {p.role}</span>
                  <span className={styles.metaStatus}>{p.status}</span>
                </div>
                <ul className={styles.highlightList}>
                  {p.highlights.map((h) => (
                    <li key={h} className={styles.highlightItem}>
                      <span className={styles.highlightDot} />
                      {h}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.githubLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  VIEW ON GITHUB ↗
                </a>
              </div>
            </div>
          );
          return (
            <div className={`${styles.expandedLayout} ${projExiting ? styles.projExit : ''}`}>
              {expandedIdx === 0 ? expandedCard : siblingsRow}
              {expandedIdx === 0 ? siblingsRow : expandedCard}
            </div>
          );
        })()}
      </section>

      {/* Footer */}
      <footer className={`${styles.footer} ${styles.footerBlur}`}>
        <p>Built with Next.js · Designed in the cosmos</p>
        <div className={styles.footerLinks}>
          <a href="https://github.com/Deepak910-N" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume ↓</a>
        </div>
      </footer>

      {scrollY > 300 && (
        <button
          className={styles.backToTop}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >↑</button>
      )}
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

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.15 + 0.05,
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
          s.x - s.vx * (s.length / 8), s.y - s.vy * (s.length / 8),
          s.x, s.y
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
