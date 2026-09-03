import { getRepoFile, putRepoFile } from "@/lib/github";
import type { Project } from "@/data/projects";

export const PROJECTS_PATH = "src/data/projects.json";

export interface ProjectsData {
  projects: Project[];
  sha: string;
}

/** Read the latest committed projects.json from GitHub. */
export async function loadProjects(): Promise<ProjectsData> {
  const file = await getRepoFile(PROJECTS_PATH);
  if (!file) throw new Error("projects.json not found in repo");
  return { projects: JSON.parse(file.content), sha: file.sha };
}

/** Commit an updated projects.json back to the repo. */
export async function saveProjects(
  projects: Project[],
  sha: string,
  message: string
): Promise<void> {
  await putRepoFile(
    PROJECTS_PATH,
    JSON.stringify(projects, null, 2) + "\n",
    message,
    sha
  );
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
