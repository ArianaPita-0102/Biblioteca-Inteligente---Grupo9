// ==========================================
// 1. INTERFACES DE LA API (Tipados exactos)
// ==========================================

// Representa un libro dentro de la lista de resultados de búsqueda
export interface APISearchDoc {
  key: string; // ej: "/works/OL82563W"
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  edition_count?: number;
  cover_i?: number;
  language?: string[];
}

// Representa la respuesta completa al buscar (search.json)
export interface APISearchResponse {
  numFound: number;
  start: number;
  docs: APISearchDoc[];
}

// Representa el detalle completo de un libro (/works/{id}.json)
export interface APIWorkDetail {
  title: string;
  description?: string | { type: string; value: string }; // OpenLibrary tiene 2 formatos para esto
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
}

// ==========================================
// 2. INTERFACES LIMPIAS (Para el Frontend)
// ==========================================
// Usaremos estas interfaces en los componentes para no lidiar con datos sucios

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

// ==========================================
// 3. FUNCIONES DEL SERVICIO
// ==========================================

const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b/id';

/**
 * Extrae solo el ID del work (ej: "/works/OL82563W" -> "OL82563W")
 */
export const extractWorkId = (key: string): string => {
  return key.replace('/works/', '');
};

/**
 * Genera la URL de la portada. Size puede ser 'S', 'M' o 'L'
 */
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

/**
 * Busca libros de forma avanzada o general
 */
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

/**
 * Obtiene el detalle completo de un libro por su ID
 * (Trabajo para la Persona 3)
 */
export const getBookDetail = async (workId: string): Promise<BookDetail | null> => {
  try {
    // Ejemplo: https://openlibrary.org/works/OL82563W.json
    const response = await fetch(`${BASE_URL}/works/${workId}.json`);
    if (!response.ok) throw new Error('Error al obtener el detalle');
    
    const data: APIWorkDetail = await response.json();

    // Manejar la descripción inconsistente de OpenLibrary
    let cleanDescription = 'No hay descripción disponible para este libro.';
    if (data.description) {
      cleanDescription = typeof data.description === 'string' 
        ? data.description 
        : data.description.value;
    }

    return {
      id: workId,
      title: data.title,
      authors: [], // Nota: El endpoint de works no siempre trae autores directamente, requiere otro fetch a /authors/. Lo dejamos vacío temporalmente.
      year: data.first_publish_date ? parseInt(data.first_publish_date) : null,
      editions: 0,
      coverUrl: data.covers && data.covers.length > 0 ? getCoverUrl(data.covers[0], 'L') : null,
      description: cleanDescription,
      subjects: data.subjects?.slice(0, 5) || [], // Tomamos solo los primeros 5 temas
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};