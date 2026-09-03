import data from "./projects.json";

// ============================================================================
// PROJECT DATA
//
// The data lives in projects.json (this folder). You can edit it by hand and
// push, or use the admin UI at /admin (login required) to add/remove/toggle
// projects and upload screenshots — admin changes are committed back to the
// repo automatically and go live in about a minute.
//
// Each project has an `enabled` flag: true = shown, false = hidden.
// ============================================================================

export type Category =
  | "Marketing"
  | "Productivity"
  | "Data & Reporting"
  | "Web App"
  | "Alerts & Notifications"
  | "Utilities"
  | "Operations";

export type InstallType =
  | "web-app"
  | "sheet-addon"
  | "sheet-bound"
  | "standalone"
  | "collection";

export interface Project {
  id: string;
  enabled: boolean;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  category: Category;
  githubUrl: string | null;
  installNotes: string;
  installType: InstallType;
  hasWebApp: boolean;
  screenshots: string[];
  lastPush?: string;
  internal?: boolean;
}

export const categories: Category[] = [
  "Marketing",
  "Productivity",
  "Data & Reporting",
  "Web App",
  "Alerts & Notifications",
  "Utilities",
  "Operations",
];

export const installTypes: InstallType[] = [
  "web-app",
  "sheet-addon",
  "sheet-bound",
  "standalone",
  "collection",
];

export const projects: Project[] = data as unknown as Project[];

export const enabledProjects: Project[] = projects.filter((p) => p.enabled);
