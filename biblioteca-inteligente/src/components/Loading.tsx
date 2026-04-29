import styles from '@/styles/Loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p>Cargando información...</p>
    </div>
  );
}