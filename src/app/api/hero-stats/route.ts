import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  readHeroStatsFile,
  validateHeroStatsFile,
  writeHeroStatsFile,
} from "@/lib/heroStatsStore";
import type { HeroStatsFile } from "@/types/heroStats";

export async function GET() {
  const file = await readHeroStatsFile();
  return NextResponse.json(file);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data: HeroStatsFile;
  try {
    data = (await request.json()) as HeroStatsFile;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const error = validateHeroStatsFile(data);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    await writeHeroStatsFile(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not save hero stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
