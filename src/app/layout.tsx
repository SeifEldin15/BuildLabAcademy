import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Build Lab Academy",
  description: "Build Lab Academy - Learning and Development Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
