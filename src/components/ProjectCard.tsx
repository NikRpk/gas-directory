import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({
  project,
  color,
}: {
  project: Project;
  color: string;
}) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col gap-4 rounded-2xl bg-surface-container p-5 shadow-1 transition hover:shadow-2"
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
        >
          {project.category}
        </span>
        {project.screenshots.length > 0 && (
          <span className="text-xs text-on-surface-variant">
            {project.screenshots.length} 📷
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-xl font-medium text-on-surface">
          {project.name}
        </h2>
        <p className="line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
          {project.tagline}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-3 text-sm">
        {project.githubUrl ? (
          <span className="inline-flex items-center gap-1 text-primary">
            <GitHubIcon />
            GitHub
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-on-surface-variant">
            <LockIcon />
            Internal
          </span>
        )}
        <span className="ml-auto text-primary opacity-0 transition group-hover:opacity-100">
          View →
        </span>
      </div>
    </Link>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
