import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { calculateRelationship } from "@/lib/relationship";
import { Member } from "@/lib/types";

const dataPath = path.join(process.cwd(), "data", "members.json");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  const { members }: { members: Member[] } = JSON.parse(
    readFileSync(dataPath, "utf-8")
  );

  const result = calculateRelationship(members, from, to);
  const toMember = members.find((m) => m.name === to);

  return NextResponse.json({ result, toMember: toMember ?? null });
}
