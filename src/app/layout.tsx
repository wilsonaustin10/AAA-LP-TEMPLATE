import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from './client-layout';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '{{COMPANY_NAME}} - Sell Your House Fast',
  description: 'Get a fair cash offer for your house in {{CITY}}. No repairs, no commissions, close on your timeline.',
  keywords: 'sell house fast, cash home buyers, {{CITY}} home buyers, sell my house',
  openGraph: {
    title: '{{COMPANY_NAME}} - Sell Your House Fast in {{CITY}}',
    description: 'Get a fair cash offer for your house. No repairs, no commissions.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}