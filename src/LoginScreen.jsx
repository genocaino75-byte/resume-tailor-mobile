import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { ChevronLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const theme = {
  background: "#F9FAFB",
  foreground: "#3B0764",
  card: "#FFFFFF",
  primary: "#7C3AED",
  primaryDark: "#3B0764",
  secondary: "#F3F0FF",
  mutedForeground: "#6B7280",
  border: "#E5E7EB",
  radius: "0.5rem",
  fontSans: "'Sora', sans-serif",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError && EMAIL_REGEX.test(value)) setEmailError("");
  };

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // Initialize the Google Sign-In plugin once when the screen mounts
  useEffect(() => {
    SocialLogin.initialize({
      google: {
        webClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      },
    }).catch((err) => console.error("Failed to initialize Google Sign-In:", err));
  }, []);

  const handleGoogleSignIn = async () => {
    setServerError("");
    setGoogleLoading(true);

    try {
      const result = await SocialLogin.login({
        provider: "google",
        options: { scopes: ["email", "profile"] },
      });

      const idToken = result.result?.idToken;
      if (!idToken) {
        throw new Error("No ID token returned from Google");
      }

      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/api/auth/google`, { idToken });

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userEmail", response.data.user.email);
      navigate("/paywall");
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setServerError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setServerError("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userEmail", response.data.user.email);
      navigate("/paywall");
    } catch (err) {
      const message = err.response?.data?.error || "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
    >
      <header className="flex items-center px-5 pt-12 pb-6">
        <motion.button
          onClick={() => navigate(-1)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ x: -4 }}
          className="transition-opacity"
          style={{ color: theme.mutedForeground }}
        >
          <ChevronLeft size={24} />
        </motion.button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.foreground }}>
          Welcome back
        </h1>
        <p className="mb-8 text-sm" style={{ color: theme.mutedForeground }}>
          Log in to continue tailoring your resume.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: theme.mutedForeground }} />
            <input
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
              placeholder="Email address"
              className="w-full py-3.5 pl-11 pr-11 text-sm outline-none"
              style={{
                backgroundColor: theme.card,
                border: `2px solid ${emailError ? "#DC2626" : theme.primary}`,
                borderRadius: theme.radius,
                color: theme.foreground,
                boxShadow: "0 4px 14px rgba(124,58,237,0.12)",
              }}
            />
            <img src="/tailor-icon.png" alt="" className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" style={{ border: `1.5px solid ${theme.primary}` }} />
          </div>
          {emailError && (
            <p className="text-xs -mt-2 ml-1" style={{ color: "#DC2626" }}>{emailError}</p>
          )}

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: theme.mutedForeground }} />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full py-3.5 pl-11 pr-16 text-sm outline-none"
              style={{
                backgroundColor: theme.card,
                border: `2px solid ${theme.primary}`,
                borderRadius: theme.radius,
                color: theme.foreground,
                boxShadow: "0 4px 14px rgba(124,58,237,0.12)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-10 top-1/2 -translate-y-1/2"
              style={{ color: theme.mutedForeground }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <img src="/tailor-icon.png" alt="" className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" style={{ border: `1.5px solid ${theme.primary}` }} />
          </div>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-right text-xs"
            style={{ color: theme.mutedForeground }}
          >
            Forgot password?
          </button>

          {serverError && (
            <p className="text-xs text-center" style={{ color: "#DC2626" }}>
              {serverError}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 font-bold mt-2"
            style={{
              background: loading ? theme.secondary : `linear-gradient(135deg, ${theme.primaryDark}, ${theme.primary})`,
              color: loading ? theme.mutedForeground : "#ffffff",
              borderRadius: theme.radius,
              boxShadow: loading ? "none" : "0 8px 20px rgba(124,58,237,0.3)",
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </motion.button>
        </form>

        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
          <span className="text-xs" style={{ color: theme.mutedForeground }}>or continue with</span>
          <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
        </div>

        <div className="flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3.5 font-medium"
            style={{ backgroundColor: theme.secondary, borderRadius: theme.radius, color: theme.foreground }}
          >
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => alert("Apple Sign-In is coming soon!")}
            className="w-full py-3.5 font-medium"
            style={{ backgroundColor: theme.secondary, borderRadius: theme.radius, color: theme.foreground }}
          >
            Continue with Apple
          </motion.button>
        </div>

        <p className="text-center text-sm mt-8" style={{ color: theme.mutedForeground }}>
          Don't have an account?{" "}
          <button onClick={() => navigate("/signup")} className="font-bold" style={{ color: theme.primary }}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
