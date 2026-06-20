"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const path = usePathname();
  const navLink = (href: string, label: string) => {
    const active = path === href || (href !== "/" && path.startsWith(href));
    return (
      <Link
        href={href}
        className="text-sm font-semibold transition-colors pb-1"
        style={{
          color: active ? "var(--primary)" : "var(--on-surface-variant)",
          borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 h-16 shadow-sm"
        style={{ background: "var(--surface)" }}
      >
        <div className="flex items-center justify-between h-full max-w-5xl mx-auto px-6">
          <Link href="/" className="serif text-xl font-bold" style={{ color: "var(--primary)" }}>
            우리가족 찾기
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLink("/", "홈")}
            {navLink("/admin", "관리자")}
          </nav>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 md:hidden rounded-t-2xl"
        style={{
          background: "var(--surface)",
          boxShadow: "0 -4px 20px rgba(193,127,58,0.08)",
        }}
      >
        <MobileNavBtn href="/" icon="home" label="홈" active={path === "/"} />
        <MobileNavBtn href="/admin" icon="settings" label="관리자" active={path === "/admin"} />
      </nav>
    </>
  );
}

function MobileNavBtn({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-0.5 px-6 py-1 rounded-full transition-colors"
      style={{
        background: active ? "var(--primary-fixed)" : "transparent",
        color: active ? "var(--primary)" : "var(--on-surface-variant)",
      }}
    >
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      <span className="text-[10px] font-semibold">{label}</span>
    </Link>
  );
}
