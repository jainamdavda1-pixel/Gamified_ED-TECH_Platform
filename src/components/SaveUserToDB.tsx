'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

export default function SaveUserToDB() {
  const { user, isLoaded, isSignedIn } = useUser();
  const hasSaved = useRef(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !hasSaved.current) {
      hasSaved.current = true;
      const saveUser = async () => {
        try {
          await fetch('/api/create-user', {
            method: 'POST',
          });
        } catch (error) {
          console.error('Failed to save user to DB:', error);
        }
      };

      saveUser();
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}
