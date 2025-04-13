import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.container}>
  <div className={styles.textBlock}>
  <h3 className={styles.subheading}>A Message From Earth---------------------------------------------------</h3>
    <h2 className={styles.heading}>HELLO FELLOW GALAXY MEMBER</h2>
    
    <h2 className={styles.name}>----------------------------------------------------SPECIES:HOMO SAPIENS</h2>
    <h1 className={styles.nheading}> From Deepak.N,</h1>
  </div>

  <div className={styles.earthSection}>
    <img src="/assets/astronaut.png" alt="Astronaut on Earth" className={styles.astronaut} />
  </div>

  <div className={styles.socials}>
    <a href="#"><img src="/assets/github.png" alt="GitHub" /></a>
    <a href="#"><img src="/assets/instagram.png" alt="Instagram" /></a>
    <a href="#"><img src="/assets/linkedin.png" alt="LinkedIn" /></a>
    <a href="#"><img src="/assets/behance.png" alt="Behance" /></a>
  </div>

  <a className={styles.contact} href="#">Contact Me</a>
  <div className={styles.scroll}>Scroll</div>
</main>

  );
}
