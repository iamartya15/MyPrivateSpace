import { useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem("auth_user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();

    // Listen to storage changes (for login from other tabs/windows)
    window.addEventListener("storage", checkUser);

    // Custom event for same-tab updates
    window.addEventListener("auth-change", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("auth-change", checkUser);
    };
  }, []);

  const updateUser = (newUser: User | null) => {
    if (newUser) {
      localStorage.setItem("auth_user", JSON.stringify(newUser));
      setUser(newUser);
    } else {
      localStorage.removeItem("auth_user");
      setUser(null);
    }
    // Trigger event for other hooks
    window.dispatchEvent(new Event("auth-change"));
  };

  return {
    user,
    loading,
    signOut: () => updateUser(null),
    setUser: updateUser,
  };
}
