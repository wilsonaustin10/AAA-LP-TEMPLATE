'use client';

import { FormProvider } from '../context/FormContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClientScripts from '../components/ClientScripts';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientScripts />
      <FormProvider>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </FormProvider>
    </>
  );
}