// src/lib/types.ts
export interface Brand {
  id: string;
  uid: string;
  name: string;
  email: string;
  logo?: string;
  industry?: string;
  targetAudience?: string;
  description?: string;

  // ---- new campaign fields ----
  currentCampaign?: string;
  campaignDuration?: string;
  pastCampaigns?: string; // keep as comma-separated string for now (or string[] if you prefer)
  // -----------------------------

  // createdAt/updatedAt — allow Date or Firestore Timestamp-like object
  createdAt?: Date | { seconds: number; nanoseconds: number } | null;
  updatedAt?: Date | { seconds: number; nanoseconds: number } | null;
}

// export other types if you have them...
