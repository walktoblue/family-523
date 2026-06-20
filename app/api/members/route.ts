import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "members.json");

function readData() {
  return JSON.parse(readFileSync(dataPath, "utf-8"));
}

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = readData();
  data.members.push(body);
  writeFileSync(dataPath, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const data = readData();
  data.members = data.members.map((m: { id: string }) =>
    m.id === body.id ? body : m
  );
  writeFileSync(dataPath, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const data = readData();
  data.members = data.members.filter((m: { id: string }) => m.id !== id);
  writeFileSync(dataPath, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true });
}
