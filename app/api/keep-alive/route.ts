import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Hit once a day by Vercel Cron (see vercel.json) so the free Supabase
// project never sits idle long enough to auto-pause.
export async function GET() {
  const supabase = createClient();
  await supabase.from("profile").select("id").eq("id", 1).single();
  return NextResponse.json({ ok: true, pinged: new Date().toISOString() });
}
