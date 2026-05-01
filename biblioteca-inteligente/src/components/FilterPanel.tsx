import styles from '@/styles/FilterPanel.module.scss';

export interface FilterValues {
  minYear: string;
  maxYear: string;
  author: string;
  language: string;
  sortBy: '' | 'year' | 'editions';
}

export const DEFAULT_FILTERS: FilterValues = {
  minYear: '',
  maxYear: '',
  author: '',
  language: '',
  sortBy: '',
};

interface FilterPanelProps {
  value: FilterValues;
  onChange: (next: FilterValues) => void;
}

const LANGUAGES = [
  { code: '', label: 'Todos' },
  { code: 'eng', label: 'Inglés' },
  { code: 'spa', label: 'Español' },
  { code: 'fre', label: 'Francés' },
  { code: 'ger', label: 'Alemán' },
  { code: 'por', label: 'Portugués' },
];

export default function FilterPanel({ value, onChange }: FilterPanelProps) {
  const update = (key: keyof FilterValues, val: string) =>
    onChange({ ...value, [key]: val });

  const hasFilters = Object.values(value).some((v) => v !== '');

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Filtros</span>
        {hasFilters && (
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => onChange(DEFAULT_FILTERS)}
          >
            Limpiar
          </button>
        )}
      </div>

      <div className={styles.fields}>
        {/* Año mínimo */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="minYear">Año desde</label>
          <input
            id="minYear"
            type="number"
            placeholder="ej. 2000"
            value={value.minYear}
            onChange={(e) => update('minYear', e.target.value)}
            className={styles.input}
          />
        </div>

        {/* Año máximo */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="maxYear">Año hasta</label>
          <input
            id="maxYear"
            type="number"
            placeholder="ej. 2024"
            value={value.maxYear}
            onChange={(e) => update('maxYear', e.target.value)}
            className={styles.input}
          />
        </div>

        {/* Autor */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="author">Autor</label>
          <input
            id="author"
            type="text"
            placeholder="ej. Robert Martin"
            value={value.author}
            onChange={(e) => update('author', e.target.value)}
            className={styles.input}
          />
        </div>

        {/* Idioma */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="language">Idioma</label>
          <select
            id="language"
            value={value.language}
            onChange={(e) => update('language', e.target.value)}
            className={styles.select}
          >
            {LANGUAGES.map(({ code, label }) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </div>

        {/* Ordenar */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sortBy">Ordenar por</label>
          <select
            id="sortBy"
            value={value.sortBy}
            onChange={(e) => update('sortBy', e.target.value as FilterValues['sortBy'])}
            className={styles.select}
          >
            <option value="">Relevancia</option>
            <option value="year">Año (más reciente)</option>
            <option value="editions">Más ediciones</option>
          </select>
        </div>
      </div>
    </section>
  );
}