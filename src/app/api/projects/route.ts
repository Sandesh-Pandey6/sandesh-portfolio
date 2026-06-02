import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  readProjectsFile,
  validateProjectsFile,
  writeProjectsFile,
} from "@/lib/projectsStore";
import type { ProjectsFile } from "@/types/project";

export async function GET() {
  const file = await readProjectsFile();
  return NextResponse.json(file);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data: ProjectsFile;
  try {
    data = (await request.json()) as ProjectsFile;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const error = validateProjectsFile(data);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    await writeProjectsFile(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not save projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/projects");
  for (const p of data.projects) {
    revalidatePath(`/projects/${p.slug}`);
  }

  return NextResponse.json({ ok: true });
}
