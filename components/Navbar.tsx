import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-black/10 bg-[#f0f0eb]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3 text-neutral-900">
          <Image
            src="/images/logo.png"
            alt="Claude Articles logo"
            width={150}
            height={50}
          />
          <span className="-tranneutral-y-2 -tranneutral-x-2 font-heading font-semibold">
            Articles
          </span>
        </div>
      </div>
    </nav>
  );
}
