export interface Creator {
  id: string;
  uid: string;
  name: string;
  email: string;
  instagramHandle: string;
  niche: string;
  followerCount: string;
  location: string;
  bio: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
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

export const FOLLOWER_RANGES = [
  '1K-10K',
  '10K-50K',
  '50K-100K',
  '100K-500K',
  '500K-1M',
  '1M+'
];