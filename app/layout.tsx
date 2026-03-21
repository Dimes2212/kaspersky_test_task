import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import { AppNav } from './ui/AppNav';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: '700',
});

export const metadata: Metadata = {
  title: 'Kaspersky Test Task',
  description: 'Users and Groups pages',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <main className="min-h-screen bg-[#F7F7F7]">
          <div className="h-[80px] w-full bg-white">
            <div className="mx-auto flex h-full w-full max-w-[1920px] items-center px-6">
              <AppNav
                className={`${montserrat.className} flex items-center gap-10 text-[20px] font-bold leading-[140%] tracking-[0em]`}
              />
            </div>
          </div>
          <div className="px-[10px] py-4">
            <section className="mx-auto w-full max-w-[1900px] text-[#162155]">{children}</section>
          </div>
        </main>
      </body>
    </html>
  );
}
