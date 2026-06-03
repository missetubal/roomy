interface AuthState {
  isSignedIn: boolean;
  username: string | null;
  userId: string | null;
}

type AuthContext = {
  isSignedIn: boolean;
  username: string | null;
  userId: string | null;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
  refreshAuthState: () => Promise<boolean>;
};
