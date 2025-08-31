
/*'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Creator, NICHES } from '@/types/creator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';

const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
const REDIRECT_URI = "http://localhost:3000/api/auth/callback/instagram";

export function ProfileForm() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState<Partial<Creator>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingIG, setIsFetchingIG] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const docRef = doc(db, 'creators', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Creator;

        // prevent junk like "hi"
        setProfile({
          ...data,
          instagramHandle:
            data.instagramHandle && data.instagramHandle !== "hi"
              ? data.instagramHandle
              : "",
        });
      } else {
        setProfile({
          name: user.displayName || '',
          email: user.email || '',
          profileImage: user.photoURL || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Facebook login for Graph API
  const handleInstagramLogin = () => {
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights&response_type=code`;
    window.location.href = authUrl;
  };

  // After redirect back from callback
  useEffect(() => {
    const token = searchParams.get("token");
    const warn = searchParams.get("warn");

    if (warn === "missing_scopes") {
      toast({
        title: "Permissions Warning",
        description:
          "Some permissions were not granted. If username fetch fails, reconnect and approve all requested permissions.",
      });
    }

    if (!token) return;

    const fetchUsername = async () => {
      try {
        setIsFetchingIG(true);
        const res = await fetch(`/api/auth/callback/instagram/username?access_token=${token}`);
        const data = await res.json();
        console.log("IG username response:", data);

        if (res.ok && data.username) {
          setProfile((prev) => ({
            ...prev,
            instagramHandle: data.username,
            followerCount: data.followers_count ?? prev.followerCount,
            // ✅ overwrite even if it's an empty string
            bio: data.biography ?? "",
          }));
        
          toast({
            title: "Instagram Connected",
            description: `Fetched username: ${data.username}`,
          });
        } else {
          toast({
            title: "Failed to fetch username",
            description:
              data?.error ??
              "No Instagram business account found for your Facebook Page.",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.error("Error fetching username:", err);
        toast({
          title: "Error",
          description: err.message || "Unable to fetch username",
          variant: "destructive",
        });
      } finally {
        setIsFetchingIG(false);
        router.replace("/profile"); // clean query string
      }
    };

    fetchUsername();
  }, [searchParams, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const creatorData: Creator = {
        id: user.uid,
        uid: user.uid,
        name: profile.name || '',
        email: profile.email || user.email || '',
        instagramHandle: profile.instagramHandle || '',
        niche: profile.niche || '',
        followerCount: Number(profile.followerCount) || 0,
        location: profile.location || '',
        bio: profile.bio || '',
        profileImage: profile.profileImage || user.photoURL || '',
        createdAt: profile.createdAt || new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'creators', user.uid), creatorData);

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

           
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle *</Label>
              {profile.instagramHandle ? (
                <div className="px-3 py-2 rounded-md border bg-gray-50 text-gray-700">
                  @{profile.instagramHandle}
                </div>
              ) : (
                <div className="px-3 py-2 rounded-md border border-dashed text-gray-400">
                  Not connected
                </div>
              )}
            </div>
          </div>

          
          <Button
            type="button"
            variant="outline"
            onClick={handleInstagramLogin}
            disabled={isFetchingIG}
            className="w-full flex items-center justify-center space-x-2"
          >
            {isFetchingIG ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Instagram className="h-4 w-4" />
            )}
            <span>{isFetchingIG ? "Fetching username..." : "Fetch Instagram Username"}</span>
          </Button>

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Niche *</Label>
              <Select
                value={profile.niche || ''}
                onValueChange={(value) =>
                  setProfile({ ...profile, niche: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your niche" />
                </SelectTrigger>
                <SelectContent>
                  {NICHES.map((niche) => (
                    <SelectItem key={niche} value={niche}>
                      {niche}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Follower Count *</Label>
              <Input
                type="number"
                value={profile.followerCount?.toString() || ''}
                onChange={(e) =>
                  setProfile({ ...profile, followerCount: Number(e.target.value) })
                }
              />
            </div>
          </div>

          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              required
              placeholder="City, Country"
              value={profile.location || ''}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
            />
          </div>

          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              required
              placeholder="Tell other creators about yourself..."
              rows={4}
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} */
'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Creator, NICHES } from '@/types/creator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';

const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
const REDIRECT_URI = "http://localhost:3000/api/auth/callback/instagram";

export function ProfileForm() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState<Partial<Creator>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingIG, setIsFetchingIG] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const docRef = doc(db, 'creators', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data() as Creator);
      } else {
        setProfile({
          name: user.displayName || '',
          email: user.email || '',
          profileImage: user.photoURL || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Facebook Login for Graph API
  const handleInstagramLogin = () => {
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights&response_type=code`;
    window.location.href = authUrl;
  };

  // After redirect back from /api/auth/callback/instagram
  useEffect(() => {
    const token = searchParams.get("token");
    const warn = searchParams.get("warn");

    if (warn === "missing_scopes") {
      toast({
        title: "Permissions Warning",
        description:
          "Some permissions were not granted. If username fetch fails, reconnect and approve all requested permissions.",
      });
    }

    if (!token) return;

    const fetchInstagramData = async () => {
      try {
        setIsFetchingIG(true);
        const res = await fetch(`/api/auth/callback/instagram/username?access_token=${token}`);
        const data = await res.json();
        console.log("IG API response:", data);

        if (res.ok && data.username) {
          setProfile((prev) => ({
            ...prev,
            instagramHandle: data.username,
            followerCount: data.followers_count ?? 0,
            bio: data.biography ?? "",
          }));
          toast({
            title: "Instagram Connected",
            description: `Fetched @${data.username}`,
          });
        } else {
          toast({
            title: "Failed to fetch Instagram data",
            description: data?.error ?? "No Instagram business account found.",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.error("Error fetching IG data:", err);
        toast({
          title: "Error",
          description: err.message || "Unable to fetch IG data",
          variant: "destructive",
        });
      } finally {
        setIsFetchingIG(false);
        router.replace("/profile");
      }
    };

    fetchInstagramData();
  }, [searchParams, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const creatorData: Creator = {
        id: user.uid,
        uid: user.uid,
        name: profile.name || '',
        email: profile.email || user.email || '',
        instagramHandle: profile.instagramHandle || '',
        niche: profile.niche || '',
        followerCount: Number(profile.followerCount) || 0,
        location: profile.location || '',
        bio: profile.bio || '', // IG bio
        about: profile.about || '', // ✅ "About You"
        profileImage: profile.profileImage || user.photoURL || '',
        createdAt: profile.createdAt || new Date(),
        updatedAt: new Date(),
      };

      // ✅ merge so it doesn't overwrite other fields accidentally
      await setDoc(doc(db, 'creators', user.uid), creatorData, { merge: true });

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram Handle *</Label>
              <Input
                value={profile.instagramHandle ? `@${profile.instagramHandle}` : ''}
                readOnly
              />
            </div>
          </div>

          {/* Instagram Connect Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleInstagramLogin}
            disabled={isFetchingIG}
            className="w-full flex items-center justify-center space-x-2"
          >
            {isFetchingIG ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Instagram className="h-4 w-4" />
            )}
            <span>{isFetchingIG ? "Fetching data..." : "Fetch Instagram Data"}</span>
          </Button>

          {/* Niche and Followers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {/* Niche (dropdown + custom input) */}
<div className="space-y-2">
  <Label>Niche *</Label>
  <Select
    value={profile.niche && !NICHES.includes(profile.niche) ? "other" : profile.niche}
    onValueChange={(value) => {
      if (value === "other") {
        setProfile({ ...profile, niche: "" }); // reset so user can type
      } else {
        setProfile({ ...profile, niche: value });
      }
    }}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select your niche" />
    </SelectTrigger>
    <SelectContent>
      {NICHES.map((niche) => (
        <SelectItem key={niche} value={niche}>
          {niche}
        </SelectItem>
      ))}
      <SelectItem value="other">Other (write your own)</SelectItem>
    </SelectContent>
  </Select>

  {/* Custom niche input, only show if "Other" selected */}
  {(!profile.niche || !NICHES.includes(profile.niche)) && (
    <Input
      type="text"
      placeholder="Enter your niche"
      value={profile.niche || ""}
      onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
    />
  )}
</div>

            <div className="space-y-2">
              <Label>Follower Count</Label>
              <Input
                type="number"
                value={profile.followerCount?.toString() || ''}
                readOnly
              />
            </div>
          </div>

          {/* Instagram Bio (read-only) */}
          <div className="space-y-2">
            <Label>Instagram Bio</Label>
            <Textarea
              value={profile.bio || ''}
              readOnly
              rows={3}
            />
          </div>

          {/* About You (editable) */}
          <div className="space-y-2">
            <Label htmlFor="about">About You *</Label>
            <Textarea
              id="about"
              required
              placeholder="Tell other creators about yourself..."
              rows={4}
              value={profile.about || ''}
              onChange={(e) => setProfile({ ...profile, about: e.target.value })}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              required
              placeholder="City, Country"
              value={profile.location || ''}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
            />
          </div>

          <Button type="submit" disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
