import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getBookDetail, BookDetail } from '@/services/openLibraryService';
import { addFavorite, removeFavorite, isFavorite } from '@/utils/storage';
import styles from '@/styles/BookDetailPage.module.scss';

export default function BookDetailPage() {
  const router = useRouter();
  const { workId } = router.query;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (!workId || typeof workId !== 'string') return;

    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await getBookDetail(workId);
        setBook(data);

        if (data) {
          setFavorite(isFavorite(data.id));
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workId]);

  const handleFavorite = () => {
    if (!book) return;

    if (favorite) {
      removeFavorite(book.id);
    } else {
      addFavorite(book);
    }

    setFavorite(!favorite);
  };

  if (loading) {
    return <p className={styles.message}>Cargando...</p>;
  }

  if (error) {
    return <p className={styles.message}>Error al cargar el libro</p>;
  }

  if (!book) {
    return <p className={styles.message}>No hay información disponible</p>;
  }

  return (
    <div className={styles['book-detail-page']}>
      <button className={styles['back-button']} onClick={() => router.back()}>
        Volver
      </button>

      <div className={styles['book-detail']}>
        <img
          src={book.coverUrl || '/placeholder.png'}
          alt={book.title}
          className={styles['book-cover']}
        />

        <div className={styles['book-info']}>
          <h1>{book.title}</h1>

          <p>
            <strong>Descripción:</strong>{' '}
            {book.description || 'No hay descripción disponible para este libro.'}
          </p>

          <p>
            <strong>Autores:</strong>{' '}
            {book.authors.length > 0
              ? book.authors.join(', ')
              : 'Autor desconocido'}
          </p>

          <p>
            <strong>Año de publicación:</strong> {book.year || 'N/A'}
          </p>

          <div>
            <strong>Temas relacionados:</strong>
            {book.subjects.length > 0 ? (
              <ul className={styles.subjects}>
                {book.subjects.map((subject) => (
                  <li key={subject}>{subject}</li>
                ))}
              </ul>
            ) : (
              <p>No hay temas disponibles.</p>
            )}
          </div>

          <a
            href={`https://openlibrary.org/works/${book.id}`}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Ver en Open Library
          </a>

          <div className={styles.actions}>
            <button onClick={handleFavorite}>
              {favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}