import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-black/10 bg-[#f0f0eb]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link className="flex items-center gap-3 text-neutral-900" href="/">
          <Image
            src="/images/logo.png"
            alt="Claude Articles logo"
            width={150}
            height={50}
            loading="eager"
          />
          <span className="-translate-y-2 -translate-x-2 font-heading font-semibold">
            Articles
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="/pricing"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            Pricing
          </a>
          <a
            href="https://support.claude.com/en"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            Docs
          </a>
          <a
            href="/contact"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
