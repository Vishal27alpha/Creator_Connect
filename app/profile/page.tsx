'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { ProfileForm } from '@/components/profile/ProfileForm';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
            <p className="text-gray-600">
              Complete your profile to connect with other creators
            </p>
          </div>
          <ProfileForm />
        </div>
      </div>
    </AuthGuard>
  );
}