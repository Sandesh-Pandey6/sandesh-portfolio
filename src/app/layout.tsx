import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Sandesh Pandey | Full-Stack Web Developer",
  description:
    "Personal portfolio of Sandesh Pandey — Full-Stack Developer crafting robust, scalable web applications with React, Next.js, and Python.",
  keywords: [
    "Sandesh Pandey",
    "Full-Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "Python",
    "FastAPI",
    "Portfolio",
  ],
  authors: [{ name: "Sandesh Pandey" }],
  openGraph: {
    title: "Sandesh Pandey | Full-Stack Developer",
    description:
      "Full-Stack Developer crafting robust, scalable web applications.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${instrumentSerif.variable}`}>
        <CustomCursor />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
