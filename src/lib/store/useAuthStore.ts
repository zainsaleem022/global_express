import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  token?: string;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  login: (user, token) => {
    console.log("Login called with user:", user ? user.name : "No user");
    set({ user, isAuthenticated: true, loading: false, token });
  },

  logout: async () => {
    console.log("Logout called");
    try {
      // Call the logout API to clear the cookie
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Important for cookies
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    console.log("checkAuth called");
    set({ loading: true });

    try {
      // Fetch user data from the server using the httpOnly cookie
      const response = await fetch("/api/auth/me", {
        credentials: "include", // Important for sending cookies
      });

      if (response.ok) {
        console.log("Auth check successful");
        const data = await response.json();
        set({ user: data.user, isAuthenticated: true });
      } else {
        console.log("Auth check failed with status:", response.status);
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },
}));
