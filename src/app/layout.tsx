import Navigation from '@/components/ui/Navigation';
import { LoadoutProvider } from '@/context/LoadoutContext';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from 'next/image';
import Link from 'next/link';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Witchfire Randomizer",
  description: "Create, manage, and randomize loadouts for Witchfire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-white min-h-screen`}>
        <LoadoutProvider>
          <div className="flex flex-col min-h-screen pt-16">
            <Navigation />
            <div className="flex justify-center items-center py-4 sm:py-8 mt-2">
              <Link href="/">
                <Image
                  src="/images/wf-logo2.webP"
                  alt="Witchfire Logo"
                  width={400}
                  height={150}
                  sizes="(max-width: 1000px) 100vw, 25vh"
                  className="h-auto"
                  priority
                />
              </Link>
            </div>
            <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-4 sm:py-8">
              {children}
            </main>
            <footer className="bg-[#1a1a1abb] text-gray-100 py-2">
              <div className="container mx-auto px-4 text-center">
                <p>©Witchfire Randomizer 1.0.0 - created by Hendrik Hömberg</p>
                <p className="text-xs">I am not affiliated with The Astronauts or Witchfire in any way.</p>
                <p className="text-xs">All image rights belong to Witchfire and The Astronauts. Background image created by Gregory Pedzinski</p>
              </div>
            </footer>
          </div>
        </LoadoutProvider>
      </body>
    </html>
  );
}
