import css from './loading.module.css';

const Loading = () => {
  return (
    <main className={css.page}>
      <div className={css.spinner}></div>

      <h1>Loading...</h1>

      <p>Please wait, while page is loading.</p>
    </main>
  );
};

export default Loading;
