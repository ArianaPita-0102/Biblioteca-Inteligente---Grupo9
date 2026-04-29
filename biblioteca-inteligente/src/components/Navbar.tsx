import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/Navbar.module.scss';

export default function Navbar() {
  const [theme, setTheme] = useState<string>('light');
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

  return (
    <header className={styles.header}>
      <div className={styles.navbarContainer}>
        <div className={styles.logo}>
          <Link href="/">📚 Biblioteca UI</Link>
        </div>
        <nav className={styles.navLinks}>
          <Link href="/">Inicio</Link>
          <Link href="/buscar">Búsqueda</Link>
          <Link href="/favoritos">Favoritos</Link>
          <Link href="/acerca">Acerca de</Link>
        </nav>
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}