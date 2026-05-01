import { useEffect, useState } from 'react';
import { getFavorites } from '@/utils/storage';
import { Book } from '@/services/openLibraryService';
import BookCard from '@/components/BookCard';
import styles from '@/styles/FavoritesPage.module.scss';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Book[]>([]);

  useEffect(() => {
    const favs = getFavorites();
    setFavorites(favs);
  }, []);

  function handleRemoveFavorite(bookId: string) {
    setFavorites((prevFavorites) => prevFavorites.filter((book) => book.id !== bookId));
  }

  if (favorites.length === 0) {
    return <p>No tienes libros favoritos aún.</p>;
  }

  return (
    <div className={styles['favorites-page']}>
      <h1>Mis Favoritos</h1>

      <div className={styles['books-grid']}>
        {favorites.map((book) => (
          <BookCard key={book.id} book={book} onFavoriteChange={() => handleRemoveFavorite(book.id)} />
        ))}
      </div>
    </div>
  );
}