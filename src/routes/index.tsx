import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Lightbulb, Archive as ArchiveIcon, Trash2 } from "lucide-react";
import { Toaster } from "sonner";
import { Header } from "@/components/keep/Header";
import { Sidebar, MobileSidebar, View } from "@/components/keep/Sidebar";
import { QuickCreate } from "@/components/keep/QuickCreate";
import { NoteCard } from "@/components/keep/NoteCard";
import { NoteEditor } from "@/components/keep/NoteEditor";
import { Landing } from "@/components/keep/Landing";
import { SettingsDialog } from "@/components/keep/SettingsDialog";
import { LockDialog } from "@/components/keep/LockDialog";
import { Note, useNotes, useSettings } from "@/lib/notes-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyPrivateSpace — Your private notes & checklists" },
      { name: "description", content: "MyPrivateSpace is your private cloud notebook. Capture notes, lists and scanned ideas, organize with colors and labels, and find anything instantly." },
      { property: "og:title", content: "MyPrivateSpace — Your private notes & checklists" },
      { property: "og:description", content: "Capture notes, lists and scanned ideas in your private cloud notebook — fast, secure, and synced across devices." },
      { property: "og:url", content: "https://mysecretspace.lovable.app/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://mysecretspace.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "MyPrivateSpace",
          url: "https://mysecretspace.lovable.app/",
          description: "Your private cloud notebook for notes, checklists and scanned ideas.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MyPrivateSpace",
          url: "https://mysecretspace.lovable.app/",
          logo: "https://mysecretspace.lovable.app/favicon.ico",
        }),
      },
    ],
  }),
  component: KeepPage,
});

function KeepPage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }
  if (!user) {
    return (<><Toaster richColors position="top-center" /><Landing /></>);
  }
  return (<><Toaster richColors position="top-center" /><NotesApp signOut={signOut} userEmail={user.email ?? user.phone ?? null} /></>);
}

function NotesApp({ signOut, userEmail }: { signOut: () => void; userEmail: string | null }) {
  const { notes, ready, addNote, updateNote, removeNote } = useNotes();
  const { settings, update: updateSettings } = useSettings();
  const [view, setView] = useState<View>("notes");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Note | null>(null);
  const [unlockTarget, setUnlockTarget] = useState<Note | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = notes.filter(n => {
      if (view === "trash") { if (!n.trashed) return false; }
      else if (view === "archive") { if (n.trashed || !n.archived) return false; }
      else { if (n.trashed || n.archived) return false; }
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.checklist?.some(i => i.text.toLowerCase().includes(q))
      );
    });
    const sorted = [...list].sort((a, b) => {
      if (settings.sort === "alpha") return (a.title || a.content).localeCompare(b.title || b.content);
      if (settings.sort === "created") return b.createdAt - a.createdAt;
      return b.updatedAt - a.updatedAt;
    });
    return sorted;
  }, [notes, view, query, settings.sort]);

  const pinned = filtered.filter(n => n.pinned);
  const others = filtered.filter(n => !n.pinned);
  const showSection = view === "notes" && pinned.length > 0;

  const title = view === "notes" ? "MyPrivateSpace" : view === "archive" ? "Archive" : view === "trash" ? "Trash" : view === "reminders" ? "Reminders" : "Labels";

  const openNote = (n: Note) => {
    if (n.locked) setUnlockTarget(n);
    else setEditing(n);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenu={() => setMobileNav(true)}
        query={query} onQuery={setQuery}
        title={title}
        onSignOut={signOut} userEmail={userEmail}
        sort={settings.sort}
        onSort={(s) => updateSettings({ sort: s })}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <div className="flex">
        <Sidebar view={view} onChange={setView} />
        <MobileSidebar open={mobileNav} onOpenChange={setMobileNav} view={view} onChange={setView} />
        <main className="flex-1 px-3 py-6 sm:px-4 md:px-6">
          {view === "notes" && <QuickCreate onCreate={addNote} />}

          {!ready ? null : filtered.length === 0 ? (
            <EmptyState view={view} />
          ) : (
            <div className="mx-auto max-w-[1500px]">
              {showSection && (
                <>
                  <SectionLabel>Pinned</SectionLabel>
                  <div className="masonry mb-8">
                    {pinned.map(n => (
                      <NoteCard
                        key={n.id} note={n} view={view as any}
                        onClick={() => openNote(n)}
                        onUpdate={(p) => updateNote(n.id, p)}
                        onDelete={() => removeNote(n.id)}
                      />
                    ))}
                  </div>
                  <SectionLabel>Others</SectionLabel>
                </>
              )}
              <div className="masonry">
                {others.map(n => (
                  <NoteCard
                    key={n.id} note={n} view={view === "archive" ? "archive" : view === "trash" ? "trash" : "notes"}
                    onClick={() => openNote(n)}
                    onUpdate={(p) => updateNote(n.id, p)}
                    onDelete={() => removeNote(n.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <NoteEditor
        note={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
        onUpdate={(p) => editing && updateNote(editing.id, p)}
        onDelete={() => editing && updateNote(editing.id, { trashed: true, pinned: false })}
      />

      <LockDialog
        open={!!unlockTarget}
        mode="unlock"
        onClose={() => setUnlockTarget(null)}
        onSubmit={(hash) => {
          if (unlockTarget && hash === unlockTarget.passwordHash) {
            setEditing(unlockTarget);
            return true;
          }
          return false;
        }}
      />

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={updateSettings}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 px-3 text-xs font-semibold tracking-wider text-muted-foreground">{children}</h2>;
}

function EmptyState({ view }: { view: View }) {
  const Icon = view === "trash" ? Trash2 : view === "archive" ? ArchiveIcon : Lightbulb;
  const text = view === "trash" ? "No notes in Trash" : view === "archive" ? "Your archived notes appear here" : "Notes you add appear here";
  return (
    <div className="mx-auto mt-24 flex max-w-md flex-col items-center text-center text-muted-foreground">
      <Icon className="h-32 w-32 opacity-20" strokeWidth={1} />
      <p className="mt-4 font-display text-xl">{text}</p>
    </div>
  );
}