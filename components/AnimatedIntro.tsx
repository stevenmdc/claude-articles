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

interface AnimatedIntroProps {
  subtitle: string;
  title: string;
  description: string;
}

export default function AnimatedIntro({
  subtitle,
  title,
  description,
}: AnimatedIntroProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <motion.p variants={itemVariants} className="text-sm uppercase tracking-[0.3em] text-neutral-500">
        {subtitle}
      </motion.p>
      <motion.h1
        variants={itemVariants}
        className="text-4xl leading-tight text-neutral-900"
      >
        {title}
      </motion.h1>
      <motion.p variants={itemVariants} className="text-base leading-7 text-neutral-700">
        {description}
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