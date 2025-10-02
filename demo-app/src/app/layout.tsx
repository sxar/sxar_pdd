import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pragmatic Drag and Drop Demo',
  description: 'Comprehensive demonstration of Pragmatic drag and drop library capabilities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
