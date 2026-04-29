import styles from '@/styles/Skeleton.module.scss';

export default function Skeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonTextTitle}></div>
      <div className={styles.skeletonTextLine}></div>
      <div className={styles.skeletonButton}></div>
    </div>
  );
}