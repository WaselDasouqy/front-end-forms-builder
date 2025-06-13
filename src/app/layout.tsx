import './globals.css';
import type { Metadata, Viewport } from 'next';
import { ClientLayout } from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'FormWave - Form Builder',
  description: 'Create and manage forms with our drag-and-drop form builder',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
