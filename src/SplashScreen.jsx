import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const theme = {
  background: "#ffffff",
  primary: "#7C3AED",
  primaryDark: "#3B0764",
  fontSans: "'Sora', sans-serif",
};

export default function SplashScreen() {
  const navigate = useNavigate();

  // Auto-advance to the welcome screen so the app never appears stuck on the
  // splash. Tapping the icon still skips ahead immediately.
  useEffect(() => {
    const timer = setTimeout(() => navigate("/welcome"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: theme.background,
        color: theme.primaryDark,
        fontFamily: theme.fontSans,
      }}
    >
      <motion.button
        onClick={() => navigate("/welcome")}
        whileTap={{ scale: 0.94 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-5"
        aria-label="Continue to Resume Tailored to JD"
      >
        <motion.img
          src="/tailor-icon.png"
          alt="Resume Tailored to JD"
          className="w-32 h-44"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 10px 20px rgba(124,58,237,0.25))", objectFit: "contain" }}
        />
        <h1 className="text-2xl font-bold tracking-tight text-center" style={{ color: theme.primary }}>
          Resume Tailored to JD
        </h1>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-16 text-sm"
        style={{ color: theme.primary }}
      >
        Tap to continue
      </motion.p>
    </div>
  );
}
