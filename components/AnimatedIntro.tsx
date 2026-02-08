"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function AnimatedIntro() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <motion.p variants={itemVariants} className="text-sm uppercase tracking-[0.3em] text-neutral-500">
        Claude Articles
      </motion.p>
      <motion.h1
        variants={itemVariants}
        className="text-4xl leading-tight text-neutral-900"
      >
        A field guide to building precise, elegant AI-assisted articles.
      </motion.h1>
      <motion.p variants={itemVariants} className="text-base leading-7 text-neutral-700">
        This guide documents the working style behind Claude Articles: how the
        teams collect context, shape prompts, and review drafts so every chapter
        reads with clarity. Follow the flow, then adapt it to your newsroom or
        studio.
      </motion.p>
      <motion.div
        variants={itemVariants}
        className="rounded-md border border-black/10 bg-gray-100 px-4 py-3 text-sm text-neutral-700"
      >
        Quick start: open the table of contents, jump to a chapter, and return
        here whenever you need the core principles.
      </motion.div>
    </motion.div>
  );
}
