import { Link, useLocation } from "react-router";
import { Trash2 } from "lucide-react";

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/upload", label: "Upload" },
    { path: "/history", label: "History" },
    { path: "/guidelines", label: "Guidelines" },
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
                DMC Smart Monitor
              </span>
              <span className="text-xs text-muted-foreground">Dustbin Management System</span>
            </div>
          </Link>

          <div className="flex gap-2">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
