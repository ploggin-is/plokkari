import './globals.css'

export const metadata = {
  title: 'Plokkari',
  description: 'Imagine the world without litter!',
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
