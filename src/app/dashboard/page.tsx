'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) router.push('/login'); // Not signed in
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Build Lab Academy"
                width={120}
                height={48}
                className="h-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-gray-700">
                  Welcome, {session.user?.name || session.user?.email}!
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to BuildLab Academy Dashboard!
              </h1>
              <p className="text-gray-600 mb-6">
                You have successfully logged in with Google OAuth.
              </p>
              
              <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">Your Profile Information</h2>
                <div className="space-y-2 text-left">
                  <p><strong>Email:</strong> {session.user?.email}</p>
                  <p><strong>Name:</strong> {session.user?.name}</p>
                  <p><strong>Provider:</strong> Google OAuth</p>
                  <p><strong>Login Time:</strong> {new Date().toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-gray-500 text-sm">
                  🎉 Google OAuth is working perfectly! You can now build out your application features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
