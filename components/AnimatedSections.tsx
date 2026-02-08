"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
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

const sectionClassName = "scroll-mt-24 space-y-4";

export default function AnimatedSections() {
  return (
    <AnimatePresence>
      <div className="space-y-12">
        <motion.section
          key="introduction"
          id="introduction"
          className={sectionClassName}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl text-neutral-900">Introduction</h2>
          <p className="text-base leading-7 text-neutral-700">
            Claude Articles is built for teams who need to turn raw research
            into clear, carefully structured narratives. The workflow focuses on
            context first, then on crisp structure so every chapter reads with
            intention.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-base text-neutral-700">
            <li>Start with the thesis, then validate it with evidence.</li>
            <li>Chunk the source material into skimmable sections.</li>
            <li>Close every chapter with a crisp takeaway.</li>
          </ul>
        </motion.section>

        <motion.section
          key="prompting-mindset"
          id="prompting-mindset"
          className={sectionClassName}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl text-neutral-900">The Prompting Mindset</h2>
          <p className="text-base leading-7 text-neutral-700">
            Prompts are design briefs. The best ones define who the reader is,
            what they need, and how the output should feel. Treat every prompt
            as a short contract between the editor and the model.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-base text-neutral-700">
            <li>
              Provide a role, a mission, and a tone.
              <ul className="mt-2 list-disc space-y-2 pl-6 text-sm text-neutral-600">
                <li>Role: &quot;You are the lead editor.&quot;</li>
                <li>Mission: &quot;Deliver a concise chapter outline.&quot;</li>
                <li>Tone: &quot;Measured, editorial, and accessible.&quot;</li>
              </ul>
            </li>
            <li>Use constraints to reduce drift.</li>
            <li>Reference example chapters whenever possible.</li>
          </ul>
        </motion.section>

        <motion.section
          key="context-windows"
          id="context-windows"
          className={sectionClassName}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl text-neutral-900">Working With Context</h2>
          <p className="text-base leading-7 text-neutral-700">
            The context window is your editorial desk. Every paragraph should
            earn its space by supporting the thesis or resolving an open
            question.
          </p>
          <div className="rounded-md border border-black/10 bg-gray-100 px-4 py-3 text-sm text-neutral-700">
            Tip: paste your notes in a &quot;source&quot; block, then ask for a
            summary before drafting. It keeps the model from guessing.
          </div>
          <p className="text-base leading-7 text-neutral-700">
            When the source material is large, split it into smaller batches and
            have the model summarize each batch before composing the final
            chapter.
          </p>
        </motion.section>

        <motion.section
          key="structure-constraints"
          id="structure-constraints"
          className={sectionClassName}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl text-neutral-900">
            Structure &amp; Constraints
          </h2>
          <p className="text-base leading-7 text-neutral-700">
            Structure is how you earn trust. Readers should always know where
            they are, what they just learned, and what comes next.
          </p>
          <h3 className="text-xl text-neutral-900">Layout checklist</h3>
          <ul className="list-disc space-y-2 pl-6 text-base text-neutral-700">
            <li>Lead with an H2 that states the chapter&apos;s promise.</li>
            <li>Follow with a short summary paragraph.</li>
            <li>Use bullet lists for dense concept clusters.</li>
            <li>Include a callout whenever a principle needs emphasis.</li>
          </ul>
        </motion.section>

        <motion.section
          key="iterating-feedback"
          id="iterating-feedback"
          className={sectionClassName}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl text-neutral-900">Iterating With Feedback</h2>
          <p className="text-base leading-7 text-neutral-700">
            Treat drafts as checkpoints, not finish lines. Fast feedback loops
            keep the narrative tight and prevent stylistic drift.
          </p>
          <ol className="list-decimal space-y-2 pl-6 text-base text-neutral-700">
            <li>Review for missing context and clarity.</li>
            <li>Annotate where evidence is weak or missing.</li>
            <li>Ask for a revision that only addresses those notes.</li>
          </ol>
        </motion.section>

        <motion.section
          key="tooling-verification"
          id="tooling-verification"
          className={sectionClassName}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl text-neutral-900">
            Tool Use &amp; Verification
          </h2>
          <p className="text-base leading-7 text-neutral-700">
            Every factual claim needs a source you can verify. Keep a separate
            note of links, then cite them as you finalize the draft. For deeper
            reading, refer to{" "}
            <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer">
              the Next.js documentation
            </a>{" "}
            and internal editorial guidelines.
          </p>
          <div className="rounded-md border border-black/10 bg-gray-100 px-4 py-3 text-sm text-neutral-700">
            Verification prompt: &quot;List each claim that needs a citation,
            then propose a source for each.&quot;
          </div>
        </motion.section>

        <motion.section
          key="ethics-safety"
          id="ethics-safety"
          className={sectionClassName}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl text-neutral-900">Ethics &amp; Safety</h2>
          <p className="text-base leading-7 text-neutral-700">
            Editorial integrity is non-negotiable. Clarify what can be inferred,
            what must be verified, and what should be omitted entirely.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-base text-neutral-700">
            <li>State uncertainty explicitly when the data is incomplete.</li>
            <li>Avoid fabricating quotes, metrics, or sources.</li>
            <li>Remove sensitive information unless consent is documented.</li>
          </ul>
        </motion.section>

        <motion.div
          key="pricing"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
        >
          <section id="pricing" className="scroll-mt-24 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl text-neutral-900">Pricing</h2>
              <p className="text-base leading-7 text-neutral-700">
                Choose the plan that matches your cadence. Upgrade anytime as
                your article pipeline grows.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Starter
                </p>
                <p className="mt-3 text-3xl font-semibold text-neutral-900">$0</p>
                <p className="mt-2 text-sm text-neutral-600">
                  For trying the format.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  <li>2 articles per month</li>
                  <li>Community templates</li>
                  <li>Email support</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Studio
                </p>
                <p className="mt-3 text-3xl font-semibold text-neutral-900">
                  $24
                </p>
                <p className="mt-2 text-sm text-neutral-600">
                  For weekly publishing.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  <li>Unlimited chapters</li>
                  <li>Private style library</li>
                  <li>Priority feedback</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Enterprise
                </p>
                <p className="mt-3 text-3xl font-semibold text-neutral-900">
                  $48
                </p>
                <p className="mt-2 text-sm text-neutral-600">
                  For distributed editorial teams.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  <li>Custom governance</li>
                  <li>Security reviews</li>
                  <li>Dedicated success</li>
                </ul>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
