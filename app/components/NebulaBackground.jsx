import styles from './NebulaBackground.module.css';

export default function NebulaBackground() {
  return (
    <div className={styles.nebula} aria-hidden="true">
      <span className={`${styles.blob} ${styles.blob1}`} />
      <span className={`${styles.blob} ${styles.blob2}`} />
      <span className={`${styles.blob} ${styles.blob3}`} />
      <span className={`${styles.blob} ${styles.blob4}`} />
    </div>
  );
}
