export const metadata = {
  title: 'Witchfire Randomizer - Random Loadout Generator',
  description: 'Generate random loadouts for Witchfire with customizable preferences and settings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
