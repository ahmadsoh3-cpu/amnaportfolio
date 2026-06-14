import './globals.css';

export const metadata = {
  title: 'Amna Pervez · Architecture as Atmosphere',
  description:
    'Architecture portfolio of Amna Pervez, a cinematic, monochrome walk through selected residential, wellness and thesis works.',
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
