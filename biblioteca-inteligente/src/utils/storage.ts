import { Book } from '../services/openLibraryService';

const FAVORITES_KEY = 'biblioteca_favoritos';

/**
 * Obtiene la lista de libros favoritos del LocalStorage
 */
export const getFavorites = (): Book[] => {
  // Next.js se ejecuta en el servidor y en el cliente. 
  // Esta validación evita el error "window is not defined".
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al leer favoritos:', error);
    return [];
  }
};

/**
 * Agrega un libro a favoritos (evitando duplicados)
 */
export const addFavorite = (book: Book): void => {
  if (typeof window === 'undefined') return;

  const currentFavorites = getFavorites();
  
  // Evitar duplicados comprobando el ID
  const isAlreadyFavorite = currentFavorites.some((fav) => fav.id === book.id);
  
  if (!isAlreadyFavorite) {
    const newFavorites = [...currentFavorites, book];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }
};

/**
 * Elimina un libro de favoritos por su ID
 */
export const removeFavorite = (bookId: string): void => {
  if (typeof window === 'undefined') return;

  const currentFavorites = getFavorites();
  const newFavorites = currentFavorites.filter((fav) => fav.id !== bookId);
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
};

/**
 * Verifica si un libro ya está en favoritos (útil para el botón de los componentes)
 */
export const isFavorite = (bookId: string): boolean => {
  const currentFavorites = getFavorites();
  return currentFavorites.some((fav) => fav.id === bookId);
};