import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const theme = {
  background: "#ffffff",
  primary: "#7C3AED",
  primaryDark: "#3B0764",
  accentYellow: "#FBBF24",
  radius: "0.5rem",
  fontSans: "'Inter', sans-serif",
};

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-screen overflow-hidden flex flex-col"
      style={{
        backgroundColor: theme.background,
        color: theme.primary,
        fontFamily: theme.fontSans,
      }}
    >
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <motion.img
            src="/tailor-icon.png"
            alt=""
            className="w-24 h-32 mx-auto mb-6"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ objectFit: "contain", filter: "drop-shadow(0 10px 20px rgba(124,58,237,0.25))" }}
          />

          <h1 className="text-4xl font-bold mb-3 leading-tight tracking-tight" style={{ color: theme.primary }}>
            Land Your Next Role
          </h1>
          <p className="text-lg px-4 leading-relaxed" style={{ color: theme.primary, opacity: 0.75 }}>
            AI-powered resume tailoring that matches your experience to any job description.
          </p>
        </motion.div>

        <div className="w-full space-y-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/home")}
            className="w-full py-4 font-bold text-lg"
            style={{
              backgroundColor: theme.primary,
              color: "#ffffff",
              borderRadius: theme.radius,
              boxShadow: "0 8px 20px rgba(124,58,237,0.3)",
            }}
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </div>
  );
}
