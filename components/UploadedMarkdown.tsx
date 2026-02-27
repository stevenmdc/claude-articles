"use client";

import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugifyHeading, stripMarkdownInline } from "@/lib/parseMarkdown";

interface UploadedMarkdownProps {
  content: string;
}

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return "";
  }

  return getTextContent(node.props.children);
}

function headingRendererFactory(slugCounts: Map<string, number>, tag: "h1" | "h2" | "h3") {
  return function Heading({
    children,
    className,
    ...props
  }: ComponentPropsWithoutRef<"h2">) {
    const title = stripMarkdownInline(
      Children.toArray(children).map((child) => getTextContent(child)).join(" "),
    );
    const baseId = slugifyHeading(title || tag);
    const currentCount = slugCounts.get(baseId) ?? 0;
    const nextCount = currentCount + 1;
    slugCounts.set(baseId, nextCount);
    const id = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;
    const resolvedClassName = [className, "scroll-mt-24"]
      .filter(Boolean)
      .join(" ");

    if (tag === "h1") {
      return (
        <h1 id={id} className={resolvedClassName} {...props}>
          {children}
        </h1>
      );
    }

    if (tag === "h2") {
      return (
        <h2 id={id} className={resolvedClassName} {...props}>
          {children}
        </h2>
      );
    }

    return (
      <h3 id={id} className={resolvedClassName} {...props}>
        {children}
      </h3>
    );
  };
}

export default function UploadedMarkdown({ content }: UploadedMarkdownProps) {
  const slugCounts = new Map<string, number>();

  const components: Components = {
    h1: headingRendererFactory(slugCounts, "h1"),
    h2: headingRendererFactory(slugCounts, "h2"),
    h3: headingRendererFactory(slugCounts, "h3"),
  };

  return (
    <div className="prose prose-neutral max-w-none space-y-12 prose-headings:font-heading prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
