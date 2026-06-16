'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getDocument } from '@/lib/firestore';

const AuthContext = createContext({
  user: null,
  userProfile: null,
  loading: true,
  setUserProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Fetch additional user data from Firestore
          const profile = await getDocument('users', firebaseUser.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            // Fallback for new Google users who haven't selected a role yet
            setUserProfile({ role: 'guest', isNew: true });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
