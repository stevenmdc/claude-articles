"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  extractMarkdownHeadings,
  type MarkdownHeading,
} from "@/lib/parseMarkdown";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

type ArticleSource = "default" | "uploaded";

interface UploadedArticleState {
  fileName: string | null;
  content: string;
  headings: MarkdownHeading[];
  source: ArticleSource;
  error: string | null;
}

interface ArticleContextValue extends UploadedArticleState {
  uploadMarkdownFile: (file: File) => Promise<boolean>;
  clearUploadedArticle: () => void;
}

const initialState: UploadedArticleState = {
  fileName: null,
  content: "",
  headings: [],
  source: "default",
  error: null,
};

const ArticleContext = createContext<ArticleContextValue | undefined>(undefined);

function isSupportedMarkdownFile(file: File): boolean {
  if (/\.md$/i.test(file.name)) {
    return true;
  }

  return file.type === "text/markdown";
}

interface ArticleProviderProps {
  children: ReactNode;
}

export function ArticleProvider({ children }: ArticleProviderProps) {
  const [state, setState] = useState<UploadedArticleState>(initialState);

  const clearUploadedArticle = useCallback(() => {
    setState(initialState);
  }, []);

  const uploadMarkdownFile = useCallback(async (file: File) => {
    if (!isSupportedMarkdownFile(file)) {
      setState((previous) => ({
        ...previous,
        error: "Please upload a valid .md file.",
      }));
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setState((previous) => ({
        ...previous,
        error: "File is too large. Maximum size is 2 MB.",
      }));
      return false;
    }

    try {
      const content = await file.text();
      if (!content.trim()) {
        setState((previous) => ({
          ...previous,
          error: "This markdown file is empty.",
        }));
        return false;
      }

      const headings = extractMarkdownHeadings(content);

      setState({
        fileName: file.name,
        content,
        headings,
        source: "uploaded",
        error: null,
      });

      return true;
    } catch {
      setState((previous) => ({
        ...previous,
        error: "Could not read this file. Try another markdown file.",
      }));
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      uploadMarkdownFile,
      clearUploadedArticle,
    }),
    [clearUploadedArticle, state, uploadMarkdownFile],
  );

  return <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>;
}

export function useArticleContext() {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticleContext must be used within an ArticleProvider");
  }

  return context;
}
