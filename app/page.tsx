import Link from "next/link";
import { getAllArticles } from "@/lib/markdown";

export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="space-y-10 py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Library
        </p>
        <h1 className="text-4xl font-semibold text-neutral-900">
          Articles
        </h1>
        <p className="text-base leading-7 text-neutral-700">
          Select an article to explore the chapters and jump through the table
          of contents.
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="rounded-md border border-black/10 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          No articles yet. Upload a markdown file to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map(({ slug, metadata }) => (
            <Link
              key={slug}
              href={`/article/${slug}`}
              className="group block rounded-xl border border-black/10 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    {metadata.subtitle}
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-900">
                    {metadata.title}
                  </h2>
                </div>
                <span className="text-sm font-medium text-neutral-500 transition group-hover:text-neutral-900">
                  Read
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                {metadata.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
