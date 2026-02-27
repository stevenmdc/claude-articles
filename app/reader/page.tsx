"use client";

import TableOfContents from "@/components/TableOfContents";
import UploadedMarkdown from "@/components/UploadedMarkdown";
import { useArticleContext } from "@/context/ArticleContext";

export default function ReaderPage() {
  const { fileName, content, headings, source, error } = useArticleContext();

  const chapters = headings.map((heading, index) => ({
    id: heading.id,
    number: String(index + 1),
    title: heading.title,
  }));

  return (
    <>
      <TableOfContents chapters={chapters} />
      <main className="mx-auto max-w-3xl px-12 py-16">
        <article className="space-y-10 py-12">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Reader
            </p>
            <h1 className="text-4xl font-semibold text-neutral-900">
              {fileName ?? "Upload a markdown file to start reading"}
            </h1>
            <p className="text-base leading-7 text-neutral-700">
              Uploads are stored only in memory and cleared on refresh.
            </p>
          </header>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {source === "uploaded" && content ? (
            <UploadedMarkdown content={content} />
          ) : (
            <div className="rounded-xl border border-black/10 bg-white px-5 py-4 text-sm text-neutral-700 shadow-sm">
              Click <span className="font-semibold">Upload .md</span> in the
              navbar to load a file.
            </div>
          )}
        </article>
      </main>
    </>
  );
}
