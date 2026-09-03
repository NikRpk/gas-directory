"use client";

import { useMemo, useState } from "react";
import { enabledProjects, categories, type Category, type Project } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

const categoryColors: Record<Category, string> = {
  Marketing: "bg-tertiary-container text-on-tertiary-container",
  Productivity: "bg-primary-container text-on-primary-container",
  "Data & Reporting": "bg-secondary-container text-on-secondary-container",
  "Web App": "bg-primary-container text-on-primary-container",
  "Alerts & Notifications": "bg-tertiary-container text-on-tertiary-container",
  Utilities: "bg-secondary-container text-on-secondary-container",
  Operations: "bg-surface-container-high text-on-surface",
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enabledProjects.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.features.some((f) => f.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <section className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
          Google Apps Script Directory
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight text-on-surface sm:text-5xl">
          Google Apps Scripts
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
          A growing collection of Google Apps Script projects — from Amazon Ads
          campaign builders to calendar audits, Slack alerts and data pipelines.
          Explore, install, and drop in screenshots for each one.
        </p>
      </section>

      <section className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scripts..."
              className="h-14 w-full rounded-full border border-outline-variant bg-surface-container-low pl-12 pr-4 text-base text-on-surface outline-none transition placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span className="font-medium">{filtered.length}</span>
            <span>{filtered.length === 1 ? "script" : "scripts"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            active={activeCategory === "All"}
            onClick={() => setActiveCategory("All")}
          />
          {categories.map((c) => (
            <FilterChip
              key={c}
              label={c}
              active={activeCategory === c}
              onClick={() => setActiveCategory(c)}
            />
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <span className="text-5xl">🔍</span>
          <p className="text-lg font-medium text-on-surface">No scripts found</p>
          <p className="text-sm text-on-surface-variant">
            Try a different search term or category.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} color={categoryColors[p.category]} />
          ))}
        </section>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-8 rounded-full px-3 text-sm transition ${
        active
          ? "bg-secondary-container font-medium text-on-secondary-container"
          : "border border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container-high"
      }`}
    >
      {label}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
    </svg>
  );
}
