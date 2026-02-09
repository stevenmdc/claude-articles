export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="mx-auto max-w-3xl px-12 py-16">{children}</main>;
}
