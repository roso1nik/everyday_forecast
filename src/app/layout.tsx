import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/shared/styles/index.css'

const font_flobal = Inter({
    variable: '--font',
    subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'latin-ext']
})

export const metadata: Metadata = {
    title: 'Every day Forecast for crypto',
    description: 'Every day forecast with AI'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ru">
            <body className={`${font_flobal.variable} antialiased`}>{children}</body>
        </html>
    )
}
