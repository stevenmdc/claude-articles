"use client";

import type { ReactNode } from "react";
import { ArticleProvider } from "@/context/ArticleContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ArticleProvider>{children}</ArticleProvider>;
}
