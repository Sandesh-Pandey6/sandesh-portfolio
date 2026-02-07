import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sandesh Pandey | Frontend & Full-Stack Web Developer",
  description:
    "Personal portfolio of Sandesh Pandey - Frontend and Full-Stack Web Developer. Building modern web applications with React, Next.js, and Tailwind CSS.",
  keywords: [
    "Sandesh Pandey",
    "Web Developer",
    "Frontend Developer",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Portfolio",
  ],
  authors: [{ name: "Sandesh Pandey" }],
  openGraph: {
    title: "Sandesh Pandey | Web Developer Portfolio",
    description:
      "Frontend and Full-Stack Web Developer building modern applications with React, Next.js, and Tailwind CSS.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ThemeProvider>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
