"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.6, ease: [0.4, 0, 1, 1] },
  },
};

interface DynamicSectionsProps {
  contentHtml: string;
}

export default function DynamicSections({ contentHtml }: DynamicSectionsProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Find all section headings (h2 with id)
    const sections = Array.from(
      contentRef.current.querySelectorAll("h2[id]")
    );

    sections.forEach((section) => {
      const parent = section.parentElement;
      if (!parent) return;
      if (parent.dataset.sectionWrapper === "true") return;

      // Wrap the section heading and its content
      const wrapper = document.createElement("section");
      wrapper.className = "scroll-mt-24 space-y-4";
      wrapper.dataset.sectionWrapper = "true";

      parent.insertBefore(wrapper, section);

      let current: Element | null = section;

      // Collect all elements until the next h2
      while (current) {
        const nextElement: Element | null = current.nextElementSibling;
        wrapper.appendChild(current);
        if (!nextElement || nextElement.tagName === "H2") break;
        current = nextElement;
      }
    });
  }, [contentHtml]);

  return (
    <AnimatePresence>
      <motion.div
        ref={contentRef}
        className="prose prose-neutral max-w-none space-y-12 prose-headings:font-heading prose-h2:text-3xl prose-h2:scroll-mt-24 prose-h3:text-xl"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      />
    </AnimatePresence>
  );
}
