import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rogue Agents",
  description:
    "Intentionally vulnerable AI Agent to highlight security mitigations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased flex justify-center`}>{children}</body>
    </html>
  );
}
