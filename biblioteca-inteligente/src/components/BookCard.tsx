import { Book } from '@/services/openLibraryService';
import { addFavorite, removeFavorite, isFavorite } from '@/utils/storage';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(book.id));
  }, [book.id]);

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(book.id);
    } else {
      addFavorite(book);
    }
    setFavorite(!favorite);
  };

  return (
    <div className="book-card">
      <img
        src={book.coverUrl || '/placeholder.png'}
        alt={book.title}
        className="book-cover"
      />

      <h3>{book.title}</h3>

      <p>{book.authors?.[0] || 'Autor desconocido'}</p>

      <p>Año: {book.year || 'N/A'}</p>

      <p>Ediciones: {book.editions}</p>

      <div className="actions">
        <Link href={`/libro/${book.id}`}>
          <button>Ver detalle</button>
        </Link>

        <button onClick={handleFavorite}>
          {favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        </button>
      </div>
    </div>
  );
}