 import type { Metadata } from "next";
 import { Crimson_Pro, Source_Sans_3 } from "next/font/google";
 import Navbar from "@/components/Navbar";
 import TableOfContents from "@/components/TableOfContents";
 import "./globals.css";

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

const serifFont = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Claude Articles",
  description:
    "A field guide to building precise, elegant AI-assisted articles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${serifFont.variable} antialiased`}>
        <Navbar />
        <TableOfContents />
        {children}
      </body>
    </html>
  );
}
