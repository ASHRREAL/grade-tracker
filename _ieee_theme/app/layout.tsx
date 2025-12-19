
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  title: "IEEE Student Branch | University of Guelph",
  description: "Join the IEEE Student Branch at University of Guelph. Connecting students with technology, innovation, and professional opportunities. Improve Life.",
  keywords: "IEEE, University of Guelph, Student Branch, Engineering, Technology, Computer Science, Innovation",
  authors: [{ name: "IEEE UofG Student Branch" }],
  creator: "IEEE UofG Student Branch",
  publisher: "IEEE",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  },
  openGraph: {
    title: "IEEE Student Branch | University of Guelph",
    description: "Connecting students with technology, innovation, and professional opportunities at UofG.",
    type: "website",
    locale: "en_CA"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${poppins.variable} dark`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
