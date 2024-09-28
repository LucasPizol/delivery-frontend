"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LayoutProvider } from "./layout";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { GoogleProvider } from "@/hooks/useGoogle";
import { ReactNode } from "react";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GoogleProvider>
          <LayoutProvider>{children}</LayoutProvider>
        </GoogleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
