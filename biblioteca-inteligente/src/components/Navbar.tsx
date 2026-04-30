import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Navbar.module.scss';

export default function Navbar() {
  const [theme, setTheme] = useState<string>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.navbarContainer}>
        <div className={styles.logo}>
          <Link href="/" onClick={closeMenu}>Biblioteca UI</Link>
        </div>

        {/* Botón Hamburguesa para móviles */}
        <button 
          className={styles.hamburger} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menú"
        >
          <span className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></span>
        </button>

        <nav className={`${styles.navLinks} ${isMenuOpen ? styles.showMenu : ''}`}>
          <Link href="/" className={router.pathname === '/' ? styles.active : ''} onClick={closeMenu}>
            Inicio
          </Link>
          <Link href="/buscar" className={router.pathname === '/buscar' ? styles.active : ''} onClick={closeMenu}>
            Búsqueda
          </Link>
          <Link href="/favoritos" className={router.pathname === '/favoritos' ? styles.active : ''} onClick={closeMenu}>
            Favoritos
          </Link>
          <Link href="/acerca" className={router.pathname === '/acerca' ? styles.active : ''} onClick={closeMenu}>
            Acerca de
          </Link>
          
          <button className={styles.themeToggle} onClick={toggleTheme}>
            {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
          </button>
        </nav>
      </div>
    </header>
  );
}