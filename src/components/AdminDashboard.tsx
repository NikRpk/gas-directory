"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  categories,
  installTypes,
  type Project,
} from "@/data/projects";
import { createClient } from "@/lib/supabase/client";

const installTypeLabels: Record<string, string> = {
  "web-app": "Web App",
  "sheet-addon": "Sheets Add-on",
  "sheet-bound": "Sheet-bound Script",
  standalone: "Standalone Script",
  collection: "Script Collection",
};

export default function AdminDashboard({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const router = useRouter();

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 6000);
  }

  async function refresh() {
    const res = await fetch("/api/admin/projects");
    if (res.ok) {
      const data = await res.json();
      setProjects(data.projects);
    }
    router.refresh();
  }

  async function call(
    key: string,
    fn: () => Promise<Response>,
    successMsg: string
  ) {
    setBusy(key);
    try {
      const res = await fn();
      if (res.ok) {
        flash(`${successMsg} — publishing, live in ~1 min.`);
        await refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        flash(`Error: ${data.error || res.statusText}`);
      }
    } catch (e) {
      flash(`Error: ${String(e)}`);
    } finally {
      setBusy(null);
    }
  }

  const toggle = (p: Project) =>
    call(
      `toggle-${p.id}`,
      () =>
        fetch(`/api/admin/projects/${p.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: !p.enabled }),
        }),
      `${p.name} ${p.enabled ? "hidden" : "shown"}`
    );

  const remove = (p: Project) => {
    if (!window.confirm(`Delete "${p.name}" permanently?`)) return;
    call(
      `delete-${p.id}`,
      () => fetch(`/api/admin/projects/${p.id}`, { method: "DELETE" }),
      `${p.name} deleted`
    );
  };

  async function logout() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h1 className="font-display text-3xl font-medium text-on-surface">
          Admin
        </h1>
        <span className="text-sm text-on-surface-variant">
          {projects.filter((p) => p.enabled).length} shown ·{" "}
          {projects.filter((p) => !p.enabled).length} hidden
        </span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="h-10 rounded-full bg-primary px-5 text-sm font-medium text-on-primary shadow-1 transition hover:bg-primary/90"
          >
            + Add project
          </button>
          <button
            onClick={logout}
            className="h-10 rounded-full border border-outline-variant px-5 text-sm text-on-surface-variant transition hover:bg-surface-container-high"
          >
            Log out
          </button>
        </div>
      </div>

      {notice && (
        <div className="mb-4 rounded-xl bg-secondary-container px-4 py-3 text-sm text-on-secondary-container">
          {notice}
        </div>
      )}

      <p className="mb-6 rounded-xl bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
        Changes are committed to GitHub and auto-deploy — they go live in about
        a minute.
      </p>

      {showAdd && (
        <AddProjectForm
          onDone={() => {
            setShowAdd(false);
            refresh();
          }}
          onCancel={() => setShowAdd(false)}
          flash={flash}
        />
      )}

      <div className="flex flex-col gap-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl bg-surface-container p-5 shadow-1 ${
              p.enabled ? "" : "opacity-60"
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-on-surface">{p.name}</p>
                <p className="truncate text-sm text-on-surface-variant">
                  {p.tagline}
                </p>
              </div>
              <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-xs text-on-surface-variant">
                {p.category}
              </span>
              <span className="text-xs text-on-surface-variant">
                {p.screenshots.length} 📷
              </span>
              <button
                onClick={() => toggle(p)}
                disabled={busy !== null}
                className={`h-9 rounded-full px-4 text-sm font-medium transition disabled:opacity-50 ${
                  p.enabled
                    ? "bg-secondary-container text-on-secondary-container"
                    : "border border-outline-variant text-on-surface-variant"
                }`}
              >
                {busy === `toggle-${p.id}`
                  ? "…"
                  : p.enabled
                    ? "Shown"
                    : "Hidden"}
              </button>
              <button
                onClick={() =>
                  setExpanded(expanded === p.id ? null : p.id)
                }
                className="h-9 rounded-full border border-outline-variant px-4 text-sm text-on-surface-variant transition hover:bg-surface-container-high"
              >
                {expanded === p.id ? "Close" : "Screenshots"}
              </button>
              <Link
                href={`/projects/${p.id}`}
                className="h-9 rounded-full border border-outline-variant px-4 py-1.5 text-sm text-primary transition hover:bg-primary-container"
              >
                View
              </Link>
              <button
                onClick={() => remove(p)}
                disabled={busy !== null}
                className="h-9 rounded-full px-4 text-sm font-medium text-error transition hover:bg-error-container disabled:opacity-50"
              >
                {busy === `delete-${p.id}` ? "…" : "Delete"}
              </button>
            </div>

            {expanded === p.id && (
              <ScreenshotManager
                project={p}
                busy={busy}
                call={call}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenshotManager({
  project,
  busy,
  call,
}: {
  project: Project;
  busy: string | null;
  call: (
    key: string,
    fn: () => Promise<Response>,
    successMsg: string
  ) => Promise<void>;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

  const upload = (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    call(
      `upload-${project.id}`,
      () =>
        fetch(`/api/admin/projects/${project.id}/screenshots`, {
          method: "POST",
          body: fd,
        }),
      "Screenshot uploaded"
    );
  };

  const removeShot = (path: string) =>
    call(
      `delshot-${project.id}`,
      () =>
        fetch(
          `/api/admin/projects/${project.id}/screenshots?path=${encodeURIComponent(path)}`,
          { method: "DELETE" }
        ),
      "Screenshot removed"
    );

  return (
    <div className="mt-4 border-t border-outline-variant pt-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-on-surface">Screenshots</p>
        <button
          onClick={() => fileInput.current?.click()}
          disabled={busy !== null}
          className="h-9 rounded-full bg-primary px-4 text-sm font-medium text-on-primary transition hover:bg-primary/90 disabled:opacity-50"
        >
          {busy === `upload-${project.id}` ? "Uploading…" : "Upload image"}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </div>

      {project.screenshots.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          No screenshots yet. Upload one to show it on the project page.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {project.screenshots.map((src) => (
            <div key={src} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="screenshot"
                className="aspect-video w-full rounded-lg border border-outline-variant object-cover"
              />
              <button
                onClick={() => removeShot(src)}
                disabled={busy !== null}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-error text-xs text-on-error opacity-0 transition group-hover:opacity-100 disabled:opacity-50"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddProjectForm({
  onDone,
  onCancel,
  flash,
}: {
  onDone: () => void;
  onCancel: () => void;
  flash: (msg: string) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    category: "Utilities",
    githubUrl: "",
    installNotes: "",
    installType: "sheet-bound",
    features: "",
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        category: form.category,
        githubUrl: form.githubUrl || null,
        installNotes: form.installNotes,
        installType: form.installType,
        features: form.features
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    setSaving(false);
    if (res.ok) {
      flash(`"${form.name}" added — publishing, live in ~1 min.`);
      onDone();
    } else {
      const data = await res.json().catch(() => ({}));
      flash(`Error: ${data.error || res.statusText}`);
    }
  }

  const set = (k: string) => (e: { target: { value: string } }) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <form
      onSubmit={submit}
      className="mb-6 flex flex-col gap-4 rounded-2xl bg-surface-container p-6 shadow-1"
    >
      <h2 className="font-display text-lg font-medium text-on-surface">
        Add project
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name *">
          <input required value={form.name} onChange={set("name")} className={inputCls} />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={set("category")} className={inputCls}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Tagline">
        <input value={form.tagline} onChange={set("tagline")} className={inputCls} />
      </Field>
      <Field label="Description">
        <textarea
          value={form.description}
          onChange={set("description")}
          rows={3}
          className={inputCls}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="GitHub URL (optional)">
          <input
            value={form.githubUrl}
            onChange={set("githubUrl")}
            placeholder="https://github.com/…"
            className={inputCls}
          />
        </Field>
        <Field label="Install type">
          <select
            value={form.installType}
            onChange={set("installType")}
            className={inputCls}
          >
            {installTypes.map((t) => (
              <option key={t} value={t}>
                {installTypeLabels[t]}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Install notes">
        <textarea
          value={form.installNotes}
          onChange={set("installNotes")}
          rows={2}
          className={inputCls}
        />
      </Field>
      <Field label="Features (one per line)">
        <textarea
          value={form.features}
          onChange={set("features")}
          rows={3}
          className={inputCls}
        />
      </Field>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="h-10 rounded-full bg-primary px-5 text-sm font-medium text-on-primary shadow-1 transition hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Add project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-full border border-outline-variant px-5 text-sm text-on-surface-variant transition hover:bg-surface-container-high"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}
