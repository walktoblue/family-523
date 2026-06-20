import { Member, RelationshipResult } from "./types";

// Build adjacency list for blood relatives (parent-child links only)
function buildBloodGraph(members: Member[]): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  for (const m of members) {
    if (!graph.has(m.id)) graph.set(m.id, []);
    for (const pid of m.parentIds) {
      if (!graph.has(pid)) graph.set(pid, []);
      graph.get(m.id)!.push(pid);
      graph.get(pid)!.push(m.id);
    }
  }
  return graph;
}

// BFS shortest path between two nodes
function bfsPath(graph: Map<string, string[]>, from: string, to: string): string[] | null {
  if (from === to) return [from];
  const visited = new Set<string>();
  const queue: { id: string; path: string[] }[] = [{ id: from, path: [from] }];
  visited.add(from);
  while (queue.length > 0) {
    const { id, path } = queue.shift()!;
    for (const neighbor of graph.get(id) ?? []) {
      if (visited.has(neighbor)) continue;
      const newPath = [...path, neighbor];
      if (neighbor === to) return newPath;
      visited.add(neighbor);
      queue.push({ id: neighbor, path: newPath });
    }
  }
  return null;
}

// Find lowest common ancestor path
function findLCAPath(
  members: Member[],
  fromId: string,
  toId: string
): { upSteps: number; downSteps: number; path: string[] } | null {
  const graph = buildBloodGraph(members);
  const path = bfsPath(graph, fromId, toId);
  if (!path) return null;

  // Find where the path goes "up" then "down"
  // Up = moving toward parent (parentIds contains next node)
  // Down = moving toward child

  const memberMap = new Map(members.map((m) => [m.id, m]));
  let upSteps = 0;
  let downSteps = 0;
  let goingDown = false;

  for (let i = 0; i < path.length - 1; i++) {
    const curr = path[i];
    const next = path[i + 1];
    const currMember = memberMap.get(curr);
    const isUp = currMember?.parentIds.includes(next) ?? false;
    if (isUp) {
      upSteps++;
    } else {
      goingDown = true;
      downSteps++;
    }
    if (goingDown && !isUp) {
      // going down is fine
    }
  }

  return { upSteps, downSteps, path };
}

// Determine relationship name from perspective of `from` toward `to`
function getRelationshipName(
  from: Member,
  to: Member,
  upSteps: number,
  downSteps: number,
  chonsu: number
): { name: string; desc: string } {
  const fromGender = from.gender;
  const toGender = to.gender;

  // Direct line: only upSteps (ancestor) or only downSteps (descendant)
  if (upSteps === 0 && downSteps === 1) {
    return toGender === "male"
      ? { name: "아들", desc: "나의 아들이에요" }
      : { name: "딸", desc: "나의 딸이에요" };
  }
  if (upSteps === 1 && downSteps === 0) {
    if (to.side === "paternal" || to.parentIds.some(() => true)) {
      // Check if grandfather/grandmother
      return toGender === "male"
        ? { name: "아버지", desc: "나의 아버지예요" }
        : { name: "어머니", desc: "나의 어머니예요" };
    }
  }
  if (upSteps === 0 && downSteps === 2) {
    return toGender === "male"
      ? { name: "손자", desc: "나의 손자예요" }
      : { name: "손녀", desc: "나의 손녀예요" };
  }
  if (upSteps === 2 && downSteps === 0) {
    const isPateralSide = to.side === "paternal";
    if (toGender === "male") {
      return isPateralSide
        ? { name: "할아버지", desc: "친할아버지예요" }
        : { name: "외할아버지", desc: "외할아버지예요" };
    } else {
      return isPateralSide
        ? { name: "할머니", desc: "친할머니예요" }
        : { name: "외할머니", desc: "외할머니예요" };
    }
  }

  // Siblings (2촌)
  if (upSteps === 1 && downSteps === 1) {
    return toGender === "male"
      ? { name: "남자형제", desc: "형제예요 (오빠/형/남동생)" }
      : { name: "여자형제", desc: "자매예요 (언니/누나/여동생)" };
  }

  // 3촌: uncle/aunt/nephew/niece
  if (upSteps === 2 && downSteps === 1) {
    if (toGender === "male") {
      return to.side === "paternal"
        ? { name: "삼촌", desc: "아버지의 남자형제 — 삼촌이에요" }
        : { name: "외삼촌", desc: "어머니의 남자형제 — 외삼촌이에요" };
    } else {
      return to.side === "paternal"
        ? { name: "고모", desc: "아버지의 여자형제 — 고모예요" }
        : { name: "이모", desc: "어머니의 여자형제 — 이모예요" };
    }
  }
  if (upSteps === 1 && downSteps === 2) {
    return toGender === "male"
      ? { name: "조카", desc: "형제·자매의 아들 — 조카예요" }
      : { name: "조카딸", desc: "형제·자매의 딸 — 조카딸이에요" };
  }

  // 4촌: first cousins
  if (upSteps === 2 && downSteps === 2) {
    return toGender === "male"
      ? { name: "사촌오빠/남동생", desc: "사촌이에요 (4촌)" }
      : { name: "사촌언니/여동생", desc: "사촌이에요 (4촌)" };
  }

  // 5촌
  if (chonsu === 5) {
    if (upSteps === 3 && downSteps === 2) {
      return toGender === "male"
        ? { name: "당숙", desc: "아버지의 사촌 — 오촌 당숙이에요" }
        : { name: "당고모", desc: "아버지의 사촌 여동생 — 오촌 당고모예요" };
    }
    return { name: `${chonsu}촌`, desc: `${chonsu}촌 친척이에요` };
  }

  // 6촌
  if (chonsu === 6) {
    return { name: "육촌", desc: "육촌 친척이에요 (6촌)" };
  }

  // Fallback
  return { name: `${chonsu}촌`, desc: `${chonsu}촌 친척이에요` };
}

export function calculateRelationship(
  members: Member[],
  fromName: string,
  toName: string
): RelationshipResult {
  const memberMap = new Map(members.map((m) => [m.name, m]));

  const from = memberMap.get(fromName);
  const to = memberMap.get(toName);

  if (!from || !to) {
    return { found: false };
  }

  if (from.id === to.id) {
    return {
      found: true,
      chonsu: 0,
      relationshipName: "나 자신",
      relationshipDesc: "같은 사람이에요",
      path: [from.name],
    };
  }

  // Check spouse relationship first
  if (from.spouseId === to.id || to.spouseId === from.id) {
    return {
      found: true,
      chonsu: 0,
      relationshipName: to.gender === "male" ? "남편" : "아내",
      relationshipDesc: "배우자예요",
      path: [from.name, to.name],
    };
  }

  const lcaResult = findLCAPath(members, from.id, to.id);
  if (!lcaResult) {
    return { found: false };
  }

  const { upSteps, downSteps, path } = lcaResult;
  const chonsu = upSteps + downSteps;

  const { name, desc } = getRelationshipName(from, to, upSteps, downSteps, chonsu);

  const memberById = new Map(members.map((m) => [m.id, m]));
  const pathNames = path.map((id) => memberById.get(id)?.name ?? id);

  return {
    found: true,
    chonsu,
    relationshipName: name,
    relationshipDesc: desc,
    path: pathNames,
  };
}
