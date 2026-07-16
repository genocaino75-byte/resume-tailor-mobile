import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ChevronLeft, Mail, MailCheck } from "lucide-react";

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
const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      console.error("Forgot password request failed:", err);
      setEmailError("Something went wrong. Please try again.");
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
          style={{ color: theme.mutedForeground }}
        >
          <ChevronLeft size={24} />
        </motion.button>
      </header>

      <div className="flex-1 px-6 pb-8">
        {sent ? (
          <div className="flex flex-col items-center text-center pt-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: theme.secondary }}
            >
              <MailCheck size={30} color={theme.primary} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: theme.foreground }}>
              Check your email
            </h1>
            <p className="text-sm mb-8" style={{ color: theme.mutedForeground }}>
              If an account exists for <strong>{email}</strong>, we've sent a link to reset your password. The link expires in 1 hour.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="w-full py-4 font-bold"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryDark}, ${theme.primary})`,
                color: "#ffffff",
                borderRadius: theme.radius,
              }}
            >
              Back to Log In
            </motion.button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.foreground }}>
              Forgot password?
            </h1>
            <p className="mb-8 text-sm" style={{ color: theme.mutedForeground }}>
              Enter your email and we'll send you a link to reset it.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: theme.mutedForeground }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError && EMAIL_REGEX.test(e.target.value)) setEmailError("");
                  }}
                  placeholder="Email address"
                  className="w-full py-3.5 pl-11 pr-4 text-sm outline-none"
                  style={{
                    backgroundColor: theme.card,
                    border: `2px solid ${emailError ? "#DC2626" : theme.primary}`,
                    borderRadius: theme.radius,
                    color: theme.foreground,
                    boxShadow: "0 4px 14px rgba(124,58,237,0.12)",
                  }}
                />
              </div>
              {emailError && (
                <p className="text-xs -mt-2 ml-1" style={{ color: "#DC2626" }}>{emailError}</p>
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
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
