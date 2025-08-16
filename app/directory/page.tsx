'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Creator, CreatorFilters } from '@/types/creator';
import { CreatorCard } from '@/components/creators/CreatorCard';
import { CreatorFiltersComponent } from '@/components/creators/CreatorFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Users } from 'lucide-react';

export default function DirectoryPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CreatorFilters>({
    niche: '',
    followerRange: '',
    location: '',
    searchQuery: '',
  });

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      const q = query(collection(db, 'creators'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const creatorsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Creator[];
      setCreators(creatorsData);
    } catch (error) {
      console.error('Error loading creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      // Search query filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          creator.name.toLowerCase().includes(searchLower) ||
          creator.instagramHandle.toLowerCase().includes(searchLower) ||
          creator.bio.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Niche filter
      if (filters.niche && creator.niche !== filters.niche) {
        return false;
      }

      // Follower range filter
      if (filters.followerRange && creator.followerCount !== filters.followerRange) {
        return false;
      }

      // Location filter
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Directory</h1>
        <p className="text-gray-600">
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
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <span>
                {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} found
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
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No creators found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}