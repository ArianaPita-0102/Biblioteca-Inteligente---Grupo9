import { Book } from '@/services/openLibraryService';
import { addFavorite, removeFavorite, isFavorite, getFavorites } from '@/utils/storage';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/BookCard.module.scss';

interface Props {
  book: Book;
  onFavoriteChange?: (bookId: string) => void;
}

export default function BookCard({ book, onFavoriteChange }: Props) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(book.id));
  }, [book.id]);

  const handleFavorite = () => {
    let updatedFavorites;
    if (favorite) {
      removeFavorite(book.id);
      updatedFavorites = getFavorites();
    } else {
      addFavorite(book);
      updatedFavorites = getFavorites();
    }
    setFavorite(!favorite);
    if (onFavoriteChange) {
      onFavoriteChange(book.id);
    }
  };

  return (
    <div className={styles['book-card']}>
      <Image
        src={book.coverUrl || '/placeholder.png'}
        alt={`Portada de ${book.title}`}
        width={300}
        height={400}
        className={styles['book-cover']}
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
      <h3>{book.title}</h3>
      <p>{book.authors?.[0] || 'Autor desconocido'}</p>
      <p>Año: {book.year || 'N/A'}</p>
      <p>Ediciones: {book.editions}</p>

      <div className={styles['actions']}>
        <Link href={`/libro/${book.id}`}>
          <button>Ver detalle</button>
        </Link>
        <button onClick={handleFavorite}>
          {favorite ? 'Quitar Fav.' : 'Guardar Fav.'}
        </button>
      </div>
    </div>
  );
}