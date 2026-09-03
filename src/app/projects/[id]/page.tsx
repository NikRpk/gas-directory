import Link from "next/link";
import { notFound } from "next/navigation";
import { enabledProjects, type Project } from "@/data/projects";

export function generateStaticParams() {
  return enabledProjects.map((p) => ({ id: p.id }));
}

export const dynamic = "force-static";

const installTypeLabels: { [k: string]: string } = {
  "web-app": "Web App",
  "sheet-addon": "Sheets Add-on",
  "sheet-bound": "Sheet-bound Script",
  standalone: "Standalone Script",
  collection: "Script Collection",
};

const categoryColors: Record<string, string> = {
  Marketing: "bg-tertiary-container text-on-tertiary-container",
  Productivity: "bg-primary-container text-on-primary-container",
  "Data & Reporting": "bg-secondary-container text-on-secondary-container",
  "Web App": "bg-primary-container text-on-primary-container",
  "Alerts & Notifications": "bg-tertiary-container text-on-tertiary-container",
  Utilities: "bg-secondary-container text-on-secondary-container",
  Operations: "bg-surface-container-high text-on-surface",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = enabledProjects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-primary transition hover:bg-primary-container"
      >
        ← Back to directory
      </Link>

      <div className="mb-8 flex flex-col gap-6 rounded-2xl bg-surface-container p-6 shadow-1 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${categoryColors[project.category]}`}
          >
            {project.category}
          </span>
          <span className="inline-flex rounded-full border border-outline-variant px-2.5 py-1 text-xs font-medium text-on-surface-variant">
            {installTypeLabels[project.installType]}
          </span>
          {project.internal && (
            <span className="inline-flex rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-medium text-on-surface-variant">
              Internal
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl font-medium tracking-tight text-on-surface sm:text-4xl">
          {project.name}
        </h1>
        <p className="text-lg leading-relaxed text-on-surface-variant">
          {project.tagline}
        </p>

        <div className="flex flex-wrap gap-3">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-on-primary shadow-1 transition hover:bg-primary/90"
            >
              <GitHubIcon />
              View on GitHub
            </a>
          ) : (
            <span className="inline-flex h-10 items-center gap-2 rounded-full bg-surface-container-high px-5 text-sm font-medium text-on-surface-variant">
              <LockIcon />
              Not publicly available
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Section title="What it does">
            <p className="leading-relaxed text-on-surface">{project.description}</p>
          </Section>

          {project.features.length > 0 && (
            <Section title="Key features">
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {project.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-on-surface"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Installation">
            <p className="leading-relaxed text-on-surface">{project.installNotes}</p>
            {project.githubUrl && (
              <div className="mt-4 rounded-xl bg-surface-container-low p-4 text-sm">
                <p className="mb-1 font-medium text-on-surface">Source code</p>
                <a
                  href={project.githubUrl}
                  className="break-all text-primary hover:underline"
                >
                  {project.githubUrl}
                </a>
              </div>
            )}
          </Section>
        </div>

        <div className="flex flex-col gap-6">
          <Section title="Screenshots">
            {project.screenshots.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {project.screenshots.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt={`${project.name} screenshot`}
                    className="w-full rounded-xl shadow-1"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-outline-variant p-6 text-center text-sm text-on-surface-variant">
                <span className="text-3xl">🖼️</span>
                <p>No screenshots yet.</p>
                <p className="text-xs">
                  Drop images into{" "}
                  <code className="rounded bg-surface-container-high px-1">
                    public/screenshots/{project.id}/
                  </code>{" "}
                  and add them to the project entry to show them here.
                </p>
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-surface-container p-5 shadow-1 sm:p-6">
      <h2 className="mb-3 font-display text-lg font-medium text-on-surface">
        {title}
      </h2>
      {children}
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.58A12 12 0 0 0 24 12C24 5.37 18.63 0 12 0z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V5a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2v2h-4V5a2 2 0 0 1 2-2z" />
    </svg>
  );
}
