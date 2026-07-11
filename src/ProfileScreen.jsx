import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FileText, Clock, History, Home } from "lucide-react";

const theme = {
  background: "#F9FAFB",
  foreground: "#3B0764",
  card: "#FFFFFF",
  primary: "#7C3AED",
  secondary: "#F3F0FF",
  mutedForeground: "#6B7280",
  border: "#E5E7EB",
  radius: "0.5rem",
  fontSans: "'Inter', sans-serif",
};

const API_URL = import.meta.env.VITE_API_URL;

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, path: "/home", image: false },
  { id: "tailor", label: "Tailor", icon: null, path: "/tailor", image: true },
  { id: "history", label: "History", icon: History, path: "/profile", image: false },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/resumes`);
        setHistory(response.data);
      } catch (err) {
        console.error("Failed to load history:", err);
        setError("Couldn't load your resume history.");
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
    >
      <header
        className="sticky top-0 z-10 backdrop-blur-md border-b px-4 py-2.5"
        style={{ backgroundColor: theme.background + "cc", borderColor: theme.border }}
      >
        <h1 className="text-base font-semibold tracking-tight" style={{ color: theme.foreground }}>
          Resume History
        </h1>
      </header>

      <main className="flex-1 p-4 space-y-2.5 overflow-y-auto pb-24">
        {loading && (
          <p className="text-center text-xs py-6" style={{ color: theme.mutedForeground }}>
            Loading your saved resumes...
          </p>
        )}

        {!loading && error && (
          <p className="text-center text-xs py-6" style={{ color: "#DC2626" }}>
            {error}
          </p>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="text-center py-10 space-y-1.5">
            <FileText size={28} className="mx-auto" style={{ color: theme.mutedForeground }} />
            <p className="text-xs" style={{ color: theme.mutedForeground }}>
              No saved resumes yet.
            </p>
          </div>
        )}

        {!loading &&
          history.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                navigate("/results", {
                  state: {
                    tailoredResume: item.tailored,
                    originalResume: item.original,
                  },
                })
              }
              className="w-full text-left p-3 flex items-center gap-2.5"
              style={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.radius,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme.secondary }}
              >
                <FileText size={14} style={{ color: theme.primary }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium truncate" style={{ color: theme.foreground }}>
                  {item.job_title || "Untitled Resume"}
                </h3>
                <div className="text-[10px] flex items-center gap-1" style={{ color: theme.mutedForeground }}>
                  <Clock size={9} />
                  {formatDate(item.created_at)}
                </div>
              </div>
            </button>
          ))}
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 w-full h-16 flex justify-around items-center border-t"
        style={{ backgroundColor: theme.card + "f2", backdropFilter: "blur(8px)", borderColor: theme.border }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1"
              style={{ color: isActive ? theme.primary : theme.mutedForeground }}
            >
              {item.image ? (
                <motion.img
                  src="/tailor-icon.png"
                  alt=""
                  className="rounded-full"
                  style={{
                    width: "26px",
                    height: "26px",
                    objectFit: "cover",
                    border: `2px solid ${theme.primary}`,
                    opacity: isActive ? 1 : 0.55,
                  }}
                  animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <Icon size={26} style={{ border: `2px solid ${theme.primary}`, borderRadius: "9999px", padding: "3px" }} />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
