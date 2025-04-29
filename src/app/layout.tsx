import type React from "react";
import "@/src/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/src/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GlobalExpress - Worldwide Delivery Services",
  description: "Fast, reliable and sustainable worldwide delivery services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
