import AnimatedIntro from "@/components/AnimatedIntro";
import AnimatedSections from "@/components/AnimatedSections";

export default function Home() {
  return (
    <article className="space-y-16 py-12">
      <AnimatedIntro />
      <AnimatedSections />
    </article>
  );
}
