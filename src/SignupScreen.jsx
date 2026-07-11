import { useState } from "react";
import { motion } from "framer-motion";
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
  fontSans: "'Inter', sans-serif",
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

  const handleSignup = (e) => {
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
    navigate("/home");
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
    >
      <header className="flex items-center px-5 pt-12 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="hover:opacity-70 transition-opacity"
          style={{ color: theme.mutedForeground }}
        >
          <ChevronLeft size={24} />
        </button>
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
              className="w-full py-3.5 pl-11 pr-4 text-sm outline-none"
              style={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.radius,
                color: theme.foreground,
              }}
            />
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
                className="w-full py-3.5 pl-11 pr-4 text-sm outline-none"
                style={{
                  backgroundColor: theme.card,
                  border: `1px solid ${emailError ? "#DC2626" : theme.border}`,
                  borderRadius: theme.radius,
                  color: theme.foreground,
                }}
              />
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
                className="w-full py-3.5 pl-11 pr-11 text-sm outline-none"
                style={{
                  backgroundColor: theme.card,
                  border: `1px solid ${passwordError ? "#DC2626" : theme.border}`,
                  borderRadius: theme.radius,
                  color: theme.foreground,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: theme.mutedForeground }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && <p className="text-xs mt-1.5 ml-1" style={{ color: "#DC2626" }}>{passwordError}</p>}
          </div>

          <p className="text-xs leading-relaxed" style={{ color: theme.mutedForeground }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-4 font-bold mt-2"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryDark}, ${theme.primary})`,
              color: "#ffffff",
              borderRadius: theme.radius,
              boxShadow: "0 8px 20px rgba(124,58,237,0.3)",
            }}
          >
            Create Account
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
            onClick={() => navigate("/home")}
            className="w-full py-3.5 font-medium"
            style={{ backgroundColor: theme.secondary, borderRadius: theme.radius, color: theme.foreground }}
          >
            Continue with Google
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/home")}
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
