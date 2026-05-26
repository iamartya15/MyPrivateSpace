import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { env } from "@/lib/env";

type GoogleJwtPayload = {
  email?: string;
  name?: string;
};

export function AuthCard() {
  const { setUser } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canUseGoogle = Boolean(env.googleClientId);

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        toast.error("Google authentication failed");
        return;
      }
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);

      if (!decoded.email) {
        toast.error("Google account email is unavailable");
        return;
      }

      const user = { id: decoded.email, email: decoded.email };
      setUser(user);
      toast.success(decoded.name ? `Welcome ${decoded.name}!` : "Welcome!");
    } catch (error) {
      toast.error("Failed to process Google login");
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const key = `user:${email}`;
      const stored = localStorage.getItem(key);

      if (isSignup) {
        if (stored) {
          toast.error("Account already exists");
          return;
        }
        localStorage.setItem(key, password);
        const newUser = { id: email, email };
        setUser(newUser);
        toast.success("Account created!");
      } else {
        if (!stored || stored !== password) {
          toast.error("Invalid email or password");
          return;
        }
        const user = { id: email, email };
        setUser(user);
        toast.success("Welcome back!");
      }
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
      <div className="mb-6 text-center">
        <h2 className="font-display text-2xl font-medium">
          {isSignup ? "Create your account" : "Welcome back"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to access your private notes
        </p>
      </div>

      {canUseGoogle ? (
        <div className="mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
          />
        </div>
      ) : null}

      {canUseGoogle ? (
        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
        </div>
      ) : null}

      <form onSubmit={handleAuth} className="space-y-3">
        <Field icon={<Mail className="h-4 w-4" />}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <Field icon={<Lock className="h-4 w-4" />}>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSignup ? "Sign up" : "Sign in"}
        </button>
        <button
          type="button"
          onClick={() => setIsSignup((s) => !s)}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {isSignup
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>
  );
}

function Field({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-input bg-background px-3 py-2.5 focus-within:border-primary">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </div>
  );
}