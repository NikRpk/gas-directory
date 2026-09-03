import { NextResponse } from "next/server";
import { loadProjects, saveProjects } from "@/lib/projects-admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Update a project (toggle enabled, edit fields). */
export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const { projects, sha } = await loadProjects();

    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = { ...projects[idx], ...body, id }; // id is immutable
    projects[idx] = updated;

    await saveProjects(projects, sha, `Admin: update project ${id}`);
    return NextResponse.json({ ok: true, project: updated });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** Remove a project entirely. */
export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const { projects, sha } = await loadProjects();

    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length === projects.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await saveProjects(filtered, sha, `Admin: remove project ${id}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
