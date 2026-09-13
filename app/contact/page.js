'use client';
import { useRef, useEffect, useState } from 'react';
import styles from './contact.module.css';
import NebulaBackground from '../components/NebulaBackground';
import { useWarpTransition } from '../components/WarpTransition';

const CONTACTS = [
  {
    label: 'Personal',
    parts: ['deepakrohit910', '@', 'gmail.com'],
    icon: '✉',
  },
  {
    label: 'Work / SAP',
    parts: ['deepak.n04', '@', 'sap.com'],
    icon: '💼',
  },
];

export default function Contact() {
  const triggerWarp = useWarpTransition();
  const [coords, setCoords] = useState({ lat: "12°58'14\"N", lon: "077°34'22\"E" });
  const [copied, setCopied] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

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

  const handleCopy = (e, parts) => {
    e.preventDefault();
    const email = parts.join('');
    navigator.clipboard.writeText(email).then(() => {
      setCopied(email);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    const email = CONTACTS[0].parts.join('');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setTimeout(() => setSending(false), 1500);
  };

  return (
    <main className={styles.page}>
      <NebulaBackground />
      <StarField />

      <nav className={styles.nav}>
        <a href="/experience" className={styles.navBack} onClick={(e) => { e.preventDefault(); triggerWarp('/experience'); }}>← MISSIONS</a>
        <span className={styles.navCenter}>
          <span className={styles.navTitle}>DEEPAK.DEV</span>
          <span className={styles.navCoords}>
            LAT: {coords.lat} &nbsp;·&nbsp; LON: {coords.lon} &nbsp;·&nbsp; ALT: 408 KM
          </span>
        </span>
        <a href="/" className={styles.navHome} onClick={(e) => { e.preventDefault(); triggerWarp('/'); }}>HOME</a>
      </nav>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Transmit a signal</p>
        <h1 className={styles.title}>Contact</h1>
        <p className={styles.subtitle}>
          Send a message or reach me directly at either address below.
        </p>

        {/* Contact form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>NAME</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>EMAIL</label>
              <input
                type="email"
                className={styles.formInput}
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>MESSAGE</label>
            <textarea
              className={styles.formTextarea}
              placeholder="What's on your mind?"
              rows={5}
              value={form.message}
              onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className={styles.formBtn} disabled={sending}>
            {sending ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE ↗'}
          </button>
        </form>

        {/* Email cards */}
        <p className={styles.orLabel}>— OR CONTACT DIRECTLY —</p>
        <div className={styles.cards}>
          {CONTACTS.map((c) => {
            const email = c.parts.join('');
            const isCopied = copied === email;
            return (
              <a
                key={c.label}
                href={`mailto:${email}`}
                className={styles.card}
                onClick={(e) => handleCopy(e, c.parts)}
              >
                <span className={styles.cardIcon}>{c.icon}</span>
                <span className={styles.cardLabel}>{c.label}</span>
                <span className={styles.cardEmail}>
                  {c.parts[0]}<span className={styles.emailAt}>@</span>{c.parts[2]}
                </span>
                <span className={`${styles.cardCopy} ${isCopied ? styles.cardCopied : ''}`}>
                  {isCopied ? '✓ COPIED' : 'CLICK TO COPY'}
                </span>
              </a>
            );
          })}
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

    const stars = Array.from({ length: 160 }, () => ({
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
