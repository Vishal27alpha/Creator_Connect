/*'use client';

import Link from 'next/link';
import { Creator } from '@/types/creator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, ExternalLink } from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
      <Link href={`/creator/${creator.id}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={creator.profileImage} alt={creator.name} />
              <AvatarFallback className="text-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                {creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground">{creator.name}</h3>

              <p className="text-sm text-gray-600 flex items-center mt-1">
                <ExternalLink className="h-3 w-3 mr-1" />
                @{creator.instagramHandle}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Users className="h-4 w-4 mr-1" />
                {creator.followerCount} followers
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {creator.location}
            </div>
            
            <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
              {creator.niche}
            </Badge>
            
            <p className="text-sm text-gray-600 line-clamp-3">
              {creator.bio}
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}*/
'use client';

import Link from 'next/link';
import { Creator } from '@/types/creator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, ExternalLink, MapPin } from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
      <Link href={`/creator/${creator.id}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={creator.profileImage} alt={creator.name} />
              <AvatarFallback className="text-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                {creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground">{creator.name}</h3>

              <p className="text-sm text-gray-600 flex items-center mt-1">
                <ExternalLink className="h-3 w-3 mr-1" />
                @{creator.instagramHandle}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Users className="h-4 w-4 mr-1" />
                {creator.followerCount} followers
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {creator.location}
            </div>

            <Badge
              variant="secondary"
              className="bg-purple-50 text-purple-700 hover:bg-purple-100"
            >
              {creator.niche}
            </Badge>

            {/* Bio */}
            {creator.bio && (
              <p className="text-sm text-gray-600 line-clamp-3">{creator.bio}</p>
            )}

            {/* About You (new) */}
            {creator.about && (
              <p className="text-sm text-gray-600 italic line-clamp-3">
                About: {creator.about}
              </p>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
