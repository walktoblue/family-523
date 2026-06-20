import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { calculateRelationship } from "@/lib/relationship";
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  const { data, error } = await supabase.from("family_members").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const members: Member[] = (data ?? []).map(toMember);
  const result = calculateRelationship(members, from, to);
  const toMemberObj = members.find((m) => m.name === to) ?? null;

  return NextResponse.json({ result, toMember: toMemberObj });
}
