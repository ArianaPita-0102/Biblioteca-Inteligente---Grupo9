export interface APISearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  edition_count?: number;
  cover_i?: number;
  language?: string[];
}

export interface APISearchResponse {
  numFound: number;
  start: number;
  docs: APISearchDoc[];
}

export interface APIWorkDetail {
  title: string;
  description?: string | { type: string; value: string };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
  authors?: Array<{ author?: { key?: string } }>;
  }

  interface APIAuthorDetail {
    name?: string;
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  editions: number;
  coverUrl: string | null;
  language?: string[]; 
}

export interface BookDetail extends Book {
  description: string;
  subjects: string[];
}

const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b/id';

export const extractWorkId = (key: string): string => {
  return key.replace('/works/', '');
};

export const getCoverUrl = (coverId?: number, size: 'M' | 'L' = 'M'): string | null => {
  if (!coverId) return null;
  return `${COVERS_URL}/${coverId}-${size}.jpg`;
};

export interface SearchParams {
  query?: string;
  title?: string;
  author?: string;
  subject?: string;
  limit?: number;
}

export const searchBooks = async (params: SearchParams): Promise<Book[]> => {
  try {
    let url = `${BASE_URL}/search.json?`;

    // Construcción dinámica de la URL según el tipo de búsqueda
    if (params.title) url += `title=${encodeURIComponent(params.title)}&`;
    else if (params.author) url += `author=${encodeURIComponent(params.author)}&`;
    else if (params.subject) url += `subject=${encodeURIComponent(params.subject)}&`;
    else if (params.query) url += `q=${encodeURIComponent(params.query)}&`;

    const limit = params.limit || 20;
    url += `limit=${limit}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al buscar libros');
    
    const data: APISearchResponse = await response.json();

    if (!data.docs) return [];

    return data.docs.map((doc) => ({
      id: extractWorkId(doc.key),
      title: doc.title,
      authors: doc.author_name || ['Autor Desconocido'],
      year: doc.first_publish_year || null,
      editions: doc.edition_count || 1,
      coverUrl: getCoverUrl(doc.cover_i, 'M'),
      language: doc.language || [], // Extraemos el idioma para los filtros
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBookDetail = async (workId: string): Promise<BookDetail | null> => {
  try {
    const response = await fetch(`${BASE_URL}/works/${workId}.json`);
    if (!response.ok) throw new Error('Error al obtener el detalle');
    
    const data: APIWorkDetail = await response.json();

    let cleanDescription = 'No hay descripción disponible para este libro.';
    if (data.description) {
      cleanDescription = typeof data.description === 'string' ? data.description : data.description.value;
    }

    const authorKeys = data.authors
      ?.map((entry) => entry.author?.key)
      .filter((key): key is string => Boolean(key)) || [];

    const authorNames = await Promise.all(
      authorKeys.slice(0, 5).map(async (authorKey) => {
        try {
          const authorResponse = await fetch(`${BASE_URL}${authorKey}.json`);
          if (!authorResponse.ok) return null;
          const authorData: APIAuthorDetail = await authorResponse.json();
          return authorData.name || null;
        } catch {
          return null;
        }
      }),
    );


    return {
      id: workId,
      title: data.title,
      authors: authorNames.filter((author): author is string => Boolean(author)),
      year: data.first_publish_date ? parseInt(data.first_publish_date, 10) || null : null,
      editions: 0,
      coverUrl: data.covers && data.covers.length > 0 ? getCoverUrl(data.covers[0], 'L') : null,
      description: cleanDescription,
      subjects: data.subjects?.slice(0, 8) || [],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};