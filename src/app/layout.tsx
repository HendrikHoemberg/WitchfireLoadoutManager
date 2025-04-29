import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadoutProvider } from '@/context/LoadoutContext'
import Navigation from '@/components/ui/Navigation'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Witchfire Loadout Manager & Randomizer",
  description: "Create, manage, and randomize loadouts for Witchfire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-800 text-white min-h-screen`}
      >
        <LoadoutProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-[#1A1A1A] text-gray-100 py-2">
              <div className="container mx-auto px-4 text-center">
                <p>Witchfire Loadout Manager & Randomizer {new Date().getFullYear()}</p>
                <p className="text-sm mt-2">Not affiliated with The Astronauts or Witchfire.</p>
              </div>
            </footer>
          </div>
        </LoadoutProvider>
      </body>
    </html>
  );
}
