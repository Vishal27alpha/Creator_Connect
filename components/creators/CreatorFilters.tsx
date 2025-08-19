'use client';

import { CreatorFilters, NICHES, FOLLOWER_RANGES } from '@/types/creator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface CreatorFiltersProps {
  filters: CreatorFilters;
  onFiltersChange: (filters: CreatorFilters) => void;
}

export function CreatorFiltersComponent({ filters, onFiltersChange }: CreatorFiltersProps) {
  const updateFilter = (key: keyof CreatorFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filter Creators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name or handle..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Niche Filter */}
        <div className="space-y-2">
          <Label>Niche</Label>
          <Select value={filters.niche || "all"} onValueChange={(value) => updateFilter('niche', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All niches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All niches</SelectItem>
              {NICHES.map((niche) => (
                <SelectItem key={niche} value={niche}>
                  {niche}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Follower Range Filter */}
        <div className="space-y-2">
          <Label>Follower Count</Label>
          <Select value={filters.followerRange || "all"} onValueChange={(value) => updateFilter('followerRange', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All ranges" />
            </SelectTrigger>
            <SelectContent>
  <SelectItem value="all">All ranges</SelectItem>
  {FOLLOWER_RANGES.map((range) => (
    <SelectItem key={range.label} value={range.label}>
      {range.label}
    </SelectItem>
  ))}
</SelectContent>

          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter city or country..."
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
