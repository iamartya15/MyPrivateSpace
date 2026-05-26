import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Toaster } from "sonner";
import { Landing } from "@/components/keep/Landing";
import { useAuth } from "@/hooks/use-auth";
import type { Note } from "@/lib/notes-store";
import { useNotes } from "@/lib/notes-store";
import { getAppUrl } from "@/lib/env";

export const Route = createFileRoute("/")({
  head: () => {
    const appUrl = getAppUrl();
    return {
      meta: [
        { title: "MyPrivateSpace — Your private notes & checklists" },
        {
          name: "description",
          content:
            "MyPrivateSpace is your private cloud notebook. Capture notes, lists and scanned ideas, organize with colors and labels, and find anything instantly.",
        },
        { property: "og:title", content: "MyPrivateSpace — Your private notes & checklists" },
        {
          property: "og:description",
          content:
            "Capture notes, lists and scanned ideas in your private cloud notebook — fast, secure, and synced across devices.",
        },
        { property: "og:url", content: appUrl },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: appUrl }],
    };
  },
  component: KeepPage,
});

function KeepPage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster richColors position="top-center" />
        <Landing />
      </>
    );
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <NotesApp signOut={signOut} userEmail={user.email ?? null} />
    </>
  );
}

function NotesApp({ signOut, userEmail }: { signOut: () => void; userEmail: string | null }) {
  const { notes, ready, addNote, updateNote } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notes
      .filter((note) => !note.archived && !note.trashed)
      .filter((note) => {
        if (!q) return true;
        return note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q);
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, search]);

  const onCreate = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle && !trimmedContent) return;

    addNote({
      title: trimmedTitle || "Untitled",
      content: trimmedContent,
      color: "default",
      pinned: false,
      archived: false,
      trashed: false,
      labels: [],
    });
    setTitle("");
    setContent("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold">MyPrivateSpace</h1>
            {userEmail ? <p className="text-sm text-muted-foreground">{userEmail}</p> : null}
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-md border border-input px-3 py-2 text-sm hover:bg-secondary"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="mb-6 space-y-3 rounded-xl border border-border bg-card p-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Note title"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your note..."
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={onCreate}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Save note
          </button>
        </div>

        <div className="mb-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notes"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading your notes...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No notes yet. Create your first note above.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onTrash={() => updateNote(note.id, { trashed: true })}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function NoteCard({ note, onTrash }: { note: Note; onTrash: () => void }) {
  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h2 className="line-clamp-2 text-sm font-semibold">{note.title}</h2>
        <button
          type="button"
          onClick={onTrash}
          className="rounded-md border border-input px-2 py-1 text-xs hover:bg-secondary"
        >
          Trash
        </button>
      </div>
      <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
        {note.content}
      </p>
    </article>
  );
}
