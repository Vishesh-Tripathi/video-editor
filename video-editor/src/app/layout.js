import { MantineProvider } from '@mantine/core';
import './globals.css';

export const metadata = {
  title: 'Video Editor',
  description: 'A simple video editor built with Next.js and Mantine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}