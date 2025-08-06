export const metadata = {
  title: 'Witchfire Loadout Manager - Create & Manage Loadouts',
  description: 'Create, edit, and manage your custom loadouts for Witchfire',
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
