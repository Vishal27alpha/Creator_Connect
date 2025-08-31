'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Creator } from '@/types/creator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CreatorCard } from '@/components/creators/CreatorCard';
import { 
  Loader2, 
  MapPin, 
  Users, 
  ExternalLink, 
  Mail,
  Instagram,
  Calendar
} from 'lucide-react';

export default function CreatorDetailPage() {
  const params = useParams();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [similarCreators, setSimilarCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadCreator(params.id as string);
    }
  }, [params.id]);

  const loadCreator = async (id: string) => {
    try {
      const docRef = doc(db, 'creators', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const creatorData = { ...docSnap.data(), id: docSnap.id } as Creator;
        setCreator(creatorData);

        // Load similar creators
        const q = query(collection(db, 'creators'), limit(6));
        const querySnapshot = await getDocs(q);
        const allCreators = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Creator[];

        const similar = allCreators
          .filter(c => c.id !== id && c.niche === creatorData.niche)
          .slice(0, 3);
        
        setSimilarCreators(similar);
      }
    } catch (error) {
      console.error('Error loading creator:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (creator) {
      const subject = encodeURIComponent(`Collaboration Opportunity - CreatorConnect`);
      const body = encodeURIComponent(
        `Hi ${creator.name},\n\nI found your profile on CreatorConnect and would love to discuss potential collaboration opportunities.\n\nBest regards`
      );
      window.open(`mailto:${creator.email}?subject=${subject}&body=${body}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Creator not found</h1>
          <p className="text-gray-600">The creator you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Convert Firestore Timestamp safely
  let joinedDate = "Unknown";
  try {
    if (creator.createdAt) {
      const dateObj =
        (creator.createdAt as any).toDate?.() || new Date(creator.createdAt);
      joinedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }
  } catch (err) {
    console.warn("Invalid createdAt format", creator.createdAt);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Creator Profile */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={creator.profileImage} alt={creator.name} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    {creator.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button onClick={handleConnect} size="lg" className="w-full md:w-auto">
                  <Mail className="mr-2 h-4 w-4" />
                  Connect via Email
                </Button>
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{creator.name}</h1>
                  <div className="flex items-center text-lg text-gray-600 mb-2">
                    <Instagram className="h-5 w-5 mr-2" />
                    <a
                      href={`https://instagram.com/${creator.instagramHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-purple-600 transition-colors flex items-center"
                    >
                      @{creator.instagramHandle}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    {creator.location}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <div className="font-semibold text-lg text-gray-900">
                      {creator.followerCount}
                    </div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <div className="font-semibold text-lg text-gray-900">
                      {joinedDate}
                    </div>
                    <div className="text-sm text-gray-600">Joined</div>
                  </div>
                </div>

                {/* Niche */}
                <div className="mb-4">
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-sm px-3 py-1">
                    {creator.niche}
                  </Badge>
                </div>
{/* Instagram Bio */}
<div className="mb-4">
  <h3 className="text-1xl font-bold text-gray-900 dark:text-gray-100">Instagram Bio</h3>
  <p className="text-gray-700 leading-relaxed">
    {creator.bio && creator.bio.trim() !== "" 
      ? creator.bio 
      : "No bio provided."}
  </p>
</div>

{/* About You */}
<div>
  <h3 className="text-1xl font-bold text-gray-900 dark:text-gray-100">About </h3>
  <p className="text-gray-700 leading-relaxed">
    {creator.about && creator.about.trim() !== "" 
      ? creator.about 
      : "No about info yet."}
  </p>
</div>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Similar Creators */}
        {similarCreators.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Similar Creators</CardTitle>
              <p className="text-gray-600">Other creators in the {creator.niche} niche</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarCreators.map((similarCreator) => (
                  <CreatorCard key={similarCreator.id} creator={similarCreator} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
