"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Member } from "@/lib/types";

const EMPTY: Omit<Member, "id"> = {
  name: "", gender: "male", side: "paternal", role: "",
  birthYear: undefined, occupation: "", interests: "",
  description: "", photoUrl: "", parentIds: [], spouseId: "",
};

function avatarEmoji(m: { gender: string; birthYear?: number }) {
  const age = m.birthYear ? new Date().getFullYear() - m.birthYear : 30;
  if (m.gender === "male") return age > 60 ? "👴" : age > 30 ? "👨" : "👦";
  return age > 60 ? "👵" : age > 30 ? "👩" : "👧";
}

const SQUIRCLE_COLORS = ["bg-[#ffdcbf]", "bg-[#b9efc5]", "bg-[#ffdcc3]", "bg-[#e7e2da]"];

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState<Member | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(data.members);
  }
  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ id: `member_${Date.now()}`, ...EMPTY });
    setIsNew(true); setMsg("");
  }
  function startEdit(m: Member) { setEditing({ ...m }); setIsNew(false); setMsg(""); }
  function cancel() { setEditing(null); setIsNew(false); }

  async function save() {
    if (!editing || !editing.name) return;
    setSaving(true);
    try {
      await fetch("/api/members", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      await load(); setMsg("저장 완료!"); setEditing(null);
    } finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("정말 삭제할까요?")) return;
    await fetch("/api/members", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  function set<K extends keyof Member>(field: K, value: Member[K]) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) set("photoUrl", data.url);
      else if (data.error) setMsg(`업로드 실패: ${data.error}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-1 text-sm mb-2" style={{ color: "var(--on-surface-variant)" }}>
            <span className="material-symbols-outlined text-base">arrow_back</span> 홈
          </Link>
          <h1 className="serif text-3xl font-bold" style={{ color: "var(--primary)" }}>관리자 페이지</h1>
          <p className="text-sm mt-1" style={{ color: "var(--on-surface-variant)" }}>
            가족 구성원의 정보를 안전하게 관리하고 가계도를 확장하세요.
          </p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
          style={{ background: "var(--secondary)" }}
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          + 새 가족 추가
        </button>
      </div>

      {msg && (
        <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}>
          <span className="material-symbols-outlined text-base">check_circle</span> {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Member list */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl album-shadow overflow-hidden border" style={{ background: "var(--surface-container-lowest)", borderColor: "rgba(215,195,179,0.3)" }}>
            <div className="px-5 py-3 border-b flex justify-between items-center" style={{ background: "var(--surface-container-low)", borderColor: "rgba(215,195,179,0.3)" }}>
              <span className="font-bold text-sm" style={{ color: "var(--on-surface-variant)" }}>
                멤버 목록 ({members.length}명)
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "rgba(215,195,179,0.2)" }}>
              {members.map((m, i) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-[var(--surface-container-low)] transition-colors group"
                  style={editing?.id === m.id ? { background: "rgba(255,220,191,0.2)", borderLeft: "4px solid var(--primary)" } : {}}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 flex items-center justify-center text-xl squircle ${SQUIRCLE_COLORS[i % SQUIRCLE_COLORS.length]}`}
                    >
                      {m.photoUrl ? <img src={m.photoUrl} alt={m.name} className="w-11 h-11 squircle object-cover" /> : avatarEmoji(m)}
                    </div>
                    <div>
                      <p className="serif font-semibold text-base" style={{ color: "var(--on-surface)" }}>{m.name}</p>
                      <p className="text-xs" style={{ color: "var(--outline)" }}>ID: {m.id} · {m.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(m)}
                      className="px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:bg-[rgba(134,79,10,0.08)]"
                      style={{ borderColor: "var(--outline-variant)", color: "var(--primary)" }}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => del(m.id)}
                      className="px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:bg-[rgba(186,26,26,0.05)]"
                      style={{ borderColor: "rgba(186,26,26,0.3)", color: "var(--error)" }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-5">
          {editing ? (
            <div className="rounded-2xl album-shadow p-6 border-2" style={{ background: "var(--surface-container-lowest)", borderColor: "var(--primary-btn)" }}>
              <h2 className="serif text-xl font-bold mb-5" style={{ color: "var(--primary)" }}>
                {isNew ? "새 가족 추가" : `${editing.name || "…"} 수정`}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="이름 *">
                    <input value={editing.name} onChange={(e) => set("name", e.target.value)}
                      className="field-input" placeholder="예: 김로이" />
                  </Field>
                  <Field label="성별">
                    <select value={editing.gender} onChange={(e) => set("gender", e.target.value as "male" | "female")} className="field-input">
                      <option value="male">남자</option>
                      <option value="female">여자</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="계열">
                    <select value={editing.side} onChange={(e) => set("side", e.target.value as Member["side"])} className="field-input">
                      <option value="paternal">친가</option>
                      <option value="maternal">외가</option>
                      <option value="both">친가 & 외가</option>
                      <option value="paternal_in">친가 (혼인)</option>
                      <option value="maternal_in">외가 (혼인)</option>
                    </select>
                  </Field>
                  <Field label="역할">
                    <input value={editing.role} onChange={(e) => set("role", e.target.value)}
                      className="field-input" placeholder="첫째딸, 사촌 등" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="출생연도">
                    <input type="number" value={editing.birthYear ?? ""} onChange={(e) => set("birthYear", e.target.value ? Number(e.target.value) : undefined)}
                      className="field-input" placeholder="1990" />
                  </Field>
                  <Field label="직업">
                    <input value={editing.occupation ?? ""} onChange={(e) => set("occupation", e.target.value)}
                      className="field-input" placeholder="교사, 개발자 등" />
                  </Field>
                </div>
                <Field label="관심사 (쉼표로 구분)">
                  <input value={editing.interests ?? ""} onChange={(e) => set("interests", e.target.value)}
                    className="field-input" placeholder="독서, 여행, 요리" />
                </Field>
                <Field label="소개">
                  <textarea value={editing.description ?? ""} onChange={(e) => set("description", e.target.value)}
                    rows={3} className="field-input resize-none" placeholder="가족을 소개해 주세요" />
                </Field>
                <Field label="사진">
                  <div className="space-y-2">
                    {editing.photoUrl && (
                      <div className="flex items-center gap-3">
                        <img
                          src={editing.photoUrl}
                          alt="미리보기"
                          className="w-14 h-14 squircle object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => set("photoUrl", "")}
                          className="text-xs font-semibold"
                          style={{ color: "var(--error)" }}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                    <label
                      className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl border text-sm font-semibold w-fit"
                      style={{
                        borderColor: "var(--outline-variant)",
                        background: "var(--surface-container-low)",
                        color: uploading ? "var(--outline)" : "var(--on-surface-variant)",
                        cursor: uploading ? "not-allowed" : "pointer",
                      }}
                    >
                      <span className="material-symbols-outlined text-base">
                        {uploading ? "sync" : "upload"}
                      </span>
                      {uploading ? "업로드 중…" : "사진 선택"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </Field>
                <Field label="부모 ID (쉼표로 구분)">
                  <input value={editing.parentIds.join(",")} onChange={(e) => set("parentIds", e.target.value ? e.target.value.split(",").map(s => s.trim()) : [])}
                    className="field-input" placeholder="shingyun,hyeeun" />
                  <p className="text-xs mt-1" style={{ color: "var(--outline)" }}>
                    예: {members.slice(0, 3).map(m => m.id).join(", ")}…
                  </p>
                </Field>
                <Field label="배우자 ID">
                  <input value={editing.spouseId ?? ""} onChange={(e) => set("spouseId", e.target.value)}
                    className="field-input" placeholder="ID 입력" />
                </Field>

                <div className="flex gap-3 pt-2">
                  <button onClick={save} disabled={saving}
                    className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-opacity"
                    style={{ background: "var(--primary-btn)", opacity: saving ? 0.7 : 1 }}>
                    {saving ? "저장 중…" : "저장"}
                  </button>
                  <button onClick={cancel}
                    className="px-5 py-3 rounded-xl text-sm font-semibold"
                    style={{ background: "var(--surface-container-high)", color: "var(--on-surface-variant)" }}>
                    취소
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-8 text-center" style={{ background: "var(--surface-container-low)", border: "2px dashed var(--outline-variant)" }}>
              <span className="material-symbols-outlined text-4xl mb-3 block" style={{ color: "var(--outline-variant)" }}>edit_note</span>
              <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
                왼쪽 목록에서 수정할 가족을 선택하거나<br />새 가족을 추가하세요.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .field-input {
          width: 100%;
          border-radius: 0.75rem;
          padding: 0.6rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
          border: 1.5px solid var(--outline-variant);
          background: var(--surface-container-low);
          color: var(--on-surface);
          transition: border-color 0.15s;
        }
        .field-input:focus {
          border-color: var(--primary-btn);
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "var(--on-surface-variant)" }}>{label}</label>
      {children}
    </div>
  );
}
