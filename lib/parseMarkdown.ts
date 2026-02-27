export interface MarkdownHeading {
  id: string;
  depth: 1 | 2 | 3;
  title: string;
}

const HEADING_PATTERN = /^(#{1,3})\s+(.+)$/;
const FENCE_PATTERN = /^(```|~~~)/;

export function stripMarkdownInline(value: string): string {
  return value
    .trim()
    .replace(/\s+#+\s*$/, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function slugifyHeading(value: string): string {
  const normalized = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "section";
}

export function extractMarkdownHeadings(content: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const slugCounts = new Map<string, number>();
  let inCodeFence = false;

  for (const line of content.split(/\r?\n/)) {
    if (FENCE_PATTERN.test(line.trim())) {
      inCodeFence = !inCodeFence;
      continue;
    }

    if (inCodeFence) {
      continue;
    }

    const match = line.match(HEADING_PATTERN);
    if (!match) {
      continue;
    }

    const depth = match[1].length as 1 | 2 | 3;
    const title = stripMarkdownInline(match[2]);
    if (!title) {
      continue;
    }

    const baseId = slugifyHeading(title);
    const currentCount = slugCounts.get(baseId) ?? 0;
    const nextCount = currentCount + 1;
    slugCounts.set(baseId, nextCount);

    headings.push({
      id: nextCount === 1 ? baseId : `${baseId}-${nextCount}`,
      depth,
      title,
    });
  }

  return headings;
}
