import { useEffect, useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import BookCard from '@/components/BookCard';
import ErrorMessage from '@/components/ErrorMessage';
import Skeleton from '@/components/Skeleton';
import { Book, searchBooks } from '@/services/openLibraryService';
import styles from '@/styles/index.module.scss';

const TOPICS = [
  { label: 'Software Engineering', value: 'software engineering' },
  { label: 'Programming', value: 'programming' },
  { label: 'Database', value: 'database' },
  { label: 'JavaScript', value: 'javascript' },
];

interface HomeProps {
  initialBooks: Book[];
}

export default function Home({ initialBooks }: HomeProps) {
  // Inicializamos directamente con los libros pre-cargados por el servidor
  const [books, setBooks] = useState<Book[]>(initialBooks || []);
  const [loading, setLoading] = useState(false); // Ya no hay pantalla de carga inicial
  const [error, setError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState(TOPICS[0].value);
  const [isFirstRender, setIsFirstRender] = useState(true);

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
    if (isFirstRender) {
      setIsFirstRender(false);
      return; // Saltamos la petición en el primer montaje porque ya tenemos los datos
    }
    void fetchBooks(activeTopic);
  }, [activeTopic]);

  return (
    <>
      <Head>
        <title>Biblioteca Inteligente | Inicio</title>
        <meta name="description" content="Descubre libros de ingeniería de software" />
      </Head>

      <div className={styles.page}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Biblioteca <span className={styles.highlight}>Inteligente</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Explora miles de libros de acceso abierto. Descubre, guarda y comparte tus favoritos.
          </p>
        </section>

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

        <section className={styles.booksSection}>
          {loading && (
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          )}

          {!loading && error && <ErrorMessage message={error} />}

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

// Pre-renderiza la página en el servidor (Mejora brutal de Lighthouse)
export const getStaticProps: GetStaticProps = async () => {
  try {
    const initialBooks = await searchBooks({ subject: 'software engineering', limit: 8 });
    return {
      props: { initialBooks },
      revalidate: 86400, // Revalida la caché cada 24h
    };
  } catch {
    return {
      props: { initialBooks: [] },
    };
  }
};