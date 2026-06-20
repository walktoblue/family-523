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

function avatarEmoji(m: Member) {
  const age = m.birthYear ? new Date().getFullYear() - m.birthYear : 30;
  if (m.gender === "male") return age > 60 ? "👴" : age > 30 ? "👨" : "👦";
  return age > 60 ? "👵" : age > 30 ? "👩" : "👧";
}

export default function MemberPage() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [spouse, setSpouse] = useState<Member | null>(null);
  const [children, setChildren] = useState<Member[]>([]);
  const [parents, setParents] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then(({ members }: { members: Member[] }) => {
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
      <main className="min-h-[60vh] flex items-center justify-center">
        <p style={{ color: "var(--on-surface-variant)" }}>불러오는 중…</p>
      </main>
    );
  }

  const age = member.birthYear ? new Date().getFullYear() - member.birthYear + 1 : null;
  const interests = member.interests ? member.interests.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const interestColors = [
    { bg: "var(--tertiary-container)", text: "#fff" },
    { bg: "var(--secondary-container)", text: "var(--on-secondary-container)" },
    { bg: "var(--primary-fixed)", text: "var(--primary)" },
    { bg: "var(--surface-container-highest)", text: "var(--on-surface-variant)" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm transition-colors" style={{ color: "var(--on-surface-variant)" }}>
        <span className="material-symbols-outlined text-base">arrow_back</span>
        돌아가기
      </Link>

      {/* Profile header */}
      <section
        className="rounded-2xl p-8 album-shadow text-center"
        style={{ background: "var(--surface-container-lowest)" }}
      >
        <div className="relative inline-block mb-4">
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 shadow-md" style={{ borderColor: "var(--surface)" }} />
          ) : (
            <div
              className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-6xl border-4 shadow-md"
              style={{ background: "var(--primary-container)", borderColor: "var(--surface)" }}
            >
              {avatarEmoji(member)}
            </div>
          )}
        </div>

        <h1 className="serif text-3xl font-bold mb-2" style={{ color: "var(--primary)" }}>
          {member.name}
        </h1>
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}>
            {member.role}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: "var(--surface-container-high)", color: "var(--on-surface-variant)" }}>
            {SIDE_LABEL[member.side] ?? member.side}
          </span>
        </div>

        <div className="flex justify-center flex-wrap gap-3">
          {age && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ background: "var(--surface-container-low)", borderColor: "rgba(215,195,179,0.3)" }}>
              <span className="material-symbols-outlined text-lg" style={{ color: "var(--primary)" }}>calendar_today</span>
              <span className="text-sm font-medium">{member.birthYear}년생 ({age}세)</span>
            </div>
          )}
          {member.occupation && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ background: "var(--surface-container-low)", borderColor: "rgba(215,195,179,0.3)" }}>
              <span className="material-symbols-outlined text-lg" style={{ color: "var(--primary)" }}>work</span>
              <span className="text-sm font-medium">{member.occupation}</span>
            </div>
          )}
        </div>
      </section>

      {/* Biography */}
      {member.description && (
        <section className="rounded-2xl p-7 album-shadow" style={{ background: "var(--surface-container-lowest)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>history_edu</span>
            <h3 className="serif text-xl font-semibold">소개</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
            {member.description}
          </p>
        </section>
      )}

      {/* Interests */}
      {interests.length > 0 && (
        <section className="rounded-2xl p-7 album-shadow" style={{ background: "var(--surface-container-lowest)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>favorite</span>
            <h3 className="serif text-xl font-semibold">관심사</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {interests.map((item, i) => (
              <span
                key={item}
                className="px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-transform cursor-default"
                style={{
                  background: interestColors[i % interestColors.length].bg,
                  color: interestColors[i % interestColors.length].text,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Family connections */}
      <section className="rounded-2xl p-7 album-shadow" style={{ background: "var(--surface-container-lowest)" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>account_tree</span>
          <h3 className="serif text-xl font-semibold">가족 관계</h3>
        </div>
        <div className="space-y-5">
          {parents.length > 0 && (
            <div>
              <h4 className="text-xs font-bold mb-2 tracking-wider flex items-center gap-1" style={{ color: "var(--outline)" }}>
                부모 <span className="opacity-50 font-normal">Parents</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {parents.map((p) => (
                  <Link key={p.id} href={`/member/${p.id}`}>
                    <span className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm hover:bg-[var(--surface-container-high)] transition-all group" style={{ background: "var(--surface-container)", borderColor: "var(--outline-variant)" }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: "var(--primary)" }} />
                      {p.name} ({p.gender === "male" ? "부" : "모"})
                      <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {spouse && (
            <div>
              <h4 className="text-xs font-bold mb-2 tracking-wider flex items-center gap-1" style={{ color: "var(--outline)" }}>
                배우자 <span className="opacity-50 font-normal">Spouse</span>
              </h4>
              <Link href={`/member/${spouse.id}`}>
                <span className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm w-fit hover:opacity-80 transition-all group" style={{ background: "rgba(55,104,71,0.1)", borderColor: "rgba(55,104,71,0.3)", color: "var(--secondary)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "var(--secondary)" }} />
                  {spouse.name}
                  <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                </span>
              </Link>
            </div>
          )}

          {children.length > 0 && (
            <div>
              <h4 className="text-xs font-bold mb-2 tracking-wider flex items-center gap-1" style={{ color: "var(--outline)" }}>
                자녀 <span className="opacity-50 font-normal">Children</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {children.map((c) => (
                  <Link key={c.id} href={`/member/${c.id}`}>
                    <span className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm hover:opacity-80 transition-all group" style={{ background: "rgba(130,80,36,0.08)", borderColor: "rgba(130,80,36,0.2)", color: "var(--tertiary)" }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: "var(--tertiary)" }} />
                      {c.name}
                      <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Relationship CTA */}
      <div className="rounded-2xl p-5" style={{ background: "var(--primary-fixed)", borderColor: "var(--outline-variant)" }}>
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--primary)" }}>
          {member.name}과(와) 나의 관계 알아보기
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-bold"
          style={{ background: "var(--primary-btn)" }}
        >
          홈에서 확인하기
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </main>
  );
}
