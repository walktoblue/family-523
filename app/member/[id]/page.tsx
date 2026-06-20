"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Member } from "@/lib/types";

const SIDE_LABEL: Record<string, string> = {
  paternal: "친가",
  maternal: "외가",
  both: "친가 & 외가",
  paternal_in: "친가 (혼인)",
  maternal_in: "외가 (혼인)",
};

export default function MemberPage() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [spouse, setSpouse] = useState<Member | null>(null);
  const [children, setChildren] = useState<Member[]>([]);
  const [parents, setParents] = useState<Member[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then(({ members }: { members: Member[] }) => {
        setAllMembers(members);
        const m = members.find((x) => x.id === id) ?? null;
        setMember(m);
        if (m) {
          setSpouse(members.find((x) => x.id === m.spouseId) ?? null);
          setParents(members.filter((x) => m.parentIds.includes(x.id)));
          setChildren(members.filter((x) => x.parentIds.includes(m.id)));
        }
      });
  }, [id]);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <p style={{ color: "var(--text-muted)" }}>불러오는 중…</p>
      </div>
    );
  }

  const age = member.birthYear ? new Date().getFullYear() - member.birthYear + 1 : null;

  return (
    <main className="min-h-screen px-4 py-10" style={{ background: "var(--background)" }}>
      <div className="max-w-lg mx-auto">
        {/* Back */}
        <Link href="/" className="inline-block mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
          ← 돌아가기
        </Link>

        {/* Profile header */}
        <div className="rounded-2xl p-6 mb-4 text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="mb-3">
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover shadow-md"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-5xl shadow-md"
                style={{ background: "var(--primary-light)" }}
              >
                {member.gender === "male" ? "👨" : "👩"}
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-noto-serif)" }}>
            {member.name}
          </h1>
          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
            {member.role} · {SIDE_LABEL[member.side] ?? member.side}
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            {age && (
              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                {member.birthYear}년생 ({age}세)
              </span>
            )}
            {member.occupation && (
              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "#e8f5e9", color: "#2e7d32" }}>
                {member.occupation}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {member.description && (
          <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h2 className="font-bold mb-2 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-noto-serif)" }}>소개</h2>
            <p className="text-sm leading-relaxed">{member.description}</p>
          </div>
        )}

        {/* Interests */}
        {member.interests && (
          <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h2 className="font-bold mb-2 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-noto-serif)" }}>관심사</h2>
            <div className="flex flex-wrap gap-2">
              {member.interests.split(",").map((i, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                  {i.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Family connections */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h2 className="font-bold mb-3 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-noto-serif)" }}>가족 관계</h2>

          {parents.length > 0 && (
            <div className="mb-3">
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>부모</p>
              <div className="flex gap-2 flex-wrap">
                {parents.map((p) => (
                  <Link key={p.id} href={`/member/${p.id}`}>
                    <span className="px-3 py-1 rounded-full text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                      {p.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {spouse && (
            <div className="mb-3">
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>배우자</p>
              <Link href={`/member/${spouse.id}`}>
                <span className="px-3 py-1 rounded-full text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "#fce4ec", color: "#c62828" }}>
                  {spouse.name}
                </span>
              </Link>
            </div>
          )}

          {children.length > 0 && (
            <div>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>자녀</p>
              <div className="flex gap-2 flex-wrap">
                {children.map((c) => (
                  <Link key={c.id} href={`/member/${c.id}`}>
                    <span className="px-3 py-1 rounded-full text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "#e8f5e9", color: "#2e7d32" }}>
                      {c.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Relationship checker shortcut */}
        <div className="rounded-2xl p-5" style={{ background: "var(--primary-light)", border: "1px solid var(--border)" }}>
          <p className="text-sm font-medium mb-2" style={{ color: "var(--primary)" }}>
            {member.name}과(와) 나의 관계 알아보기
          </p>
          <Link
            href={`/?other=${encodeURIComponent(member.name)}`}
            className="inline-block text-sm px-4 py-2 rounded-xl text-white font-semibold"
            style={{ background: "var(--primary)" }}
          >
            관계 확인하기 →
          </Link>
        </div>
      </div>
    </main>
  );
}
