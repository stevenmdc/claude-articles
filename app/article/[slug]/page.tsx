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

  const generatedChapters = article.metadata.chapters ?? [];
  const chapters = [
    { id: "intro", number: "0", title: "Intro" },
    ...generatedChapters.map((chapter, index) => ({
      ...chapter,
      number: String(index + 1),
    })),
  ];

  return (
    <>
      <TableOfContents chapters={chapters} />
      <article className="space-y-16 py-12">
        <section id="intro" className="scroll-mt-24">
          <AnimatedIntro
            subtitle={article.metadata.subtitle}
            title={article.metadata.title}
            description={article.metadata.description}
          />
        </section>
        <DynamicSections contentHtml={article.contentHtml} />
      </article>
    </>
  );
}
