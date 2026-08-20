import Link from 'next/link';

import css from './not-found.module.css';

const NotFound = () => {
  return (
    <main className={css.page}>
      <h1>404</h1>

      <h2>Page not found</h2>

      <p>Page you are looking for does not exist or has been removed.</p>

      <Link href="/" className={css.button}>
        Home
      </Link>
    </main>
  );
};

export default NotFound;
