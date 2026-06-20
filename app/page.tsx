"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Member } from "@/lib/types";

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
    if (!myName || !otherName) {
      setError("두 이름을 모두 입력해 주세요.");
      return;
    }
    if (myName === otherName) {
      setError("같은 이름을 입력했어요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/relationship?from=${encodeURIComponent(myName)}&to=${encodeURIComponent(otherName)}`
      );
      const data = await res.json();
      setResult({ ...data.result, toMember: data.toMember });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="w-full max-w-lg mb-8 text-center">
        <div className="text-5xl mb-3">🌳</div>
        <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--primary)", fontFamily: "var(--font-noto-serif)" }}>
          우리 가족 찾기
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          이름을 입력하면 어떤 관계인지 알려드려요 · 523 패밀리
        </p>
        <Link
          href="/admin"
          className="inline-block mt-3 text-xs px-3 py-1 rounded-full border"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          관리자 페이지 →
        </Link>
      </div>

      {/* Search card */}
      <div className="w-full max-w-lg rounded-2xl p-6 shadow-sm mb-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>내 이름</label>
            <input
              list="member-list-1"
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="예: 김로이"
              className="w-full rounded-lg px-4 py-3 text-base outline-none"
              style={{ background: "var(--background)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}
            />
            <datalist id="member-list-1">
              {nameList.map((n) => <option key={n} value={n} />)}
            </datalist>
          </div>

          <div className="text-center text-2xl select-none" style={{ color: "var(--primary)" }}>↕</div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>상대방 이름</label>
            <input
              list="member-list-2"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="예: 김진유"
              className="w-full rounded-lg px-4 py-3 text-base outline-none"
              style={{ background: "var(--background)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}
            />
            <datalist id="member-list-2">
              {nameList.map((n) => <option key={n} value={n} />)}
            </datalist>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-base transition-opacity"
            style={{ background: "var(--primary)", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "찾는 중…" : "관계 알아보기"}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="w-full max-w-lg rounded-2xl p-6 shadow-sm mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          {!result.found ? (
            <p className="text-center" style={{ color: "var(--text-muted)" }}>
              가족 목록에서 찾을 수 없어요. 이름을 다시 확인해 주세요.
            </p>
          ) : (
            <div className="text-center">
              <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-3" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                {result.chonsu === 0 ? "배우자 / 나 자신" : `${result.chonsu}촌`}
              </div>

              <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-noto-serif)" }}>
                {myName}에게 {otherName}은(는)
              </h2>
              <p className="text-4xl font-bold mb-2" style={{ color: "var(--primary)", fontFamily: "var(--font-noto-serif)" }}>
                {result.relationshipName}
              </p>
              <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                {result.relationshipDesc}
              </p>

              {result.path && result.path.length > 1 && (
                <div className="mb-5">
                  <p className="text-xs mb-2 font-medium" style={{ color: "var(--text-muted)" }}>연결 경로</p>
                  <div className="flex flex-wrap items-center justify-center gap-1 text-sm">
                    {result.path.map((name, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-full font-medium" style={{
                          background: name === myName || name === otherName ? "var(--primary)" : "var(--primary-light)",
                          color: name === myName || name === otherName ? "#fff" : "var(--primary)",
                        }}>
                          {name}
                        </span>
                        {i < result.path!.length - 1 && <span style={{ color: "var(--text-muted)" }}>→</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.toMember && (
                <Link
                  href={`/member/${result.toMember.id}`}
                  className="inline-block px-5 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "var(--accent)" }}
                >
                  {otherName} 프로필 보기 →
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Member grid */}
      <div className="w-full max-w-lg">
        <h2 className="text-base font-bold mb-3" style={{ color: "var(--text-muted)", fontFamily: "var(--font-noto-serif)" }}>
          전체 가족 ({members.length}명)
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {members.map((m) => (
            <Link
              key={m.id}
              href={`/member/${m.id}`}
              className="rounded-xl p-3 text-center text-sm hover:shadow-md transition-shadow"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="mb-1">
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt={m.name} className="w-10 h-10 rounded-full mx-auto object-cover" />
                ) : (
                  <span className="text-2xl">{m.gender === "male" ? "👨" : "👩"}</span>
                )}
              </div>
              <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{m.name}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.role}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
