import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";

export type NoteColor =
  | "default" | "red" | "orange" | "yellow" | "green"
  | "teal" | "blue" | "darkblue" | "purple" | "pink" | "brown" | "gray";

export type ChecklistItem = { id: string; text: string; done: boolean };

export type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string; // base64 data URL
};

export type Note = {
  id: string;
  title: string;
  content: string;
  checklist?: ChecklistItem[];
  attachments?: Attachment[];
  color: NoteColor;
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  trashedAt?: number;
  locked?: boolean;
  passwordHash?: string;
  labels: string[];
  createdAt: number;
  updatedAt: number;
};

export type SortMode = "modified" | "created" | "alpha";

export type Settings = {
  sort: SortMode;
  autoEmptyDays: number; // 0 = never
};

const STORAGE_KEY_PREFIX = "keep-notes-v1-user-";
const SETTINGS_KEY_PREFIX = "keep-settings-v1-user-";

const getStorageKey = (userEmail: string) => `${STORAGE_KEY_PREFIX}${userEmail}`;
const getSettingsKey = (userEmail: string) => `${SETTINGS_KEY_PREFIX}${userEmail}`;

const DEFAULT_SETTINGS: Settings = { sort: "modified", autoEmptyDays: 7 };

const seed = (): Note[] => {
  const now = Date.now();
  return [
    {
      id: crypto.randomUUID(),
      title: "Welcome to MyPrivateSpace",
      content: "**Bold**, *italic*, and `code` work with markdown!\n\n# Headers\n## Subheaders\n\n- Lists\n- Tables\n- Links: [[Other note]]\n\nAttach files, lock private notes 🔒, and sort however you like.",
      color: "green",
      pinned: true,
      archived: false,
      trashed: false,
      labels: ["Inspiration"],
      createdAt: now, updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Groceries",
      content: "",
      checklist: [
        { id: crypto.randomUUID(), text: "Milk", done: false },
        { id: crypto.randomUUID(), text: "Eggs", done: true },
        { id: crypto.randomUUID(), text: "Bread", done: false },
      ],
      color: "blue",
      pinned: false, archived: false, trashed: false,
      labels: [],
      createdAt: now - 1000, updatedAt: now - 1000,
    },
  ];
};

function load(userEmail: string): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const storageKey = getStorageKey(userEmail);
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      const s = seed();
      localStorage.setItem(storageKey, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw);
  } catch { return []; }
}

function save(userEmail: string, notes: Note[]) {
  localStorage.setItem(getStorageKey(userEmail), JSON.stringify(notes));
}

function loadSettings(userEmail: string): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(getSettingsKey(userEmail));
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { return DEFAULT_SETTINGS; }
}

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    if (!user?.email) return;
    setSettings(loadSettings(user.email));
    setReady(true);
  }, [user?.email]);
  
  const update = useCallback((patch: Partial<Settings>) => {
    if (!user?.email) return;
    setSettings(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem(getSettingsKey(user.email), JSON.stringify(next));
      return next;
    });
  }, [user?.email]);
  
  return { settings, ready, update };
}

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    setNotes(load(user.email));
    setReady(true);
  }, [user?.email]);

  useEffect(() => {
    if (!ready || !user?.email) return;
    save(user.email, notes);
  }, [notes, ready, user?.email]);

  // Auto-empty trash
  useEffect(() => {
    if (!ready || !user?.email) return;
    const settings = loadSettings(user.email);
    if (settings.autoEmptyDays <= 0) return;
    const cutoff = Date.now() - settings.autoEmptyDays * 86400000;
    setNotes(prev => {
      const filtered = prev.filter(n => !(n.trashed && (n.trashedAt ?? n.updatedAt) < cutoff));
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [ready, user?.email]);

  const addNote = useCallback((n: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    const note: Note = { ...n, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    setNotes(prev => [note, ...prev]);
    return note;
  }, []);

  const updateNote = useCallback((id: string, patch: Partial<Note>) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== id) return n;
      const next = { ...n, ...patch, updatedAt: Date.now() };
      if (patch.trashed && !n.trashed) next.trashedAt = Date.now();
      return next;
    }));
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notes, ready, addNote, updateNote, removeNote };
}

export const NOTE_COLORS: { key: NoteColor; label: string; cssVar: string }[] = [
  { key: "default", label: "Default", cssVar: "var(--note-default)" },
  { key: "red", label: "Coral", cssVar: "var(--note-red)" },
  { key: "orange", label: "Peach", cssVar: "var(--note-orange)" },
  { key: "yellow", label: "Sand", cssVar: "var(--note-yellow)" },
  { key: "green", label: "Sage", cssVar: "var(--note-green)" },
  { key: "teal", label: "Mist", cssVar: "var(--note-teal)" },
  { key: "blue", label: "Fog", cssVar: "var(--note-blue)" },
  { key: "darkblue", label: "Storm", cssVar: "var(--note-darkblue)" },
  { key: "purple", label: "Dusk", cssVar: "var(--note-purple)" },
  { key: "pink", label: "Blossom", cssVar: "var(--note-pink)" },
  { key: "brown", label: "Clay", cssVar: "var(--note-brown)" },
  { key: "gray", label: "Chalk", cssVar: "var(--note-gray)" },
];

export const colorVar = (color: NoteColor): string => {
  const vars: Record<NoteColor, string> = {
    default: "var(--note-default)",
    red: "var(--note-red)",
    orange: "var(--note-orange)",
    yellow: "var(--note-yellow)",
    green: "var(--note-green)",
    teal: "var(--note-teal)",
    blue: "var(--note-blue)",
    darkblue: "var(--note-darkblue)",
    purple: "var(--note-purple)",
    pink: "var(--note-pink)",
    brown: "var(--note-brown)",
    gray: "var(--note-gray)",
  };
  return vars[color] || vars.default;
};