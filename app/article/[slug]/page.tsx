import { getArticleBySlug, getAllArticleSlugs } from "@/lib/markdown";
import AnimatedIntro from "@/components/AnimatedIntro";
import DynamicSections from "@/components/DynamicSections";
import TableOfContents from "@/components/TableOfContents";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <TableOfContents chapters={article.metadata.chapters} />
      <article className="space-y-16 py-12">
        <AnimatedIntro
          subtitle={article.metadata.subtitle}
          title={article.metadata.title}
          description={article.metadata.description}
        />
        <DynamicSections contentHtml={article.contentHtml} />
      </article>
    </>
  );
}
