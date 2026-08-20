import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kanban Task Manager',
  description: 'Create boards, add cards, and manage tasks efficiently.',
  applicationName: 'Kanban Task Manager',

  openGraph: {
    title: 'Kanban Task Manager',
    description: 'Create boards, add cards, and manage tasks efficiently.',
    url: 'https://task-management-boards.vercel.app',
    siteName: 'Kanban Task Manager',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 800,
        height: 600,
        alt: 'Kanban Task Manager',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Kanban Task Manager',
    description: 'Create boards, add cards, and manage tasks efficiently.',
    images: ['/og-image.png'],
  },
};

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold sm:text-6xl">Kanban Task Manager</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          Create boards, add cards, and manage tasks efficiently.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/boards"
            className="inline-block rounded bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring active:bg-indigo-500 transition duration-300 ease-in-out">
            Check Boards
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
