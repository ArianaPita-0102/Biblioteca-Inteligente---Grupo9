import { useMemo, useState } from 'react';
import Head from 'next/head';
import BookCard from '@/components/BookCard';
import ErrorMessage from '@/components/ErrorMessage';
import FilterPanel, { FilterValues, DEFAULT_FILTERS } from '@/components/FilterPanel';
import Loading from '@/components/Loading';
import SearchBar from '@/components/SearchBar';
import Skeleton from '@/components/Skeleton';
import { Book, searchBooks } from '@/services/openLibraryService';
import styles from '@/styles/buscar.module.scss';

const PAGE_SIZE = 10;

// Tipo de búsqueda (debe coincidir con SearchBar)
type SearchType = 'q' | 'title' | 'author' | 'subject';

// Mapeo de tipo a parámetro de la API de Open Library
const TYPE_PARAM: Record<SearchType, string> = {
  q: 'q',
  title: 'title',
  author: 'author',
  subject: 'subject',
};

export default function BuscarPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);

  const handleSearch = async (nextQuery: string, type: SearchType) => {
    if (!nextQuery) return;

    setLoading(true);
    setError(null);
    setQuery(nextQuery);
    setCurrentPage(1);
    setFilters(DEFAULT_FILTERS);
    setHasSearched(true);

    try {
      // Construimos la URL según el tipo de búsqueda
      const param = TYPE_PARAM[type];
      const response = await fetch(
        `https://openlibrary.org/search.json?${param}=${encodeURIComponent(nextQuery)}&limit=40`
      );
      if (!response.ok) throw new Error('Error al buscar libros');
      const data = await response.json();

      const books: Book[] = (data.docs ?? []).map((doc: any) => ({
        id: doc.key?.replace('/works/', '') ?? '',
        title: doc.title ?? 'Sin título',
        authors: doc.author_name ?? ['Autor Desconocido'],
        year: doc.first_publish_year ?? null,
        editions: doc.edition_count ?? 1,
        coverUrl: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : null,
        language: doc.language ?? [],
      }));

      setResults(books);
    } catch {
      setError('Ocurrió un error al buscar libros. Intenta de nuevo.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (next: FilterValues) => {
    setFilters(next);
    setCurrentPage(1);
  };

  // Filtrado + ordenamiento en memoria
  const filteredResults = useMemo(() => {
    const minYear = filters.minYear ? Number(filters.minYear) : null;
    const maxYear = filters.maxYear ? Number(filters.maxYear) : null;
    const authorFilter = filters.author.trim().toLowerCase();

    let list = results.filter((book) => {
      const okMin = minYear ? (book.year ?? 0) >= minYear : true;
      const okMax = maxYear ? (book.year ?? 9999) <= maxYear : true;
      const okAuthor = authorFilter
        ? book.authors.some((a) => a.toLowerCase().includes(authorFilter))
        : true;
      const okLang = filters.language
        ? (book as any).language?.includes(filters.language)
        : true;
      return okMin && okMax && okAuthor && okLang;
    });

    if (filters.sortBy === 'year') {
      list = [...list].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    } else if (filters.sortBy === 'editions') {
      list = [...list].sort((a, b) => b.editions - a.editions);
    }

    return list;
  }, [filters, results]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedResults = filteredResults.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <>
      <Head>
        <title>Biblioteca Inteligente | Buscar</title>
      </Head>

      <div className={styles.page}>
        {/* Cabecera */}
        <div className={styles.header}>
          <h1 className={styles.title}>Búsqueda de libros</h1>
          <SearchBar onSearch={handleSearch} initialValue={query} />
        </div>

        {/* Cuerpo: filtros + resultados */}
        <div className={styles.body}>
          {/* Filtros — solo visibles tras búsqueda */}
          {hasSearched && (
            <aside className={styles.sidebar}>
              <FilterPanel value={filters} onChange={handleFilterChange} />
            </aside>
          )}

          {/* Área de resultados */}
          <section className={styles.results}>
            {/* Cargando con Skeleton */}
            {loading && (
              <div className={styles.skeletonGrid}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && <ErrorMessage message={error} />}

            {/* Estado inicial: aún no buscó */}
            {!loading && !error && !hasSearched && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📚</span>
                <p>Escribe algo para buscar libros.</p>
                <p className={styles.hint}>Puedes buscar por título, autor o tema.</p>
              </div>
            )}

            {/* Sin resultados tras filtros */}
            {!loading && !error && hasSearched && filteredResults.length === 0 && results.length > 0 && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🔍</span>
                <p>Los filtros actuales no muestran resultados.</p>
                <button
                  type="button"
                  className={styles.clearLink}
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* API no devolvió nada */}
            {!loading && !error && hasSearched && results.length === 0 && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}></span>
                <p>No se encontraron libros para &quot;{query}&quot;.</p>
                <p className={styles.hint}>Intenta con otras palabras.</p>
              </div>
            )}

            {/* Resultados */}
            {!loading && !error && paginatedResults.length > 0 && (
              <>
                <p className={styles.count}>
                  Mostrando <strong>{paginatedResults.length}</strong> de{' '}
                  <strong>{filteredResults.length}</strong> resultados para &quot;{query}&quot;
                </p>

                <div className={styles.grid}>
                  {paginatedResults.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      type="button"
                      className={styles.pageBtn}
                      disabled={safePage <= 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      ‹ Anterior
                    </button>
                    <span className={styles.pageInfo}>
                      Página {safePage} de {totalPages}
                    </span>
                    <button
                      type="button"
                      className={styles.pageBtn}
                      disabled={safePage >= totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Siguiente ›
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}