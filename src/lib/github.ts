// Minimal GitHub Contents API client.
//
// Admin changes are committed straight to the repo (projects.json and files
// under public/screenshots/). Vercel auto-deploys every push, so changes go
// live about a minute after saving. The admin UI reads the latest committed
// state through this same API, so it always shows what's coming, even while a
// redeploy is still running.

const GH_API = "https://api.github.com";
const BRANCH = "main";

function repo(): string {
  const repo = process.env.GITHUB_REPO;
  if (!repo) throw new Error("GITHUB_REPO env var is not set");
  return repo;
}

function headers(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN env var is not set");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export interface RepoFile {
  content: string; // decoded utf-8
  sha: string;
}

export async function getRepoFile(path: string): Promise<RepoFile | null> {
  const res = await fetch(
    `${GH_API}/repos/${repo()}/contents/${path}?ref=${BRANCH}`,
    { headers: headers(), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub read failed for ${path}: ${res.status}`);
  }
  const json = await res.json();
  return {
    content: Buffer.from(json.content, "base64").toString("utf8"),
    sha: json.sha,
  };
}

export async function putRepoFile(
  path: string,
  content: string | Buffer,
  message: string,
  sha?: string
): Promise<void> {
  const body: Record<string, unknown> = {
    message,
    branch: BRANCH,
    content: Buffer.isBuffer(content)
      ? content.toString("base64")
      : Buffer.from(content, "utf8").toString("base64"),
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GH_API}/repos/${repo()}/contents/${path}`,
    {
      method: "PUT",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    throw new Error(
      `GitHub write failed for ${path}: ${res.status} ${await res.text()}`
    );
  }
}

export async function deleteRepoFile(
  path: string,
  message: string,
  sha: string
): Promise<void> {
  const res = await fetch(
    `${GH_API}/repos/${repo()}/contents/${path}`,
    {
      method: "DELETE",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ message, sha, branch: BRANCH }),
    }
  );
  if (!res.ok) {
    throw new Error(
      `GitHub delete failed for ${path}: ${res.status} ${await res.text()}`
    );
  }
}
