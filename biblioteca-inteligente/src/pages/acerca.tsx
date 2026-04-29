import styles from '@/styles/acerca.module.scss';

export default function Acerca() {
  return (
    <div className={styles.aboutContainer}>
      <section className={styles.headerSection}>
        <h1>Acerca del Proyecto</h1>
        <p>
          "Biblioteca Inteligente" es un proyecto desarrollado por estudiantes de Ingeniería de Sistemas 
          de la Universidad Católica Boliviana "San Pablo" (UCB).
        </p>
      </section>

      <section className={styles.teamSection}>
        <h2>Nuestro Equipo</h2>
        <div className={styles.teamGrid}>
          <div className={styles.memberCard}>
            <h3>Camilo Andre Rodriguez</h3>
            <span className={styles.role}>Arquitecto UI</span>
            <p>Responsable de la base visual, diseño responsive, y experiencia del modo oscuro.</p>
          </div>
          
          <div className={styles.memberCard}>
            <h3>Ariana</h3>
            <span className={styles.role}>Data Engineer</span>
            <p>Especialista en integración de APIs, filtros dinámicos y arquitectura de búsqueda.</p>
          </div>

          <div className={styles.memberCard}>
            <h3>Ostin</h3>
            <span className={styles.role}>Especialista de Estado</span>
            <p>Encargado de la persistencia de datos, páginas de detalle y manipulación del estado global.</p>
          </div>
        </div>
      </section>
    </div>
  );
}