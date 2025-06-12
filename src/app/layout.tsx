import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import LayoutWrapper from '@/components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Xin AI (心爱) - Your Mental Wellness Companion',
  description: 'A private, AI-powered web app that helps teens make sense of emotional moments. Get clarity on arguments, awkward texts, or social drama with your AI friend, Cayla.',
  keywords: 'AI, chatbot, teens, mental health, emotional intelligence, perspective, advice, Xin AI, 心爱',
  authors: [{ name: 'Xin AI' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}