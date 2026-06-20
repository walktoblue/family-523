export interface Member {
  id: string;
  name: string;
  gender: "male" | "female";
  side: "paternal" | "maternal" | "both" | "paternal_in" | "maternal_in";
  role: string;
  birthYear?: number;
  occupation?: string;
  interests?: string;
  description?: string;
  photoUrl?: string;
  parentIds: string[];
  spouseId?: string;
}

export interface RelationshipResult {
  found: boolean;
  chonsu?: number;
  relationshipName?: string;
  relationshipDesc?: string;
  path?: string[];
}
