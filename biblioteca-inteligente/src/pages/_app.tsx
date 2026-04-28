//import "@/styles/globals.css";
//import type { AppProps } from "next/app";

//export default function App({ Component, pageProps }: AppProps) {
 // return <Component {...pageProps} />;
//}


import type { AppProps } from 'next/app';
import '@/styles/main.scss'; // Importación obligatoria del SCSS global

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="app-container">
      {/* Aquí luego el equipo pondrá el <Navbar /> */}
      <main className="container">
        <Component {...pageProps} />
      </main>
    </div>
  );
}