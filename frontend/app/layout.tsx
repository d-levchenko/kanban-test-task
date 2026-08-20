import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://task-management-boards.vercel.app'),

  title: 'Task Management Boards',
  description: 'Create boards, add cards, and manage tasks efficiently.',
  applicationName: 'Task Management Boards',

  openGraph: {
    title: 'Task Management Boards',
    description: 'Create boards, add cards, and manage tasks efficiently.',
    url: 'https://task-management-boards.vercel.app',
    siteName: 'Task Management Boards',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 800,
        height: 600,
        alt: 'Task Management Boards',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Task Management Boards',
    description: 'Create boards, add cards, and manage tasks efficiently.',
    images: [
      {
        url: '/og-image.png',
        width: 800,
        height: 600,
        alt: 'Task Management Boards',
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
