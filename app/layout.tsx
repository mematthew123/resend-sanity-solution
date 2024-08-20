import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Resend + Sanity Starter",
  description: "A starter template for Resend + Sanity projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans text-gray-900 bg-neutral-100 text-base px-4">
        {children}
      </body>
    </html>
  );
}
