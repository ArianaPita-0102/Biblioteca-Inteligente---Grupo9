import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Biblioteca Inteligente | Inicio</title>
        <meta name="description" content="Busca y guarda tus libros favoritos" />
      </Head>
      
      <section style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h1>Bienvenido a la Biblioteca Inteligente 📚</h1>
        <p style={{ marginTop: '1rem', opacity: 0.8 }}>
          Espacio reservado para los libros populares y la búsqueda (Sprint 2).
        </p>
      </section>
    </>
  );
}