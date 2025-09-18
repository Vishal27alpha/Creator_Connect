
/*"use client";

import { useState } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/src/components/ui/use-toast";
import { Timestamp } from "firebase/firestore";

export default function BrandProfilePage() {
  const { user } = useAuth();
  const [brand, setBrand] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setBrand((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const brandData = {
        id: user.uid,
        uid: user.uid,
        name: brand.name || "",
        email: brand.email || user.email || "",
        logo: brand.logo || user.photoURL || "",
        industry: brand.industry || "",
        targetAudience: brand.targetAudience || "",
        description: brand.description || "",
        currentCampaign: brand.currentCampaign || "",
        campaignDuration: brand.campaignDuration || "",
        pastCampaigns: brand.pastCampaigns || "",
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Save brand profile
      await setDoc(doc(db, "brands", user.uid), brandData, { merge: true });

      // ✅ Update role in users collection
      await updateDoc(doc(db, "users", user.uid), {
        role: "brand",
      });

      toast({
        title: "✅ Success",
        description: "Brand profile saved successfully! Your account is now marked as a Brand.",
      });
    } catch (err) {
      console.error("Error saving brand profile:", err);
      toast({
        title: "❌ Error",
        description: "Could not save brand profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Brand Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Brand Name"
          value={brand.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={brand.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
        <Input
          placeholder="Industry (e.g., Fashion, Tech, Fitness)"
          value={brand.industry || ""}
          onChange={(e) => handleChange("industry", e.target.value)}
          required
        />
        <Input
          placeholder="Target Audience (e.g., Gen Z in India)"
          value={brand.targetAudience || ""}
          onChange={(e) => handleChange("targetAudience", e.target.value)}
          required
        />
        <Textarea
          placeholder="About / Description"
          value={brand.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <Input
          placeholder="Current Campaign (e.g., Summer Collection 2025)"
          value={brand.currentCampaign || ""}
          onChange={(e) => handleChange("currentCampaign", e.target.value)}
        />

        <Input
          placeholder="Campaign Duration (e.g., Jan 2025 - Mar 2025)"
          value={brand.campaignDuration || ""}
          onChange={(e) => handleChange("campaignDuration", e.target.value)}
        />

        <Textarea
          placeholder="Past Campaigns (comma separated or list)"
          value={brand.pastCampaigns || ""}
          onChange={(e) => handleChange("pastCampaigns", e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}*/
/*"use client";

import { useState, useEffect } from "react";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth"; 
import { Brand } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/src/components/ui/use-toast";

export default function BrandProfilePage() {
  const { user } = useAuth();
  const [brand, setBrand] = useState<Partial<Brand>>({});
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing brand profile when page loads
  useEffect(() => {
    if (!user) return;

    const fetchBrand = async () => {
      try {
        const docRef = doc(db, "brands", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBrand(docSnap.data() as Brand);
        }
      } catch (err) {
        console.error("Error fetching brand profile:", err);
      }
    };

    fetchBrand();
  }, [user]);

  const handleChange = (field: keyof Brand, value: string) => {
    setBrand((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const brandData: Brand = {
        id: user.uid,
        uid: user.uid,
        name: brand.name || "",
        email: brand.email || user.email || "",
        logo: brand.logo || user.photoURL || "",
        industry: brand.industry || "",
        targetAudience: brand.targetAudience || "",
        description: brand.description || "",
        currentCampaign: brand.currentCampaign || "",
        campaignDuration: brand.campaignDuration || "",
        pastCampaigns: brand.pastCampaigns || "",
        createdAt: brand.createdAt || new Date(),
        updatedAt: new Date(),
      };

      // Save / update brand profile
      await setDoc(doc(db, "brands", user.uid), brandData, { merge: true });

      // Update role in users collection
      await updateDoc(doc(db, "users", user.uid), { role: "brand" });

      toast({
        title: "✅ Success",
        description: "Brand profile saved successfully!",
      });
    } catch (err) {
      console.error("Error saving brand profile:", err);
      toast({
        title: "❌ Error",
        description: "Could not save brand profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Brand Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Brand Name"
          value={brand.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={brand.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
        <Input
          placeholder="Industry (e.g., Fashion, Tech, Fitness)"
          value={brand.industry || ""}
          onChange={(e) => handleChange("industry", e.target.value)}
          required
        />
        <Input
          placeholder="Target Audience (e.g., Gen Z in India)"
          value={brand.targetAudience || ""}
          onChange={(e) => handleChange("targetAudience", e.target.value)}
          required
        />
        <Textarea
          placeholder="About / Description"
          value={brand.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <Input
          placeholder="Current Campaign (e.g., Summer Collection 2025)"
          value={brand.currentCampaign || ""}
          onChange={(e) => handleChange("currentCampaign", e.target.value)}
        />
        <Input
          placeholder="Campaign Duration (e.g., Jan 2025 - Mar 2025)"
          value={brand.campaignDuration || ""}
          onChange={(e) => handleChange("campaignDuration", e.target.value)}
        />
        <Textarea
          placeholder="Past Campaigns (comma separated or list)"
          value={brand.pastCampaigns || ""}
          onChange={(e) => handleChange("pastCampaigns", e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}*/
// app/brand/profile/page.tsx (or src/page where you keep it)
"use client";

import { useState, useEffect } from "react";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { Brand } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/src/components/ui/use-toast";

export default function BrandProfilePage() {
  const { user } = useAuth();
  const [brand, setBrand] = useState<Partial<Brand>>({});
  const [loading, setLoading] = useState(false);

  // Load existing brand doc on mount
  useEffect(() => {
    if (!user) return;
    const fetchBrand = async () => {
      try {
        const ref = doc(db, "brands", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          // Normalize Firestore Timestamp -> Date if needed
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt;
          const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt;

          setBrand({
            ...data,
            createdAt,
            updatedAt,
          } as Partial<Brand>);
        }
      } catch (err) {
        console.error("Error fetching brand profile:", err);
      }
    };
    fetchBrand();
  }, [user]);

  // safer key type now that Brand includes the campaign fields
  const handleChange = (field: keyof Brand, value: string) => {
    setBrand((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const brandData: Brand = {
        id: user.uid,
        uid: user.uid,
        name: brand.name || "",
        email: brand.email || user.email || "",
        logo: brand.logo || user.photoURL || "",
        industry: brand.industry || "",
        targetAudience: brand.targetAudience || "",
        description: brand.description || "",
        // new campaign fields
        currentCampaign: brand.currentCampaign || "",
        campaignDuration: brand.campaignDuration || "",
        pastCampaigns: brand.pastCampaigns || "",
        // preserve existing createdAt if present, otherwise use now
        createdAt: (brand.createdAt as any) || new Date(),
        updatedAt: new Date(),
      };

      // Save brand profile
      await setDoc(doc(db, "brands", user.uid), brandData, { merge: true });

      // Update role in users collection (if you want to mark them as brand)
      await updateDoc(doc(db, "users", user.uid), { role: "brand" });

      toast({
        title: "✅ Success",
        description: "Brand profile saved successfully!",
      });
    } catch (err) {
      console.error("Error saving brand profile:", err);
      toast({
        title: "❌ Error",
        description: "Could not save brand profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Brand Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Brand Name"
          value={brand.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={brand.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
        <Input
          placeholder="Industry (e.g., Fashion, Tech, Fitness)"
          value={brand.industry || ""}
          onChange={(e) => handleChange("industry", e.target.value)}
          required
        />
        <Input
          placeholder="Target Audience (e.g., Gen Z in India)"
          value={brand.targetAudience || ""}
          onChange={(e) => handleChange("targetAudience", e.target.value)}
          required
        />
        <Textarea
          placeholder="About / Description"
          value={brand.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        {/* campaign fields */}
        <Input
          placeholder="Current Campaign (e.g., Summer Collection 2025)"
          value={brand.currentCampaign || ""}
          onChange={(e) => handleChange("currentCampaign", e.target.value)}
        />
        <Input
          placeholder="Campaign Duration (e.g., Jan 2025 - Mar 2025)"
          value={brand.campaignDuration || ""}
          onChange={(e) => handleChange("campaignDuration", e.target.value)}
        />
        <Textarea
          placeholder="Past Campaigns (comma separated or list)"
          value={brand.pastCampaigns || ""}
          onChange={(e) => handleChange("pastCampaigns", e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}



