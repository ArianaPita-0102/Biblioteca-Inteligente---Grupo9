import { useEffect, useState } from 'react';
import Head from 'next/head';
import BookCard from '@/components/BookCard';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import Skeleton from '@/components/Skeleton';
import { Book, searchBooks } from '@/services/openLibraryService';
import styles from '@/styles/index.module.scss';

const TOPICS = [
  { label: 'Software Engineering', value: 'software engineering' },
  { label: 'Programming', value: 'programming' },
  { label: 'Database', value: 'database' },
  { label: 'JavaScript', value: 'javascript' },
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState(TOPICS[0].value);

  const fetchBooks = async (topic: string) => {
    setLoading(true);
    setError(null);
    try {
      
      const response = await searchBooks({ subject: topic, limit: 8 });
      setBooks(response);
    } catch {
      setError('No se pudieron cargar los libros. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBooks(activeTopic);
  }, [activeTopic]);

  return (
    <>
      <Head>
        <title>Biblioteca Inteligente | Inicio</title>
        <meta name="description" content="Descubre libros de ingeniería de software" />
      </Head>

      <div className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            📚 Biblioteca <span className={styles.highlight}>Inteligente</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Explora miles de libros de acceso abierto. Descubre, guarda y comparte tus favoritos.
          </p>
        </section>

        {/* Selector de temas */}
        <section className={styles.topicsSection}>
          <h2 className={styles.sectionTitle}>Explorar por tema</h2>
          <div className={styles.chips}>
            {TOPICS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                className={`${styles.chip} ${activeTopic === value ? styles.chipActive : ''}`}
                onClick={() => setActiveTopic(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Libros */}
        <section className={styles.booksSection}>
          {loading && (
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          )}

          {!loading && error && (
            <ErrorMessage message={error} />
          )}

          {!loading && !error && books.length === 0 && (
            <p className={styles.empty}>No se encontraron libros para este tema.</p>
          )}

          {!loading && !error && books.length > 0 && (
            <>
              <p className={styles.count}>
                <strong>{books.length}</strong> libros encontrados
              </p>
              <div className={styles.grid}>
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
