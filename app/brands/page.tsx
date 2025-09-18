"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Brand = {
  id: string;
  name: string;
  email: string;
  industry: string;
  description: string;
  currentCampaign?: string;
  logo?: string;
};

export default function BrandsDirectoryPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");

  // Fetch all brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const snap = await getDocs(collection(db, "brands"));
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Brand[];
        setBrands(list);
        setFilteredBrands(list);
      } catch (err) {
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = brands;

    if (industryFilter !== "all") {
      results = results.filter((b) => b.industry?.toLowerCase() === industryFilter.toLowerCase());
    }

    if (search.trim() !== "") {
      results = results.filter(
        (b) =>
          b.name?.toLowerCase().includes(search.toLowerCase()) ||
          b.description?.toLowerCase().includes(search.toLowerCase()) ||
          b.currentCampaign?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredBrands(results);
  }, [search, industryFilter, brands]);

  if (loading) return <p className="text-center py-10">Loading brands...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Brands Directory</h1>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
        <Select value={industryFilter} onValueChange={(val) => setIndustryFilter(val)}>
          <SelectTrigger className="w-full md:w-1/4">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="fashion">Fashion</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="beauty">Beauty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Brands List */}
      {filteredBrands.length === 0 ? (
        <p className="text-gray-500">No brands match your filters.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="shadow-md hover:shadow-lg transition">
              <CardContent className="p-4">
                <h2 className="font-semibold text-lg">{brand.name}</h2>
                <p className="text-sm text-gray-500">{brand.industry}</p>

                {/* Highlighted Campaign */}
                {brand.currentCampaign && (
                  <p className="mt-2 text-sm font-medium text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded w-fit">
                    🎯 Current Campaign: {brand.currentCampaign}
                  </p>
                )}

                {/* Email */}
                {brand.email && (
                  <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                     {brand.email}
                  </p>
                )}

                <p className="mt-2 text-gray-700 dark:text-gray-300">{brand.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
