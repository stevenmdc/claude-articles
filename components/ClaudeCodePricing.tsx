// components/ClaudeCodePricing.tsx
"use client";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

const tiers = [
  {
    name: "Free",
    id: "tier-free",
    href: "#",
    priceMonthly: "$0",
    priceUnit: "/mois",
    priceNote: "Gratuit pour toujours",
    description: "Pour découvrir Claude Code et tester ses capacités.",
    features: [
      "~50 conversations par mois",
      "Fenêtre de contexte : 200K tokens",
      "Accès au modèle Claude Sonnet",
      "Support communautaire",
      "Projets limités (3 max)",
    ],
    usage: "Usage découverte",
    conversations: "~50",
    conversationsLabel: "conversations / mois",
    costHint: "Gratuit",
    cta: "Commencer gratuitement",
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    priceMonthly: "$20",
    priceUnit: "/mois",
    priceNote: "Facturé mensuellement",
    description:
      "Pour les développeurs individuels qui utilisent Claude Code régulièrement.",
    features: [
      "~500 conversations par mois",
      "Fenêtre de contexte : 200K tokens",
      "Accès à tous les modèles Claude",
      "Support communautaire",
      "Mises à jour automatiques",
    ],
    usage: "Usage faible à modéré",
    conversations: "~500",
    conversationsLabel: "conversations / mois",
    costHint: "≈ $0.04 / conversation",
    cta: "Choisir Pro",
    mostPopular: false,
  },
  {
    name: "Max",
    id: "tier-max",
    href: "#",
    hasVariants: true,
    variants: [
      {
        id: "x5",
        label: "x5",
        priceMonthly: "$100",
        priceUnit: "/mois",
        priceNote: "5x plus d'usage que Pro",
        conversations: "~2 500",
        conversationsLabel: "conversations / mois",
        costHint: "≈ $0.04 / conversation",
        multiplier: "5x",
      },
      {
        id: "x20",
        label: "x20",
        priceMonthly: "$400",
        priceUnit: "/mois",
        priceNote: "20x plus d'usage que Pro",
        conversations: "~10 000",
        conversationsLabel: "conversations / mois",
        costHint: "≈ $0.04 / conversation",
        multiplier: "20x",
      },
    ],
    description:
      "Pour les développeurs professionnels avec des besoins intensifs.",
    features: [
      "Fenêtre de contexte : 200K tokens",
      "Accès prioritaire aux nouveaux modèles",
      "Support par email",
      "Projets illimités",
      "Accès anticipé aux fonctionnalités",
    ],
    usage: "Usage intensif",
    cta: "Passer à Max",
    mostPopular: true,
  },
  {
    name: "API",
    id: "tier-api",
    href: "#",
    priceMonthly: "Variable",
    priceUnit: "",
    priceNote: "Paiement au token utilisé",
    description: "Paiement à l'usage avec contrôle total sur vos coûts.",
    features: [
      "Conversations illimitées",
      "Fenêtre de contexte : jusqu'à 1M tokens",
      "Facturation au token utilisé",
      "Support technique dédié",
      "Contrôle granulaire des coûts",
      "Idéal pour l'intégration personnalisée",
    ],
    usage: "Pay-as-you-go",
    conversations: "∞",
    conversationsLabel: "au token",
    costHint: "$3-15 / 1M tokens",
    cta: "Voir la tarification API",
    mostPopular: false,
    apiPricing: true,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ClaudeCodePricing() {
  const [selectedMaxVariant, setSelectedMaxVariant] = useState("x5");

  return (
    <section>
      <div className="relative overflow-hidden pt-12 border border-neutral-900/60 bg-neutral-950 text-white shadow-[0_30px_80px_-50px_rgba(0,0,0,0.9)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_55%)]" />
        <div className="relative text-center px-8 pb-10 pt-12 sm:px-12">
          <h2 className="mt-3 text-3xl font-heading">
            Tarification Claude Code
          </h2>
          <p className="text-xs uppercase tracking-[0.34em] text-neutral-400">
            Comparaison des usages
          </p>
        </div>
        <div className="relative px-6 pb-12 sm:px-10">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {tiers.map((tier) => {
              // Pour le tier Max avec variants
              if (tier.hasVariants && tier.variants) {
                const activeVariant = tier.variants.find(
                  (v) => v.id === selectedMaxVariant,
                );
                if (!activeVariant) return null;

                return (
                  <div
                    key={tier.id}
                    className={classNames(
                      "group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur",
                      tier.mostPopular
                        ? "ring-2 ring-sky-300/70 shadow-[0_0_0_1px_rgba(125,211,252,0.4)]"
                        : "transition hover:border-white/20",
                    )}
                  >
                    <div className="mt-0">
                      <h3 className="text-xl font-heading text-white">
                        {tier.name}
                      </h3>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="mt-2 text-2xl font-semibold text-white">
                            {activeVariant.conversations}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {activeVariant.conversationsLabel}
                          </p>
                          <p className="mt-2 text-xs text-neutral-400">
                            {activeVariant.costHint}
                          </p>
                        </div>
                        {tier.mostPopular ? (
                          <span className="rounded-full absolute right-0 top-0 -translate-3.5 bg-sky-300 px-2.5 py-1 text-xs font-semibold text-sky-900">
                            Plus populaire
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 inline-flex rounded-full border border-white/10 px-2.5 py-1 text-xs text-neutral-300">
                        {tier.usage}
                      </p>
                    </div>

                    {/* Tab Selector for Max variants */}
                    <div className="mt-4 flex gap-2">
                      {tier.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedMaxVariant(variant.id)}
                          className={classNames(
                            "flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition",
                            selectedMaxVariant === variant.id
                              ? "bg-white/20 text-white"
                              : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white",
                          )}
                        >
                          {variant.label}
                          <span className="ml-1 text-[10px] opacity-70">
                            ({variant.multiplier})
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-semibold text-white">
                          {activeVariant.priceMonthly}
                        </span>
                        {activeVariant.priceUnit ? (
                          <span className="text-xs text-neutral-400">
                            {activeVariant.priceUnit}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-neutral-400">
                        {activeVariant.priceNote}
                      </p>
                    </div>

                    <ul role="list" className="mt-6 space-y-2 text-sm">
                      <li className="flex gap-x-3 text-neutral-200">
                        <CheckIcon
                          aria-hidden="true"
                          className="h-5 w-5 flex-none text-sky-200"
                        />
                        {activeVariant.conversations} conversations par mois
                      </li>
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex gap-x-3 text-neutral-200"
                        >
                          <CheckIcon
                            aria-hidden="true"
                            className="h-5 w-5 flex-none text-sky-200"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              // Pour les autres tiers (Free, Pro, API)
              return (
                <div
                  key={tier.id}
                  className={classNames(
                    "group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur",
                    tier.mostPopular
                      ? "ring-2 ring-sky-300/70 shadow-[0_0_0_1px_rgba(125,211,252,0.4)]"
                      : "transition hover:border-white/20",
                  )}
                >
                  <div className="mt-0">
                    <h3 className="text-xl font-heading text-white">
                      {tier.name}
                    </h3>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {tier.conversations}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {tier.conversationsLabel}
                        </p>
                        <p className="mt-2 text-xs text-neutral-400">
                          {tier.costHint}
                        </p>
                      </div>
                      {tier.mostPopular ? (
                        <span className="rounded-full bg-sky-300/15 px-2.5 py-1 text-xs font-semibold text-sky-200">
                          Plus populaire
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 inline-flex rounded-full border border-white/10 px-2.5 py-1 text-xs text-neutral-300">
                      {tier.usage}
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-white">
                        {tier.priceMonthly}
                      </span>
                      {tier.priceUnit ? (
                        <span className="text-xs text-neutral-400">
                          {tier.priceUnit}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-neutral-400">
                      {tier.priceNote}
                    </p>
                  </div>

                  <ul role="list" className="mt-6 space-y-2 text-sm">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-x-3 text-neutral-200"
                      >
                        <CheckIcon
                          aria-hidden="true"
                          className="h-5 w-5 flex-none text-sky-200"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
