import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Browser } from "@capacitor/browser";
import { ChevronLeft, Star, Info, Shield, FileText, Phone, LogOut, Trash2, Loader2 } from "lucide-react";

const theme = {
  background: "#F9FAFB",
  foreground: "#3B0764",
  card: "#FFFFFF",
  primary: "#7C3AED",
  mutedForeground: "#6B7280",
  border: "#E5E7EB",
  radius: "0.75rem",
  fontSans: "'Inter', sans-serif",
};

const GENERAL_ITEMS = [
  { id: "rate", label: "Rate Us", icon: Star, iconBg: "#1E3A8A22", iconColor: "#3B82F6" },
  { id: "help", label: "Help Center", icon: Info, iconBg: "#05966922", iconColor: "#10B981" },
];

const PREFERENCE_ITEMS = [
  { id: "privacy", label: "Privacy Policies", icon: Shield, iconBg: "#7C3AED22", iconColor: "#7C3AED" },
  { id: "terms", label: "Terms of Use", icon: FileText, iconBg: "#D9770622", iconColor: "#D97706" },
  { id: "contact", label: "Contact Us", icon: Phone, iconBg: "#DC262622", iconColor: "#DC2626" },
];

function SettingsRow({ item, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3.5"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: item.iconBg }}
        >
          <Icon size={18} color={item.iconColor} />
        </div>
        <span className="text-sm font-medium" style={{ color: theme.foreground }}>
          {item.label}
        </span>
      </div>
      <ChevronLeft size={18} style={{ color: theme.mutedForeground, transform: "rotate(180deg)" }} />
    </button>
  );
}

export default function SettingsScreen() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    if (!window.confirm("Log out of your account?")) return;
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Delete your account permanently? This will erase your account and all saved resumes. This cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/api/auth/account`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      alert("Your account has been deleted.");
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Couldn't delete your account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
    >
      <header
        className="sticky top-0 z-10 backdrop-blur-md border-b px-5 py-4 flex items-center justify-between"
        style={{ backgroundColor: theme.background + "cc", borderColor: theme.border }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} style={{ color: theme.foreground }}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: theme.foreground }}>
            Settings
          </h1>
        </div>
      </header>

      <main className="flex-1 px-5 py-5">
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: theme.mutedForeground }}
          >
            General
          </h2>
          <div
            className="px-1 divide-y"
            style={{ borderColor: theme.border }}
          >
            {GENERAL_ITEMS.map((item) => (
              <SettingsRow
                key={item.id}
                item={item}
                onClick={() => {
                  if (item.id === "help") {
                    Browser.open({ url: "https://genocaino75-byte.github.io/resume-tailor-mobile/help-center.html" });
                  }
                  // Rate Us will be wired up once the app has a real Play Store listing.
                }}
              />
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: theme.mutedForeground }}
          >
            Preferences
          </h2>
          <div className="px-1 divide-y" style={{ borderColor: theme.border }}>
            {PREFERENCE_ITEMS.map((item) => (
              <SettingsRow
                key={item.id}
                item={item}
                onClick={() => {
                  if (item.id === "privacy") {
                    Browser.open({ url: "https://genocaino75-byte.github.io/resume-tailor-mobile/privacy-policy.html" });
                  } else if (item.id === "terms") {
                    Browser.open({ url: "https://genocaino75-byte.github.io/resume-tailor-mobile/terms-of-use.html" });
                  } else if (item.id === "contact") {
                    Browser.open({ url: "https://genocaino75-byte.github.io/resume-tailor-mobile/contact-us.html" });
                  }
                }}
              />
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: theme.mutedForeground }}
          >
            Account
          </h2>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-3.5"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.primary + "22" }}
            >
              <LogOut size={18} color={theme.primary} />
            </div>
            <span className="text-sm font-medium" style={{ color: theme.primary }}>
              Log Out
            </span>
          </button>

          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="w-full flex items-center gap-3 py-3.5"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#DC262622" }}
            >
              {deleting ? (
                <Loader2 size={18} color="#DC2626" className="animate-spin" />
              ) : (
                <Trash2 size={18} color="#DC2626" />
              )}
            </div>
            <span className="text-sm font-medium" style={{ color: "#DC2626" }}>
              {deleting ? "Deleting account..." : "Delete Account"}
            </span>
          </button>
        </section>

        <p
          className="text-center text-xs tracking-wide mt-8"
          style={{ color: theme.mutedForeground }}
        >
          VERSION 1.0.0 (1)
        </p>
      </main>
    </div>
  );
}
