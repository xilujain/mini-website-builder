import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'
import ClientLayout from '../components/ClientLayout'

const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["400", "500", "700"] })

export const metadata: Metadata = {
  title: 'ابني موقعك الخاص بك بسهولة',
  description: 'ابني موقعك الخاص بك بسهولة باستخدام البناء المباشر',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={tajawal.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}