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
        aria-label="Continue to Resume Tailor"
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
      </motion.button>
    </div>
  );
}
