import { FormEvent, useState } from 'react';
import styles from '@/styles/SearchBar.module.scss';

type SearchType = 'q' | 'title' | 'author' | 'subject';

interface SearchBarProps {
  onSearch: (value: string, type: SearchType) => void;
  initialValue?: string;
}

const TYPES: { value: SearchType; label: string }[] = [
  { value: 'q', label: 'Todo' },
  { value: 'title', label: 'Título' },
  { value: 'author', label: 'Autor' },
  { value: 'subject', label: 'Tema' },
];

export default function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [searchType, setSearchType] = useState<SearchType>('q');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) onSearch(query.trim(), searchType);
  };

  return (
    <div className={styles.wrapper}>
      {/* Selector de tipo de búsqueda */}
      <div className={styles.typeSelector}>
        {TYPES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`${styles.typeBtn} ${searchType === value ? styles.active : ''}`}
            onClick={() => setSearchType(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input + submit */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Buscar por ${TYPES.find((t) => t.value === searchType)?.label.toLowerCase()}...`}
          className={styles.input}
        />
        <button type="submit" className={styles.submitBtn}>
          Buscar
        </button>
      </form>
    </div>
  );
}
