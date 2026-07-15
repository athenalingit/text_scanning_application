"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Google Vision" },
  { href: "/scan", label: "Scan" },
  { href: "/compare", label: "Compare" },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="mb-3 flex gap-2 sm:mb-4">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`min-h-10 flex-1 rounded-xl px-3 py-2 text-center text-sm font-medium sm:flex-none sm:px-4 ${
              isActive
                ? "bg-black text-white"
                : "border border-neutral-300 bg-white text-neutral-700 active:bg-neutral-100 sm:hover:bg-neutral-100"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
