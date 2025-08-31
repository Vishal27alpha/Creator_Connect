/*'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Creator, CreatorFilters, FOLLOWER_RANGES } from '@/types/creator';
import { CreatorCard } from '@/components/creators/CreatorCard';
import { CreatorFiltersComponent } from '@/components/creators/CreatorFilters';
import { Loader2, Users } from 'lucide-react';

export default function DirectoryPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CreatorFilters>({
    niche: 'all',
    followerRange: 'all',
    location: '',
    searchQuery: '',
  });

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      const q = collection(db, 'creators');
      const querySnapshot = await getDocs(q);

      let creatorsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Creator[];

      // 🔹 Fetch Instagram followers count for each creator
      const enrichedCreators = await Promise.all(
        creatorsData.map(async (creator) => {
          if (creator.instagramHandle) {
            try {
              const res = await fetch('/api/instagram'); // calls our backend API
              const data = await res.json();

              console.log('Instagram API response:', data);

              return {
                ...creator,
                followerCount: data.followers_count || creator.followerCount || 0,
              };
            } catch (err) {
              console.error('Error fetching Instagram data:', err);
              return creator;
            }
          }
          return creator;
        })
      );

      setCreators(enrichedCreators);
    } catch (error) {
      console.error('Error loading creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      // 🔹 Search query filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesSearch =
          creator.name.toLowerCase().includes(searchLower) ||
          creator.instagramHandle.toLowerCase().includes(searchLower) ||
          creator.bio.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // 🔹 Niche filter
      if (filters.niche && filters.niche !== 'all' && creator.niche !== filters.niche) {
        return false;
      }

      // 🔹 Follower range filter
      if (filters.followerRange && filters.followerRange !== 'all') {
        const range = FOLLOWER_RANGES.find((r) => r.label === filters.followerRange);
        if (range && !(creator.followerCount >= range.min && creator.followerCount <= range.max)) {
          return false;
        }
      }

      // 🔹 Location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        if (!creator.location.toLowerCase().includes(locationLower)) {
          return false;
        }
      }

      return true;
    });
  }, [creators, filters]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Creator Directory</h1>
        <p className="text-muted-foreground">
          Discover and connect with Instagram creators in your niche
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1">
          <CreatorFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </div>

        
        <div className="lg:col-span-3">
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-5 w-5 mr-2" />
              <span>
                {filteredCreators.length} creator
                {filteredCreators.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>

          
          {filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-3xl font-bold text-foreground">No Creators Found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}*/
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Creator, CreatorFilters, FOLLOWER_RANGES, NICHES } from '@/types/creator';
import { CreatorCard } from '@/components/creators/CreatorCard';
import { CreatorFiltersComponent } from '@/components/creators/CreatorFilters';
import { Loader2, Users } from 'lucide-react';

export default function DirectoryPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CreatorFilters>({
    niche: 'all',
    followerRange: 'all',
    location: '',
    searchQuery: '',
  });

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      const q = collection(db, 'creators');
      const querySnapshot = await getDocs(q);

      let creatorsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Creator[];

      // 🔹 Fetch Instagram followers count for each creator
      const enrichedCreators = await Promise.all(
        creatorsData.map(async (creator) => {
          if (creator.instagramHandle) {
            try {
              const res = await fetch('/api/instagram'); // calls our backend API
              const data = await res.json();

              console.log('Instagram API response:', data);

              return {
                ...creator,
                followerCount: data.followers_count || creator.followerCount || 0,
                bio: creator.bio || '',
                about: creator.about || '',
              };
            } catch (err) {
              console.error('Error fetching Instagram data:', err);
              return creator;
            }
          }
          return creator;
        })
      );

      setCreators(enrichedCreators);
    } catch (error) {
      console.error('Error loading creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      // 🔹 Search query filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesSearch =
          creator.name.toLowerCase().includes(searchLower) ||
          creator.instagramHandle.toLowerCase().includes(searchLower) ||
          (creator.bio?.toLowerCase().includes(searchLower) ?? false) ||
          (creator.about?.toLowerCase().includes(searchLower) ?? false);

        if (!matchesSearch) return false;
      }

      // 🔹 Niche filter (supports custom input)
      if (filters.niche && filters.niche !== 'all') {
        // If user picked a predefined niche → exact match
        if (NICHES.includes(filters.niche)) {
          if (creator.niche !== filters.niche) return false;
        } else {
          // Custom niche → allow partial match
          if (!creator.niche?.toLowerCase().includes(filters.niche.toLowerCase())) {
            return false;
          }
        }
      }

      // 🔹 Follower range filter
      if (filters.followerRange && filters.followerRange !== 'all') {
        const range = FOLLOWER_RANGES.find((r) => r.label === filters.followerRange);
        if (range && !(creator.followerCount >= range.min && creator.followerCount <= range.max)) {
          return false;
        }
      }

      // 🔹 Location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        if (!creator.location.toLowerCase().includes(locationLower)) {
          return false;
        }
      }

      return true;
    });
  }, [creators, filters]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Creator Directory</h1>
        <p className="text-muted-foreground">
          Discover and connect with Instagram creators in your niche
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <CreatorFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-5 w-5 mr-2" />
              <span>
                {filteredCreators.length} creator
                {filteredCreators.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>

          {/* Results Grid */}
          {filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-3xl font-bold text-foreground">No Creators Found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
