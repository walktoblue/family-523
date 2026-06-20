"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Member } from "@/lib/types";

const EMPTY_MEMBER: Omit<Member, "id"> = {
  name: "",
  gender: "male",
  side: "paternal",
  role: "",
  birthYear: undefined,
  occupation: "",
  interests: "",
  description: "",
  photoUrl: "",
  parentIds: [],
  spouseId: "",
};

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState<Member | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function loadMembers() {
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(data.members);
  }

  useEffect(() => { loadMembers(); }, []);

  function startNew() {
    setEditing({ id: `member_${Date.now()}`, ...EMPTY_MEMBER });
    setIsNew(true);
    setMsg("");
  }

  function startEdit(m: Member) {
    setEditing({ ...m });
    setIsNew(false);
    setMsg("");
  }

  function cancelEdit() {
    setEditing(null);
    setIsNew(false);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const method = isNew ? "POST" : "PUT";
      await fetch("/api/members", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      await loadMembers();
      setMsg("저장 완료!");
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  async function deleteMember(id: string) {
    if (!confirm("정말 삭제할까요?")) return;
    await fetch("/api/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadMembers();
  }

  function updateField(field: keyof Member, value: string | string[] | number | undefined) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  return (
    <main className="min-h-screen px-4 py-10" style={{ background: "var(--background)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/" className="text-sm" style={{ color: "var(--text-muted)" }}>← 홈으로</Link>
            <h1 className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-noto-serif)", color: "var(--primary)" }}>
              관리자 페이지
            </h1>
          </div>
          <button
            onClick={startNew}
            className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
            style={{ background: "var(--accent)" }}
          >
            + 새 가족 추가
          </button>
        </div>

        {msg && <p className="mb-4 text-sm text-green-700 font-medium">{msg}</p>}

        {/* Edit form */}
        {editing && (
          <div className="rounded-2xl p-6 mb-6" style={{ background: "var(--card)", border: "2px solid var(--primary)" }}>
            <h2 className="font-bold text-lg mb-4" style={{ fontFamily: "var(--font-noto-serif)", color: "var(--primary)" }}>
              {isNew ? "새 가족 추가" : `${editing.name} 수정`}
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="이름 *">
                <input value={editing.name} onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: "1.5px solid var(--border)", background: "var(--background)" }} />
              </Field>
              <Field label="성별 *">
                <select value={editing.gender} onChange={(e) => updateField("gender", e.target.value as "male" | "female")}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: "1.5px solid var(--border)", background: "var(--background)" }}>
                  <option value="male">남자</option>
                  <option value="female">여자</option>
                </select>
              </Field>
              <Field label="계열 *">
                <select value={editing.side} onChange={(e) => updateField("side", e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: "1.5px solid var(--border)", background: "var(--background)" }}>
                  <option value="paternal">친가</option>
                  <option value="maternal">외가</option>
                  <option value="both">친가 & 외가</option>
                  <option value="paternal_in">친가 (혼인)</option>
                  <option value="maternal_in">외가 (혼인)</option>
                </select>
              </Field>
              <Field label="역할">
                <input value={editing.role} onChange={(e) => updateField("role", e.target.value)}
                  placeholder="예: 첫째딸, 사촌"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: "1.5px solid var(--border)", background: "var(--background)" }} />
              </Field>
              <Field label="출생연도">
                <input type="number" value={editing.birthYear ?? ""} onChange={(e) => updateField("birthYear", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="예: 1990"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: "1.5px solid var(--border)", background: "var(--background)" }} />
              </Field>
              <Field label="직업">
                <input value={editing.occupation ?? ""} onChange={(e) => updateField("occupation", e.target.value)}
                  placeholder="예: 교사, 회사원"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: "1.5px solid var(--border)", background: "var(--background)" }} />
              </Field>
            </div>
            <Field label="관심사 (쉼표로 구분)">
              <input value={editing.interests ?? ""} onChange={(e) => updateField("interests", e.target.value)}
                placeholder="예: 독서, 여행, 요리"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: "1.5px solid var(--border)", background: "var(--background)" }} />
            </Field>
            <Field label="소개">
              <textarea value={editing.description ?? ""} onChange={(e) => updateField("description", e.target.value)}
                rows={2} placeholder="이 가족에 대해 간단히 소개해 주세요"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                style={{ border: "1.5px solid var(--border)", background: "var(--background)" }} />
            </Field>
            <Field label="사진 URL">
              <input value={editing.photoUrl ?? ""} onChange={(e) => updateField("photoUrl", e.target.value)}
                placeholder="https://... 또는 /photos/이름.jpg"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: "1.5px solid var(--border)", background: "var(--background)" }} />
            </Field>
            <Field label="부모 ID (쉼표로 구분)">
              <div>
                <input value={editing.parentIds.join(",")} onChange={(e) => updateField("parentIds", e.target.value ? e.target.value.split(",").map(s => s.trim()) : [])}
                  placeholder="예: shingyun,hyeeun"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: "1.5px solid var(--border)", background: "var(--background)" }} />
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  아래 목록에서 ID 확인: {members.slice(0,5).map(m => `${m.name}(${m.id})`).join(", ")}…
                </p>
              </div>
            </Field>
            <Field label="배우자 ID">
              <input value={editing.spouseId ?? ""} onChange={(e) => updateField("spouseId", e.target.value)}
                placeholder="배우자의 ID 입력"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: "1.5px solid var(--border)", background: "var(--background)" }} />
            </Field>

            <div className="flex gap-2 mt-4">
              <button onClick={save} disabled={saving}
                className="px-5 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: "var(--primary)", opacity: saving ? 0.7 : 1 }}>
                {saving ? "저장 중…" : "저장"}
              </button>
              <button onClick={cancelEdit}
                className="px-5 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                취소
              </button>
            </div>
          </div>
        )}

        {/* Member list */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <div className="px-4 py-3" style={{ background: "var(--primary-light)" }}>
            <span className="font-bold text-sm" style={{ color: "var(--primary)" }}>전체 가족 목록 ({members.length}명)</span>
          </div>
          <div className="divide-y" style={{ background: "var(--card)" }}>
            {members.map((m) => (
              <div key={m.id} className="flex items-center px-4 py-3 gap-3">
                <span className="text-xl">{m.gender === "male" ? "👨" : "👩"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{m.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                    {m.role} · {m.id} {m.birthYear ? `· ${m.birthYear}년생` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(m)}
                    className="px-3 py-1 text-xs rounded-lg font-medium"
                    style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                    수정
                  </button>
                  <button onClick={() => deleteMember(m.id)}
                    className="px-3 py-1 text-xs rounded-lg font-medium"
                    style={{ background: "#ffebee", color: "#c62828" }}>
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>{label}</label>
      {children}
    </div>
  );
}
