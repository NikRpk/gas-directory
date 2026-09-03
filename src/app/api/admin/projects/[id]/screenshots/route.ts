import { NextResponse } from "next/server";
import { loadProjects, saveProjects } from "@/lib/projects-admin";
import { deleteRepoFile, getRepoFile, putRepoFile } from "@/lib/github";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

/** Upload a screenshot for a project. */
export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Only png, jpg, gif or webp images are allowed" },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image must be under 5 MB" },
        { status: 400 }
      );
    }

    const baseName =
      (file.name || "screenshot")
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "screenshot";
    const filename = `${baseName}-${Date.now().toString(36)}${ext}`;
    const repoPath = `public/screenshots/${id}/${filename}`;
    const publicPath = `/screenshots/${id}/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await putRepoFile(repoPath, buffer, `Admin: add screenshot for ${id}`);

    const { projects, sha } = await loadProjects();
    const project = projects.find((p) => p.id === id);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    project.screenshots = [...(project.screenshots || []), publicPath];
    await saveProjects(projects, sha, `Admin: link screenshot for ${id}`);

    return NextResponse.json({ ok: true, path: publicPath });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** Remove a screenshot from a project. */
export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const path = new URL(req.url).searchParams.get("path") || "";

    // Only allow paths inside this project's screenshots folder.
    const prefix = `/screenshots/${id}/`;
    if (!path.startsWith(prefix) || path.includes("..")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const repoPath = `public${path}`;
    const existing = await getRepoFile(repoPath);
    if (existing) {
      await deleteRepoFile(repoPath, `Admin: remove screenshot for ${id}`, existing.sha);
    }

    const { projects, sha } = await loadProjects();
    const project = projects.find((p) => p.id === id);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    project.screenshots = (project.screenshots || []).filter((s) => s !== path);
    await saveProjects(projects, sha, `Admin: unlink screenshot for ${id}`);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
