"use client";

import React from "react";
import { AuthProvider } from "@/lib/authContext";
import Header from "@/components/Header";

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </AuthProvider>
  );
} 