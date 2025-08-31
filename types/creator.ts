export interface Creator {
  id: string;
  uid: string;
  name: string;
  email: string;
  instagramHandle: string;
  niche: string;
  followerCount: number;
  location: string;
  bio: string;
  about?: string;
  profileImage?: string;
  createdAt: Date|any;
  updatedAt: Date|any;
}

export interface CreatorFilters {
  niche: string;
  followerRange: string;
  location: string;
  searchQuery: string;
}

export const NICHES = [
  'Fashion & Beauty',
  'Fitness & Health',
  'Food & Cooking',
  'Travel',
  'Technology',
  'Lifestyle',
  'Business',
  'Art & Design',
  'Music',
  'Photography',
  'Education',
  'Gaming',
  'Other'
];

export interface FollowerRange {
  label: string;
  min: number;
  max: number;
}

export const FOLLOWER_RANGES: FollowerRange[] = [
  { label: '1K-10K', min: 1000, max: 10000 },
  { label: '10K-50K', min: 10000, max: 50000 },
  { label: '50K-100K', min: 50000, max: 100000 },
  { label: '100K-500K', min: 100000, max: 500000 },
  { label: '500K-1M', min: 500000, max: 1000000 },
  { label: '1M+', min: 1000000, max: Infinity },
];

