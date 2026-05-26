import { Lightbulb, Bell, Tag, Archive, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type View = "notes" | "reminders" | "labels" | "archive" | "trash";

const items: { key: View; icon: React.ElementType; label: string }[] = [
  { key: "notes", icon: Lightbulb, label: "Notes" },
  { key: "reminders", icon: Bell, label: "Reminders" },
  { key: "labels", icon: Tag, label: "Labels" },
  { key: "archive", icon: Archive, label: "Archive" },
  { key: "trash", icon: Trash2, label: "Trash" },
];

function Nav({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <nav className="space-y-0.5 py-2">
      {items.map(({ key, icon: Icon, label }) => {
        const active = view === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "group flex w-full items-center gap-6 rounded-r-full py-3 pl-6 pr-6 text-sm font-medium transition-colors",
              active ? "bg-accent text-accent-foreground" : "hover:bg-hover text-foreground"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function Sidebar({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <aside className="hidden w-[280px] shrink-0 md:block">
      <Nav view={view} onChange={onChange} />
    </aside>
  );
}

export function MobileSidebar({ open, onOpenChange, view, onChange }: { open: boolean; onOpenChange: (o: boolean) => void; view: View; onChange: (v: View) => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => onOpenChange(false)}>
      <div className="h-full w-[280px] bg-background p-0" onClick={(event) => event.stopPropagation()}>
        <Nav
          view={view}
          onChange={(v) => {
            onChange(v);
            onOpenChange(false);
          }}
        />
      </div>
    </div>
  );
}