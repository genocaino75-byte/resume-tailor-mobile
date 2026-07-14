import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { History, Home, ArrowLeft, Settings } from "lucide-react";

const theme = {
  background: "#F9FAFB",
  foreground: "#3B0764",
  card: "#FFFFFF",
  primary: "#7C3AED",
  primaryDark: "#3B0764",
  accentYellow: "#FBBF24",
  secondary: "#F3F0FF",
  mutedForeground: "#6B7280",
  border: "#E5E7EB",
  radius: "0.75rem",
  fontSans: "'Inter', sans-serif",
};

const NAV_ITEMS = [
  { id: "tailor", label: "Tailor", icon: null, path: "/tailor", image: true },
  { id: "history", label: "History", icon: History, path: "/profile", image: false },
  { id: "back", label: "Back", icon: ArrowLeft, path: "/login", image: false },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pulsingId, setPulsingId] = useState(null);

  const handleNavClick = (item) => {
    setPulsingId(item.id);
    setTimeout(() => navigate(item.path), 180);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
    >
      {/* Header */}
      <header
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 60%, #A855F7 100%)" }}
      >
        <div className="flex items-center gap-3">
          <img src="/tailor-icon.png" alt="" className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
              AI Resume{" "}
              <span className="relative inline-block">
                Tailor
                <svg
                  width="52"
                  height="8"
                  viewBox="0 0 52 8"
                  className="absolute left-0"
                  style={{ bottom: "-4px" }}
                >
                  <path
                    d="M0 4 Q 6.5 0, 13 4 T 26 4 T 39 4 T 52 4"
                    stroke={theme.accentYellow}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-[11px] text-white/80 mt-0.5">Powered by Claude AI</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/settings")}
          style={{ color: "#ffffff" }}
          aria-label="Settings"
        >
          <Settings size={22} />
        </button>
      </header>

      {/* Content */}
      <div className="px-5 py-6 space-y-6 flex-1 pb-24">
        <section>
          <h2 className="text-3xl font-semibold tracking-tight" style={{ color: theme.foreground }}>
            Welcome back.
          </h2>
          <p className="text-base mt-1" style={{ color: theme.mutedForeground }}>
            Let's refine your career narrative.
          </p>
        </section>

        <section>
          <button
            onClick={() => navigate("/tailor")}
            className="relative group overflow-hidden w-full"
            style={{ borderRadius: theme.radius }}
          >
            <div
              className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(135deg, ${theme.primaryDark}, ${theme.primary} 60%, #A855F7)` }}
            />
            <div className="relative px-6 py-12 flex flex-col items-center justify-center gap-4">
              <motion.div
                className="w-24 h-24 flex items-center justify-center overflow-hidden"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src="/tailor-icon.png" alt="" className="w-24 h-24" style={{ objectFit: "contain" }} />
              </motion.div>
              <div className="text-center">
                <h3 className="font-semibold text-xl text-white">Tailor to JD</h3>
                <p className="text-sm mt-0.5 text-white/80">
                  AI-powered optimization
                </p>
              </div>
            </div>
          </button>
        </section>
      </div>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 w-full h-20 flex justify-around items-center border-t"
        style={{ backgroundColor: theme.card + "f2", backdropFilter: "blur(8px)", borderColor: theme.border }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center gap-1.5"
              style={{ color: isActive ? theme.primary : theme.mutedForeground }}
            >
              {item.image ? (
                <motion.img
                  src="/tailor-icon.png"
                  alt=""
                  className="rounded-full"
                  style={{
                    width: "38px",
                    height: "38px",
                    objectFit: "cover",
                    border: `3px solid ${theme.primary}`,
                    opacity: isActive ? 1 : 0.55,
                  }}
                  animate={pulsingId === item.id || isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                />
              ) : (
                <motion.div
                  animate={pulsingId === item.id || isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <Icon size={38} style={{ border: `3px solid ${theme.primary}`, borderRadius: "9999px", padding: "5px" }} />
                </motion.div>
              )}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
