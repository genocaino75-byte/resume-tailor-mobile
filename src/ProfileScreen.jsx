import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FileText, Clock, History, Home, Trash2, LogOut, ArrowLeft } from "lucide-react";

const theme = {
  background: "#F9FAFB",
  foreground: "#3B0764",
  card: "#FFFFFF",
  primary: "#7C3AED",
  secondary: "#F3F0FF",
  mutedForeground: "#6B7280",
  border: "#E5E7EB",
  radius: "0.5rem",
  fontSans: "'Sora', sans-serif",
};

const API_URL = import.meta.env.VITE_API_URL;

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, path: "/home", image: false },
  { id: "tailor", label: "Tailor", icon: null, path: "/tailor", image: true },
  { id: "back", label: "Back", icon: ArrowLeft, path: null, image: false },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pulsingId, setPulsingId] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to load history:", err);
      setError("Couldn't load your resume history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // don't trigger the card's own onClick (navigate to view)
    if (!window.confirm("Delete this saved resume? This can't be undone.")) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/api/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete resume:", err);
      alert("Couldn't delete that resume. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleNavClick = (item) => {
    setPulsingId(item.id);
    setTimeout(() => {
      if (item.path === null) {
        navigate(-1);
      } else {
        navigate(item.path);
      }
    }, 180);
  };

  const handleLogout = () => {
    if (!window.confirm("Log out of your account?")) return;
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

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
        className="sticky top-0 z-10 backdrop-blur-md border-b px-4 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: theme.background + "cc", borderColor: theme.border }}
      >
        <h1 className="text-base font-semibold tracking-tight" style={{ color: theme.foreground }}>
          Resume History
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ color: theme.primary, backgroundColor: theme.primary + "14" }}
        >
          <LogOut size={14} />
          Log Out
        </button>
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
            <div
              key={item.id}
              onClick={() =>
                navigate("/results", {
                  state: {
                    tailoredResume: item.tailored,
                    originalResume: item.original,
                  },
                })
              }
              className="w-full text-left p-3 flex items-center gap-2.5 cursor-pointer"
              style={{
                backgroundColor: theme.card,
                border: `2px solid ${theme.primary}`,
                borderRadius: theme.radius,
                boxShadow: "0 4px 14px rgba(124,58,237,0.12)",
              }}
            >
              <img
                src="/tailor-icon.png"
                alt=""
                className="w-8 h-8 rounded-lg flex-shrink-0"
                style={{ objectFit: "cover", border: `1.5px solid ${theme.primary}` }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium truncate" style={{ color: theme.foreground }}>
                  {item.job_title || "Untitled Resume"}
                </h3>
                <div className="text-[10px] flex items-center gap-1" style={{ color: theme.mutedForeground }}>
                  <Clock size={9} />
                  {formatDate(item.created_at)}
                </div>
              </div>
              <button
                onClick={(e) => handleDelete(e, item.id)}
                disabled={deletingId === item.id}
                className="p-2 rounded-lg flex-shrink-0"
                style={{ color: "#DC2626" }}
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
      </main>

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
                    boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                  }}
                  animate={pulsingId === item.id || isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                />
              ) : (
                <motion.div
                  animate={pulsingId === item.id || isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <Icon size={38} style={{ border: `3px solid ${theme.primary}`, borderRadius: "9999px", padding: "5px", backgroundColor: "rgba(124,58,237,0.15)", boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }} />
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
