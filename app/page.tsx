'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Search, 
  MessageCircle, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { RoleSelectionModal } from "@/components/RoleSelectionModal";

// 🔑 Firebase
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function HomePage() {
  const { user } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const router = useRouter();

  // ✅ Handle role selection + login
  const handleRoleSelect = async (role: "creator" | "brand") => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Save role in Firestore
      await setDoc(
        doc(db, "users", firebaseUser.uid),
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role,
        },
        { merge: true }
      );

      // Redirect based on role
      if (role === "creator") {
        router.push("/profile");
      } else {
        router.push("/brand/profile");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setShowRoleModal(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect with Creators
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Find and collaborate with like-minded content creators for sponsorships, 
              partnerships, and creative projects. Build your network and grow together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link href="/directory">
                    <Button size="lg" className="h-14 px-8 text-lg">
                      <Search className="mr-2 h-5 w-5" />
                      Browse Creators
                    </Button>
                  </Link>

                  {/* ✅ Only show "My Profile" if user is a creator */}
                  {user.role === 'creator' && (
                    <Link href="/profile">
                      <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                        <Users className="mr-2 h-5 w-5" />
                        My Profile
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg"
                  onClick={() => setShowRoleModal(true)} // ✅ open modal
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">
              How CreatorConnect Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to discover, connect, and collaborate with creators in your niche
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create Your Profile
                </h3>
                <p className="text-gray-600">
                  Set up your creator profile with your Instagram handle, niche, 
                  follower count, and collaboration interests.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Discover Creators
                </h3>
                <p className="text-gray-600">
                  Browse and filter creators by niche, follower count, location, 
                  and find perfect collaboration matches.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Connect & Collaborate
                </h3>
                <p className="text-gray-600">
                  Reach out directly via email to discuss partnerships, 
                  sponsorships, and creative collaborations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Ready to start Collaborating?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of creators already using CreatorConnect to find 
              their next collaboration partner.
            </p>

            {!user && (
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg"
                onClick={() => setShowRoleModal(true)} // ✅ open modal here too
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ✅ Role Selection Modal */}
      <RoleSelectionModal
        open={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSelect={handleRoleSelect}
      />
    </div>
  );
}
