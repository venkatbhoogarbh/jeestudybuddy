import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JEE Study Buddy",
  description: "An AI-powered personalized study companion for JEE aspirants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
