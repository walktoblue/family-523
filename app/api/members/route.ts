import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { Member } from "@/lib/types";

function toMember(row: Record<string, unknown>): Member {
  return {
    id: row.id as string,
    name: row.name as string,
    gender: row.gender as "male" | "female",
    side: row.side as Member["side"],
    role: (row.role as string) || "",
    birthYear: row.birth_year as number | undefined,
    occupation: (row.occupation as string) || "",
    interests: (row.interests as string) || "",
    description: (row.description as string) || "",
    photoUrl: (row.photo_url as string) || "",
    parentIds: (row.parent_ids as string[]) || [],
    spouseId: (row.spouse_id as string) || "",
  };
}

function toRow(m: Member) {
  return {
    id: m.id,
    name: m.name,
    gender: m.gender,
    side: m.side,
    role: m.role || "",
    birth_year: m.birthYear || null,
    occupation: m.occupation || "",
    interests: m.interests || "",
    description: m.description || "",
    photo_url: m.photoUrl || "",
    parent_ids: m.parentIds || [],
    spouse_id: m.spouseId || "",
  };
}

export async function GET() {
  const { data, error } = await supabase
    .from("family_members")
    .select("*")
    .order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ members: (data ?? []).map(toMember) });
}

export async function POST(req: Request) {
  const body: Member = await req.json();
  const { error } = await supabaseAdmin.from("family_members").insert(toRow(body));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const body: Member = await req.json();
  const { error } = await supabaseAdmin
    .from("family_members")
    .update(toRow(body))
    .eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("family_members").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
