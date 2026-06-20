"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Member } from "@/lib/types";
import FamilyTree from "@/components/FamilyTree";

export default function Home() {
  const [myName, setMyName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [result, setResult] = useState<{
    found: boolean;
    chonsu?: number;
    relationshipName?: string;
    relationshipDesc?: string;
    path?: string[];
    toMember?: Member;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((d) => setMembers(d.members));
  }, []);

  const nameList = members.map((m) => m.name);

  async function handleSearch() {
    if (!myName || !otherName) { setError("두 이름을 모두 입력해 주세요."); return; }
    if (myName === otherName) { setError("같은 이름을 입력했어요."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/relationship?from=${encodeURIComponent(myName)}&to=${encodeURIComponent(otherName)}`);
      const data = await res.json();
      setResult({ ...data.result, toMember: data.toMember });
    } finally { setLoading(false); }
  }

  const avatarEmoji = (m: Member) => {
    if (m.photoUrl) return null;
    const age = m.birthYear ? new Date().getFullYear() - m.birthYear : 30;
    if (m.gender === "male") return age > 60 ? "👴" : age > 30 ? "👨" : "👦";
    return age > 60 ? "👵" : age > 30 ? "👩" : "👧";
  };

  return (
    <main className="max-w-3xl mx-auto px-5 py-12">
      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="text-6xl mb-5 hover:scale-110 transition-transform cursor-default">🌳</div>
        <h1 className="serif text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--on-surface)" }}>
          우리 가족 찾기
        </h1>
        <p className="text-base" style={{ color: "var(--on-surface-variant)" }}>
          이름을 입력하면 어떤 관계인지 알려드려요
        </p>
      </div>

      {/* Search card */}
      <div
        className="max-w-2xl mx-auto mb-16 rounded-2xl p-7 album-shadow border"
        style={{ background: "var(--surface-container-lowest)", borderColor: "rgba(215,195,179,0.3)" }}
      >
        <div className="flex flex-col md:flex-row items-end gap-4 mb-6">
          <div className="w-full">
            <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: "var(--on-surface-variant)" }}>
              내 이름
            </label>
            <input
              list="names-1"
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="김로이"
              className="w-full rounded-xl px-4 py-3 text-base outline-none border-2 transition-all"
              style={{
                background: "var(--surface-container-low)",
                borderColor: myName ? "var(--primary-btn)" : "var(--outline-variant)",
                color: "var(--on-surface)",
              }}
            />
            <datalist id="names-1">{nameList.map((n) => <option key={n} value={n} />)}</datalist>
          </div>

          <button
            onClick={() => { const t = myName; setMyName(otherName); setOtherName(t); setResult(null); }}
            className="flex items-center justify-center p-2 mb-0.5 hover:rotate-180 transition-transform duration-500 rounded-full"
            style={{ color: "var(--primary-container)" }}
            title="이름 바꾸기"
          >
            <span className="material-symbols-outlined text-2xl">swap_vert</span>
          </button>

          <div className="w-full">
            <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: "var(--on-surface-variant)" }}>
              상대방 이름
            </label>
            <input
              list="names-2"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="김진유"
              className="w-full rounded-xl px-4 py-3 text-base outline-none border-2 transition-all"
              style={{
                background: "var(--surface-container-low)",
                borderColor: otherName ? "var(--primary-btn)" : "var(--outline-variant)",
                color: "var(--on-surface)",
              }}
            />
            <datalist id="names-2">{nameList.map((n) => <option key={n} value={n} />)}</datalist>
          </div>
        </div>

        {error && <p className="text-sm mb-3" style={{ color: "var(--error)" }}>{error}</p>}

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          style={{ background: "var(--primary-btn)", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "찾는 중…" : "관계 알아보기"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="max-w-2xl mx-auto mb-16 space-y-8">
          {!result.found ? (
            <div className="text-center p-8 rounded-2xl album-shadow" style={{ background: "var(--surface-container-lowest)" }}>
              <p style={{ color: "var(--on-surface-variant)" }}>
                가족 목록에서 찾을 수 없어요. 이름을 다시 확인해 주세요.
              </p>
            </div>
          ) : (
            <>
              {/* Chonsu + name */}
              <div className="flex flex-col items-center text-center">
                <span
                  className="px-4 py-1 rounded-full text-sm font-semibold mb-4 shadow-sm"
                  style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
                >
                  {result.chonsu === 0 ? "배우자" : `${result.chonsu}촌`}
                </span>
                <h2 className="serif text-3xl font-bold mb-2" style={{ color: "var(--on-surface)" }}>
                  {result.relationshipName}
                </h2>
                <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
                  {result.relationshipDesc}
                </p>
              </div>

              {/* Path */}
              {result.path && result.path.length > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2">
                  {result.path.map((name, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span
                        className="px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm hover:scale-105 transition-transform"
                        style={{
                          background: name === myName || name === otherName
                            ? "var(--primary-container)"
                            : "var(--surface-container-high)",
                          color: name === myName || name === otherName
                            ? "#fff"
                            : "var(--on-surface)",
                        }}
                      >
                        {name}
                      </span>
                      {i < result.path!.length - 1 && (
                        <span className="material-symbols-outlined text-sm" style={{ color: "var(--outline-variant)" }}>
                          arrow_forward
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* Profile CTA */}
              {result.toMember && (
                <div className="text-center">
                  <Link
                    href={`/member/${result.toMember.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold shadow-md hover:shadow-lg transition-all"
                    style={{ background: "var(--secondary)" }}
                  >
                    <span className="material-symbols-outlined text-sm">person</span>
                    {otherName} 프로필 보기
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Family tree */}
      {members.length > 0 && (
        <div>
          <h2
            className="serif text-xl font-bold mb-6 text-center"
            style={{ color: "var(--on-surface-variant)" }}
          >
            우리 가족 가계도
          </h2>
          <FamilyTree members={members} />
          <p className="text-center text-xs mt-4" style={{ color: "var(--outline)" }}>
            이름을 누르면 프로필을 볼 수 있어요
          </p>
        </div>
      )}
    </main>
  );
}
