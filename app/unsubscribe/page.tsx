// app/unsubscribe/page.tsx
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UnsubscribePage() {
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const handleUnsubscribe = async () => {
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe');
      }

      setIsUnsubscribed(true);
    } catch (error) {
      setError('An error occurred while unsubscribing. Please try again.');
    }
  };

  if (!id) {
    return <div>Invalid unsubscribe link</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Unsubscribe from our mailing list
          </h2>
        </div>
        {!isUnsubscribed ? (
          <div>
            <p className="mt-2 text-center text-sm text-gray-600">
              Are you sure you want to unsubscribe?
            </p>
            <div className="mt-5">
              <button
                onClick={handleUnsubscribe}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Confirm Unsubscribe
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-center text-sm text-gray-600">
            You have been successfully unsubscribed.
          </p>
        )}
        {error && (
          <p className="mt-2 text-center text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}