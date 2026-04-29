import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getBookDetail, BookDetail } from '@/services/openLibraryService';
import { addFavorite, removeFavorite, isFavorite } from '@/utils/storage';

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

  if (loading) return <p>Cargando...</p>;

  if (!book) return <p>No se pudo cargar el libro.</p>;

  return (
    <div>
      <button onClick={() => router.back()}>← Volver</button>

      <h1>{book.title}</h1>

      <img
        src={book.coverUrl || '/placeholder.png'}
        alt={book.title}
        style={{ width: '300px' }}
      />

      <p><strong>Año:</strong> {book.year || 'N/A'}</p>

      <p><strong>Descripción:</strong></p>
      <p>{book.description}</p>

      <p><strong>Temas:</strong></p>
      <ul>
        {book.subjects.map((subj, index) => (
          <li key={index}>{subj}</li>
        ))}
      </ul>

      <button onClick={handleFavorite}>
        {favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      </button>
    </div>
  );
}