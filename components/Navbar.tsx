"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useArticleContext } from "@/context/ArticleContext";
import { Menu, Upload, X } from "lucide-react";

export default function Navbar() {
  const { fileName, source, uploadMarkdownFile, clearUploadedArticle } =
    useArticleContext();
  const [isUploading, setIsUploading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const openFilePicker = () => {
    setIsMobileMenuOpen(false);
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setIsMobileMenuOpen(false);
    clearUploadedArticle();
    if (pathname === "/reader") {
      router.push("/");
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    let didUpload = false;

    try {
      didUpload = await uploadMarkdownFile(file);
    } finally {
      setIsUploading(false);
      input.value = "";
    }

    if (didUpload) {
      router.push("/reader");
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-black/10 bg-[#f0f0eb]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link className="flex items-center gap-3 text-neutral-900" href="/">
          <Image
            src="/images/logo.png"
            alt="Claude Articles logo"
            width={150}
            height={50}
            loading="eager"
          />
          <span className="-translate-y-2 -translate-x-2 font-heading font-semibold">
            Articles
          </span>
        </Link>

        <input
          ref={fileInputRef}
          type="file"
          accept=".md,text/markdown"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="hidden items-center gap-4 sm:flex">
          {source === "uploaded" && fileName ? (
            <span className="max-w-44 truncate text-xs font-medium text-neutral-600 md:block">
              {fileName}
            </span>
          ) : null}

          <button
            type="button"
            onClick={openFilePicker}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Upload size={14} aria-hidden="true" />
            {isUploading ? "Loading..." : "Upload .md"}
          </button>

          {source === "uploaded" ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border border-transparent px-2 py-1.5 text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
            >
              Clear
            </button>
          ) : null}

          <Link
            href="/pricing"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            Pricing
          </Link>
          <Link
            href="/table"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            Table
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="rounded-md border border-black/10 bg-white p-2 text-neutral-700 transition hover:text-neutral-900 sm:hidden"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-black/10 bg-[#f0f0eb] px-6 py-4 sm:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3">
            {source === "uploaded" && fileName ? (
              <span className="truncate text-xs font-medium text-neutral-600">
                {fileName}
              </span>
            ) : null}

            <button
              type="button"
              onClick={openFilePicker}
              disabled={isUploading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Upload size={15} aria-hidden="true" />
              {isUploading ? "Loading..." : "Upload .md"}
            </button>

            {source === "uploaded" ? (
              <button
                type="button"
                onClick={handleClear}
                className="w-full rounded-md border border-transparent px-3 py-2 text-left text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
              >
                Clear
              </button>
            ) : null}

            <Link
              href="/table"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 text-sm font-medium text-neutral-700 hover:text-neutral-900"
            >
              Pricing
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 text-sm font-medium text-neutral-700 hover:text-neutral-900"
            >
              Table
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
