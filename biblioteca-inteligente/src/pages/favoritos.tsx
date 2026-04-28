import { useEffect, useState } from 'react';
import { getFavorites } from '@/utils/storage';
import { Book } from '@/services/openLibraryService';
import BookCard from '@/components/BookCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Book[]>([]);

  useEffect(() => {
    const favs = getFavorites();
    setFavorites(favs);
  }, []);

  if (favorites.length === 0) {
    return <p>No tienes libros favoritos aún.</p>;
  }

  return (
    <div>
      <h1>Mis Favoritos</h1>

      <div className="books-grid">
        {favorites.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}