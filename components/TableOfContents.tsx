"use client";

import { useEffect, useState } from "react";

interface Chapter {
  id: string;
  number: string;
  title: string;
}

interface TableOfContentsProps {
  chapters?: Chapter[];
}

export default function TableOfContents({
  chapters = [],
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? "");

  useEffect(() => {
    if (chapters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { 
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1
      }
    );

    // Observer toutes les sections
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => section !== null);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [chapters]);

  if (chapters.length === 0) {
    return null;
  }

  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 border-r border-black/10 bg-white/70 px-4 py-6 backdrop-blur lg:block">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Chapters
        </p>
        <nav aria-label="Table of contents" className="space-y-1">
          {chapters.map((chapter) => {
            const isActive = chapter.id === activeId;

            return (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                onClick={() => setActiveId(chapter.id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-l-2 border-neutral-600 bg-neutral-100/80 rounded-r-md text-neutral-900"
                    : "text-neutral-600 hover:text-sky-500"
                }`}
              >
                <span className="text-xs font-semibold text-neutral-400">
                  {chapter.number}
                </span>
                <span className="leading-5">{chapter.title}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
