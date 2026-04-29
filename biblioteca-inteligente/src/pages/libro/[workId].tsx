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
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (!workId || typeof workId !== 'string') return;

    const fetchData = async () => {
      setLoading(true);

      const data = await getBookDetail(workId);
      setBook(data);

      if (data) {
        setFavorite(isFavorite(data.id));
      }

      setLoading(false);
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

  return (
    <div className={styles['book-detail-page']}>
      {loading && <p>Cargando...</p>}

      {!loading && book && (
        <div className={styles['book-detail']}>
          <img src={book.coverUrl || '/placeholder.png'} alt={book.title} />
          <h1>{book.title}</h1>
          <p>{book.authors?.join(', ') || 'Autor desconocido'}</p>
          <p>Año: {book.year || 'N/A'}</p>
          <p>Ediciones: {book.editions}</p>

          <div className={styles['actions']}>
            <button onClick={handleFavorite}>
              {favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            </button>
          </div>
        </div>
      )}

      {!loading && !book && <p>No se pudo cargar el libro.</p>}
    </div>
  );
}