// auth.js
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as authSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "./firebase";  // ← the one true source of your initialized auth

function useFirebaseAuth() {
  const [authUser,  setAuthUser]   = useState(null);
  const [isLoading, setIsLoading]  = useState(true);

  const clear = () => {
    setAuthUser(null);
    setIsLoading(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser({ uid: user.uid, email: user.email });
        setIsLoading(false);
      } else {
        clear();
      }
    });
    return () => unsub();
  }, []);

  const signIn = (email, password) => {
    setIsLoading(true);
    return signInWithEmailAndPassword(auth, email, password)
      .finally(() => setIsLoading(false));
  };

  const signUp = (email, password) => {
    setIsLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
      .finally(() => setIsLoading(false));
  };

  const signOut = () => authSignOut(auth).then(clear);

  return { authUser, isLoading, signIn, signUp, signOut };
}

const AuthUserContext = createContext({
  authUser:  null,
  isLoading: true,
  signIn:    async () => {},
  signUp:    async () => {},
  signOut:   async () => {}
});

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>
      {children}
    </AuthUserContext.Provider>
  );
}

export const useAuth = () => useContext(AuthUserContext);
