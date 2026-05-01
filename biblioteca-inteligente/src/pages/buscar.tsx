import { useMemo, useState } from 'react';
import Head from 'next/head';
import BookCard from '@/components/BookCard';
import ErrorMessage from '@/components/ErrorMessage';
import FilterPanel, { FilterValues, DEFAULT_FILTERS } from '@/components/FilterPanel';
import Skeleton from '@/components/Skeleton';
import { Book, searchBooks } from '@/services/openLibraryService';
import styles from '@/styles/buscar.module.scss';
import SearchBar from '@/components/SearchBar';

const PAGE_SIZE = 10;

type SearchType = 'q' | 'title' | 'author' | 'subject';

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
      const books = await searchBooks({
        [type === 'q' ? 'query' : type]: nextQuery,
        limit: 40
      });

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
      
      // CORRECCIÓN: Se eliminó el casteo "any" respetando TypeScript
      const okLang = filters.language
        ? book.language?.includes(filters.language)
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
        <div className={styles.header}>
          <h1 className={styles.title}>Búsqueda de libros</h1>
          <SearchBar onSearch={handleSearch} initialValue={query} />
        </div>

        <div className={styles.body}>
          {hasSearched && (
            <aside className={styles.sidebar}>
              <FilterPanel value={filters} onChange={handleFilterChange} />
            </aside>
          )}

          <section className={styles.results}>
            {loading && (
              <div className={styles.skeletonGrid}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </div>
            )}

            {!loading && error && <ErrorMessage message={error} />}

            {/* CORRECCIÓN: Se eliminaron los span vacíos en los estados */}
            {!loading && !error && !hasSearched && (
              <div className={styles.emptyState}>
                <p>Escribe algo para buscar libros.</p>
                <p className={styles.hint}>Puedes buscar por título, autor o tema.</p>
              </div>
            )}

            {!loading && !error && hasSearched && filteredResults.length === 0 && results.length > 0 && (
              <div className={styles.emptyState}>
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

            {!loading && !error && hasSearched && results.length === 0 && (
              <div className={styles.emptyState}>
                <p>No se encontraron libros para &quot;{query}&quot;.</p>
                <p className={styles.hint}>Intenta con otras palabras.</p>
              </div>
            )}

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

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      type="button"
                       className={styles.pageBtn}
                      disabled={safePage <= 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Anterior
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
                      Siguiente
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