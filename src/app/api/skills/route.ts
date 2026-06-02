import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  readSkillsFile,
  validateSkillsFile,
  writeSkillsFile,
} from "@/lib/skillsStore";
import type { SkillsFile } from "@/types/skills";

export async function GET() {
  const file = await readSkillsFile();
  return NextResponse.json(file);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data: SkillsFile;
  try {
    data = (await request.json()) as SkillsFile;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const error = validateSkillsFile(data);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    await writeSkillsFile(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not save skills";
    const onVercel = Boolean(process.env.VERCEL);
    return NextResponse.json(
      {
        error: onVercel
          ? `${message}. On Vercel, add BLOB_READ_WRITE_TOKEN or save locally.`
          : message,
      },
      { status: 500 }
    );
  }

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
