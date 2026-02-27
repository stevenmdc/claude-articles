"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useArticleContext } from "@/context/ArticleContext";

export default function Navbar() {
  const { fileName, source, uploadMarkdownFile, clearUploadedArticle } =
    useArticleContext();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
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
        <div className="flex items-center gap-4">
          {source === "uploaded" && fileName ? (
            <span className="hidden max-w-44 truncate text-xs font-medium text-neutral-600 md:block">
              {fileName}
            </span>
          ) : null}

          <input
            ref={fileInputRef}
            type="file"
            accept=".md,text/markdown"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={openFilePicker}
            disabled={isUploading}
            className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
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
            className="hidden text-sm font-medium text-neutral-700 hover:text-neutral-900 sm:flex"
          >
            Pricing
          </Link>
        </div>
      </div>
    </nav>
  );
}
