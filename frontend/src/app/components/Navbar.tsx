import { Link, useLocation } from "react-router";
import { Trash2 } from "lucide-react";
import { useI18n } from "../lib/i18n";

export function Navbar() {
  const location = useLocation();
  const { language, setLanguage, t } = useI18n();

  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/upload", label: t("nav.upload") },
    { path: "/history", label: t("nav.history") },
    { path: "/guidelines", label: t("nav.guidelines") },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
              <Trash2 className="size-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold leading-tight text-foreground">
                {t("brand.name")}
              </span>
              <span className="text-xs text-muted-foreground">{t("brand.subtitle")}</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-5 py-2.5 transition-all ${
                  isActive(item.path)
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="rounded-xl border border-[#1e40af]/35 bg-gradient-to-br from-[#dbeafe] via-[#bfdbfe] to-[#93c5fd] px-4 py-2.5 font-semibold text-[#0f2f77] shadow-md shadow-[#1e3a8a]/15 transition-all hover:brightness-95 hover:shadow-lg hover:shadow-[#1e3a8a]/25"
              aria-label="Toggle language"
            >
              {t("nav.lang")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
