"use client";

import Link from "next/link";
import { Member } from "@/lib/types";

interface TreeNode {
  id: string;
  member: Member;
  spouse: Member | null;
  children: TreeNode[];
}

function buildForest(members: Member[]): TreeNode[] {
  const byId = new Map(members.map((m) => [m.id, m]));

  // parent → childIds
  const childrenOf = new Map<string, string[]>();
  for (const m of members) {
    for (const pid of m.parentIds) {
      if (!childrenOf.has(pid)) childrenOf.set(pid, []);
      childrenOf.get(pid)!.push(m.id);
    }
  }

  // members who have at least one parent in dataset
  const hasParent = new Set(
    members.filter((m) => m.parentIds.some((pid) => byId.has(pid))).map((m) => m.id)
  );

  // roots = no parent in dataset
  const roots = members.filter((m) => !hasParent.has(m.id));

  // Keep only true root nodes:
  // - If spouse has parents in dataset → this person is "married-in", exclude (appears as couple)
  // - If both have no parents (couple at top) → keep only one (smaller ID wins to deduplicate)
  const primaryRoots = roots.filter((m) => {
    const spouse = m.spouseId ? byId.get(m.spouseId) : undefined;
    if (!spouse) return true;
    if (hasParent.has(spouse.id)) return false; // married-in: exclude
    return m.id < spouse.id; // both are roots: keep only one
  });

  const visited = new Set<string>();

  function buildNode(m: Member): TreeNode {
    visited.add(m.id);
    const spouse = m.spouseId ? (byId.get(m.spouseId) ?? null) : null;
    if (spouse) visited.add(spouse.id);

    const childIdSet = new Set<string>([
      ...(childrenOf.get(m.id) ?? []),
      ...(spouse ? (childrenOf.get(spouse.id) ?? []) : []),
    ]);

    const allChildren = [...childIdSet]
      .map((cid) => byId.get(cid))
      .filter(Boolean) as Member[];

    // deduplicate: only one per couple (exclude spouses-of-children)
    const childSpouseIds = new Set(
      allChildren.filter((c) => c.spouseId).map((c) => c.spouseId!)
    );
    const primaryChildren = allChildren.filter(
      (c) => !childSpouseIds.has(c.id) && !visited.has(c.id)
    );

    return {
      id: m.id,
      member: m,
      spouse,
      children: primaryChildren.map(buildNode),
    };
  }

  return primaryRoots.filter((r) => !visited.has(r.id)).map(buildNode);
}

function emoji(m: Member) {
  const age = m.birthYear ? 2026 - m.birthYear : 40;
  if (m.gender === "male") return age > 60 ? "👴" : age > 30 ? "👨" : "👦";
  return age > 60 ? "👵" : age > 30 ? "👩" : "👧";
}

const LINE = "rgba(193,127,58,0.35)";
const DROP = 18; // px between generations

function PersonChip({ member }: { member: Member }) {
  return (
    <Link
      href={`/member/${member.id}`}
      className="flex flex-col items-center w-[68px] hover:scale-105 transition-transform"
    >
      <div
        className="w-11 h-11 squircle flex items-center justify-center text-lg overflow-hidden"
        style={{ background: "var(--surface-container-high)" }}
      >
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-11 h-11 squircle object-cover"
          />
        ) : (
          <span>{emoji(member)}</span>
        )}
      </div>
      <p
        className="text-[11px] font-semibold text-center mt-1 leading-tight break-keep"
        style={{ color: "var(--on-surface)", maxWidth: 68 }}
      >
        {member.name}
      </p>
      {member.birthYear && (
        <p className="text-[10px]" style={{ color: "var(--outline)" }}>
          {2026 - member.birthYear}세
        </p>
      )}
    </Link>
  );
}

function CoupleUnit({ member, spouse }: { member: Member; spouse: Member | null }) {
  if (!spouse) return <PersonChip member={member} />;
  return (
    <div className="flex items-start gap-1">
      <PersonChip member={member} />
      <div className="flex flex-col items-center pt-3 gap-0.5">
        <div className="w-3" style={{ height: 1, background: LINE }} />
        <span style={{ fontSize: 9 }}>❤</span>
        <div className="w-3" style={{ height: 1, background: LINE }} />
      </div>
      <PersonChip member={spouse} />
    </div>
  );
}

function TreeUnit({ node }: { node: TreeNode }) {
  const n = node.children.length;

  return (
    <div className="flex flex-col items-center">
      {/* Couple card */}
      <div
        className="rounded-2xl border px-2 py-2"
        style={{
          background: "var(--surface-container-lowest)",
          borderColor: "rgba(215,195,179,0.4)",
          boxShadow: "0 2px 12px rgba(193,127,58,0.07)",
        }}
      >
        <CoupleUnit member={node.member} spouse={node.spouse} />
      </div>

      {n > 0 && (
        <>
          {/* Vertical stem from parent to H-bar */}
          <div style={{ width: 2, height: DROP, background: LINE, flexShrink: 0 }} />

          {/* Children row */}
          <div className="flex items-start" style={{ gap: 12 }}>
            {node.children.map((child, i) => {
              const isFirst = i === 0;
              const isLast = i === n - 1;
              const isOnly = n === 1;

              return (
                <div key={child.id} className="flex flex-col items-center">
                  {/* H-bar segment + vertical drop */}
                  <div className="relative w-full" style={{ height: DROP }}>
                    {/* left half */}
                    {!isFirst && !isOnly && (
                      <div
                        className="absolute"
                        style={{ top: 0, left: 0, right: "50%", height: 2, background: LINE }}
                      />
                    )}
                    {/* right half */}
                    {!isLast && !isOnly && (
                      <div
                        className="absolute"
                        style={{ top: 0, left: "50%", right: 0, height: 2, background: LINE }}
                      />
                    )}
                    {/* vertical drop */}
                    <div
                      className="absolute"
                      style={{
                        top: 0,
                        bottom: 0,
                        left: "50%",
                        width: 2,
                        background: LINE,
                        transform: "translateX(-50%)",
                      }}
                    />
                  </div>

                  <TreeUnit node={child} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function FamilyTree({ members }: { members: Member[] }) {
  const forest = buildForest(members);
  if (forest.length === 0) return null;

  return (
    <div className="overflow-x-auto pb-4 -mx-5 px-5">
      <div
        className="flex items-start justify-center"
        style={{ gap: 48, minWidth: "max-content" }}
      >
        {forest.map((root) => (
          <div key={root.id} className="flex flex-col items-center">
            {/* Side label */}
            <p
              className="text-xs font-bold mb-3 tracking-wider uppercase"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {root.member.side === "maternal" || root.member.side === "maternal_in"
                ? "외가"
                : "친가"}
            </p>
            <TreeUnit node={root} />
          </div>
        ))}
      </div>
    </div>
  );
}
