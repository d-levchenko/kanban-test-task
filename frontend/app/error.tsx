'use client';

import Link from 'next/link';

const Error = () => {
  return (
    <main className="flex flex-col items-center justify-center gap-4 min-h-[60vh] text-center">
      <h1 className="text-[2rem]">
        Something went wrong while processing your request
      </h1>

      <p className="max-w-125 leading-[1.6]">Please try again later.</p>

      <Link
        href="/"
        className="px-6 py-[0.85rem] border-[none] rounded-xl bg-(--primary) text-[white] font-semibold [transition:background_200ms_ease-in-out] hover:bg-(--primary-hover)">
        Home
      </Link>
    </main>
  );
};

export default Error;
