import { ThemeProvider } from '@/components/ThemeContext';
import Head from 'next/head';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <ThemeProvider>
      <Head>
        <title>Simple English Notes App</title>
        <meta name="description" content="a simple English notes app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
      </main>
    </ThemeProvider>
  );
}
