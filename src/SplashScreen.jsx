import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const theme = {
  background: "#ffffff",
  primary: "#7C3AED",
  primaryDark: "#3B0764",
  fontSans: "'Inter', sans-serif",
};

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: theme.background,
        color: theme.primaryDark,
        fontFamily: theme.fontSans,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-5"
      >
        <motion.img
          src="/tailor-icon.png"
          alt="Resume Tailor"
          className="w-32 h-44"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 10px 20px rgba(124,58,237,0.25))", objectFit: "contain" }}
        />
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: theme.primary }}>
          Resume Tailor
        </h1>
      </motion.div>

      <motion.button
        onClick={() => navigate("/welcome")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ x: 4 }}
        className="absolute bottom-10 right-10 flex items-center justify-center rounded-full"
        style={{
          width: "52px",
          height: "52px",
          border: `3px solid ${theme.primary}`,
          backgroundColor: "rgba(124,58,237,0.08)",
        }}
        aria-label="Continue"
      >
        <ArrowRight size={22} strokeWidth={2.75} color={theme.primary} />
      </motion.button>
    </div>
  );
}