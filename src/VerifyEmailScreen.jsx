import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { MailCheck, Loader2, ArrowLeft } from "lucide-react";

const theme = {
  background: "#F9FAFB",
  foreground: "#3B0764",
  card: "#FFFFFF",
  primary: "#7C3AED",
  primaryDark: "#3B0764",
  secondary: "#F3F0FF",
  mutedForeground: "#6B7280",
  border: "#E5E7EB",
  radius: "0.75rem",
  fontSans: "'Sora', sans-serif",
};

const API_URL = import.meta.env.VITE_API_URL;

export default function VerifyEmailScreen() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail") || "your email";

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleResend = async () => {
    setMessage("");
    setIsError(false);
    setSending(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${API_URL}/api/auth/resend-verification`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data?.message || "Verification email sent. Check your inbox.");
      setIsError(false);
    } catch (err) {
      console.error("Resend verification failed:", err);
      if (err.response?.status === 401) {
        setMessage("Your session has expired. Please log in again.");
      } else {
        setMessage(err.response?.data?.error || "Couldn't send the email. Please try again.");
      }
      setIsError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
    >
      <header
        className="sticky top-0 z-10 px-4 py-2.5 flex items-center gap-2.5"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.625rem)" }}
      >
        <motion.button
          onClick={() => navigate("/home")}
          whileTap={{ scale: 0.9 }}
          style={{ color: theme.mutedForeground }}
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </motion.button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center -mt-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: theme.secondary }}
        >
          <MailCheck size={38} color={theme.primary} strokeWidth={1.75} />
        </motion.div>

        <h1 className="text-xl font-bold mb-2" style={{ color: theme.foreground }}>
          Verify your email
        </h1>
        <p className="text-sm mb-1 max-w-xs" style={{ color: theme.mutedForeground }}>
          We sent a verification link to{" "}
          <strong style={{ color: theme.foreground }}>{email}</strong>. Tap the link in
          that email to unlock your free tailors.
        </p>
        <p className="text-xs mb-7 max-w-xs" style={{ color: theme.mutedForeground }}>
          Can't find it? Check your spam folder, then resend below.
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleResend}
          disabled={sending}
          className="w-full max-w-xs py-3.5 font-semibold text-sm flex items-center justify-center gap-2 mb-3"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryDark}, ${theme.primary})`,
            color: "#ffffff",
            borderRadius: theme.radius,
            boxShadow: "0 6px 16px rgba(124,58,237,0.28)",
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            "Resend verification email"
          )}
        </motion.button>

        {message && (
          <p
            className="text-xs mb-3 max-w-xs"
            style={{ color: isError ? "#DC2626" : "#059669" }}
          >
            {message}
          </p>
        )}

        <button
          onClick={() => navigate("/home")}
          className="text-sm font-medium"
          style={{ color: theme.mutedForeground }}
        >
          Back to home
        </button>
      </main>
    </div>
  );
}
