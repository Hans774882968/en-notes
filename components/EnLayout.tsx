import { ReactNode } from 'react';
import { ThemeProvider } from './common/contexts/ThemeContext';
import EnMenu from './EnMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import Navbar from './navbar/Navbar';
import styles from './EnLayout.module.sass';

interface Props {
  children?: ReactNode
}

export default function EnLayout({ children }: Props) {
  return (
    <ThemeProvider>
      <Head>
        <title>Simple English Notes App</title>
        <meta name="description" content="a simple English notes app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Navbar />
          <div className={styles.main}>
            <EnMenu />
            <div className={styles.pageContainer}>{children}</div>
          </div>
        </Layout>
      </main>
    </ThemeProvider>
  );
}
