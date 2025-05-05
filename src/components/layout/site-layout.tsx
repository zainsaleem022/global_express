"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Header from "./header";
import Footer from "./footer";
import { useAuthStore } from "@/src/lib/store/useAuthStore";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const { checkAuth, loading } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication status on component mount
  useEffect(() => {
    if (isClient) {
      // Small delay to ensure localStorage is fully available
      const timer = setTimeout(() => {
        console.log("SiteLayout: Running checkAuth on client side");
        checkAuth();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [checkAuth, isClient]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
