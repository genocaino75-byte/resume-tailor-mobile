import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ChevronLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
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

export default function SignupScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError && EMAIL_REGEX.test(value)) setEmailError("");
  };

  const validatePassword = (value) => {
    if (value.length < 10) return "Password must be at least 10 characters.";
    const digitCount = (value.match(/[0-9]/g) || []).length;
    if (digitCount < 2) return "Password must contain at least 2 numbers.";
    return "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordError && !validatePassword(value)) setPasswordError("");
  };

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    const pwError = validatePassword(password);
    if (pwError) {
      setPasswordError(pwError);
      return;
    }
    setPasswordError("");
    setServerError("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/api/auth/signup`, { email, password });
      // Don't auto-login - account created successfully, but user must sign in
      navigate("/login");
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
          Create your account
        </h1>
        <p className="mb-8 text-sm" style={{ color: theme.mutedForeground }}>
          Start tailoring resumes that get you hired.
        </p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: theme.mutedForeground }} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full py-3.5 pl-11 pr-11 text-sm outline-none"
              style={{
                backgroundColor: theme.card,
                border: `2px solid ${theme.primary}`,
                borderRadius: theme.radius,
                color: theme.foreground,
                boxShadow: "0 4px 14px rgba(124,58,237,0.12)",
              }}
            />
            <img src="/tailor-icon.png" alt="" className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" style={{ border: `1.5px solid ${theme.primary}` }} />
          </div>

          <div>
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
            {emailError && <p className="text-xs mt-1.5 ml-1" style={{ color: "#DC2626" }}>{emailError}</p>}
          </div>

          <div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: theme.mutedForeground }} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password (min. 10 characters, 2 numbers)"
                className="w-full py-3.5 pl-11 pr-16 text-sm outline-none"
                style={{
                  backgroundColor: theme.card,
                  border: `2px solid ${passwordError ? "#DC2626" : theme.primary}`,
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
            {passwordError && <p className="text-xs mt-1.5 ml-1" style={{ color: "#DC2626" }}>{passwordError}</p>}
          </div>

          <p className="text-xs leading-relaxed" style={{ color: theme.mutedForeground }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

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
            {loading ? "Creating account..." : "Create Account"}
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
            onClick={() => alert("Google Sign-In is coming soon!")}
            className="w-full py-3.5 font-medium"
            style={{ backgroundColor: theme.secondary, borderRadius: theme.radius, color: theme.foreground }}
          >
            Continue with Google
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
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="font-bold" style={{ color: theme.primary }}>
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
