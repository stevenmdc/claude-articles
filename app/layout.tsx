import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import Navbar from "@/components/Navbar";
import TableOfContents from "@/components/TableOfContents";
import "./globals.css";

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Claude Articles",
  description: "A field guide to building precise, elegant AI-assisted articles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable} antialiased`}>
        <Navbar />
        <TableOfContents />
        <main className="pt-20 lg:ml-64">
          <div className="mx-auto max-w-3xl px-6 pb-24">{children}</div>
        </main>
      </body>
    </html>
  );
}
