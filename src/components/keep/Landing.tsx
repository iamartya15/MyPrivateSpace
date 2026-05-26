import { AuthCard } from "@/components/keep/AuthCard";
import {
  Mic,
  ScanText,
  Palette,
  Tag,
  Users,
  MapPin,
  History,
  CheckSquare,
  Cloud,
  Smartphone,
  Layers,
} from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Brand />
          <a
            href="#auth"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Get started
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Cloud className="h-3 w-3" /> Your private cloud notebook
          </div>
          <h1 className="font-display text-5xl font-medium leading-tight tracking-tight md:text-6xl">
            Capture ideas in your <span className="text-primary">private space</span>.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            MyPrivateSpace gives you a fast, beautifully simple home for notes, lists, voice memos
            and inspiration — synced and encrypted across every device.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#auth"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Sign in free
            </a>
            <a
              href="#features"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-hover"
            >
              Explore features
            </a>
          </div>
        </div>
        <div id="auth" className="flex justify-center lg:justify-end">
          <AuthCard />
        </div>
      </section>

      <section id="features" className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-medium md:text-4xl">Core Features 🚀</h2>
            <p className="mt-3 text-muted-foreground">Tools that go beyond simple text entry.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Feature icon={CheckSquare} title="Quick Notes & Checklists">
              Create text notes or interactive to-do lists with checkboxes that cross off completed
              items.
            </Feature>
            <Feature icon={Mic} title="Voice Notes with Transcription">
              Record your voice on the go. The app saves the audio and transcribes it into
              searchable text.
            </Feature>
            <Feature icon={ScanText} title="Grab Image Text (OCR)">
              Snap a photo of a document, book, or receipt and extract the text so you can copy and
              edit it.
            </Feature>
            <Feature icon={Palette} title="Colors & Custom Backgrounds">
              Organize your dashboard visually with colors or stylized background themes on each
              note.
            </Feature>
            <Feature icon={Tag} title="Labels and Pins">
              Pin critical notes to the top. Add custom labels like #Work, #Groceries, or #Ideas to
              filter fast.
            </Feature>
            <Feature icon={Users} title="Real-time Collaboration">
              Share notes with friends or colleagues — everyone can view and edit simultaneously.
            </Feature>
            <Feature icon={MapPin} title="Location & Time Reminders">
              Set reminders for a time or place — your shopping list pops up when you arrive at the
              store.
            </Feature>
            <Feature icon={History} title="Version History">
              Review and download previous iterations of a note if you accidentally delete or alter
              your data.
            </Feature>
            <Feature icon={Cloud} title="Always Saved">
              Every keystroke saves instantly to secure cloud servers — no "Save" button to worry
              about.
            </Feature>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-medium md:text-4xl">How it's built 🛠️</h2>
            <p className="mt-3 text-muted-foreground">
              Engineered for speed, reliability, and cross-platform performance.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Feature icon={Cloud} title="Cloud-Native Architecture">
              Built on robust global cloud infrastructure. Every note you type is instantly saved to
              secure servers — no manual save needed.
            </Feature>
            <Feature icon={Smartphone} title="Cross-Platform Sync">
              Native platform-optimized clients with real-time databases sync your data instantly
              across mobile, tablet, and web.
            </Feature>
            <Feature icon={Layers} title="Workspace Integration">
              Deeply integrated with your productivity stack — accessible from mail, drive, and
              calendar side panels, with one-click export.
            </Feature>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <Brand small />
        <p className="mt-2">
          © {new Date().getFullYear()} MyPrivateSpace — your notes, your space.
        </p>
      </footer>
    </div>
  );
}

function Brand({ small = false }: { small?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`flex items-center justify-center rounded-lg bg-primary ${small ? "h-7 w-7" : "h-9 w-9"}`}
      >
        <svg viewBox="0 0 24 24" className={small ? "h-4 w-4" : "h-5 w-5"} fill="none">
          <path
            d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className={`font-display font-medium ${small ? "text-base" : "text-xl"}`}>
        MyPrivateSpace
      </span>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-md">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 font-display text-lg font-medium">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
