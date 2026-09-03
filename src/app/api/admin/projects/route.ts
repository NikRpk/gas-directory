import { NextResponse } from "next/server";
import { loadProjects, saveProjects, slugify } from "@/lib/projects-admin";
import type { Project } from "@/data/projects";

export const dynamic = "force-dynamic";

/** List all projects (latest committed state from GitHub). */
export async function GET() {
  try {
    const { projects } = await loadProjects();
    return NextResponse.json({ projects });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** Add a new project. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projects, sha } = await loadProjects();

    const id = slugify(body.id || body.name || "");
    if (!id) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (projects.some((p) => p.id === id)) {
      return NextResponse.json(
        { error: `A project with id "${id}" already exists` },
        { status: 409 }
      );
    }

    const project: Project = {
      id,
      enabled: body.enabled ?? true,
      name: body.name ?? id,
      tagline: body.tagline ?? "",
      description: body.description ?? "",
      features: Array.isArray(body.features) ? body.features : [],
      category: body.category ?? "Utilities",
      githubUrl: body.githubUrl || null,
      installNotes: body.installNotes ?? "",
      installType: body.installType ?? "sheet-bound",
      hasWebApp: body.hasWebApp ?? false,
      screenshots: [],
      ...(body.internal ? { internal: true } : {}),
    };

    await saveProjects([...projects, project], sha, `Admin: add project ${id}`);
    return NextResponse.json({ ok: true, project });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
