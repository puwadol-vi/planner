import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/bitcoin-wealth-planner", label: "Wealth Planner" },
  { href: "/bitcoin-vs-insurance-simulator", label: "BTC vs Insurance" },
  { href: "/when-should-i-invest", label: "When to Invest" },
];

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 shadow-md bg-[#F7931A]"
    >
      <Link
        href="/"
        className="flex items-center justify-center rounded-full overflow-hidden mx-2 ring-2 ring-white/30 transition hover:ring-white/60"
        aria-label="Home"
      >
        <Image
          src="/images/home/author.jpg"
          alt="Home"
          width={40}
          height={40}
          className="h-10 w-10 object-cover"
        />
      </Link>
      <div className="flex items-center gap-2">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
