export const metadata = {
  title: 'Witchfire Wiki - Items & Equipment Guide',
  description: 'Browse all weapons, spells, items, and beads available in Witchfire',
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
