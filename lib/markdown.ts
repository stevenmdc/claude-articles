import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export interface Chapter {
  id: string;
  number: string;
  title: string;
}

export interface ArticleMetadata {
  title: string;
  subtitle: string;
  description: string;
  author?: string;
  date?: string;
  chapters: Chapter[];
}

export interface Article {
  slug: string;
  metadata: ArticleMetadata;
  content: string;
  contentHtml: string;
}

type MdastNode = {
  type: string;
  children?: MdastNode[];
  value?: string;
  data?: {
    hProperties?: Record<string, unknown>;
  };
};

function applyHeadingIds() {
  return (tree: MdastNode) => {
    const visit = (node: MdastNode) => {
      if (node.type === "heading" && node.children?.length) {
        const lastChild = node.children[node.children.length - 1];

        if (lastChild?.type === "text" && typeof lastChild.value === "string") {
          const match = lastChild.value.match(/\s*\{#([A-Za-z][\w-]*)\}\s*$/);

          if (match) {
            const id = match[1];
            const cleaned = lastChild.value.replace(
              /\s*\{#([A-Za-z][\w-]*)\}\s*$/,
              ""
            );

            if (cleaned.trim().length === 0) {
              node.children.pop();
            } else {
              lastChild.value = cleaned;
            }

            node.data = node.data ?? {};
            node.data.hProperties = {
              ...(node.data.hProperties ?? {}),
              id,
            };
          }
        }
      }

      node.children?.forEach(visit);
    };

    visit(tree);
  };
}

// Récupérer tous les slugs d'articles
export function getAllArticleSlugs() {
  const fileNames = fs
    .readdirSync(articlesDirectory)
    .filter((fileName) => fileName.endsWith(".md"));

  return fileNames
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ""),
    }))
    .filter(({ slug }) => Boolean(slug));
}

// Récupérer un article par slug
export async function getArticleBySlug(slug: string): Promise<Article> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Parser le frontmatter
  const { data, content } = matter(fileContents);

  // Convertir le markdown en HTML
  const processedContent = await unified()
    .use(remarkParse)
    .use(applyHeadingIds)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    slug,
    metadata: data as ArticleMetadata,
    content,
    contentHtml,
  };
}

// Lister tous les articles (pour une page index)
export function getAllArticles(): Array<{
  slug: string;
  metadata: ArticleMetadata;
}> {
  const slugs = getAllArticleSlugs();
  return slugs.map(({ slug }) => {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      metadata: data as ArticleMetadata,
    };
  });
}
