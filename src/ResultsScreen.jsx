import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Sparkles, Download, Check, Loader2, Home, ArrowLeft, History, FileText } from "lucide-react";

const theme = {
  background: "#F9FAFB",
  foreground: "#3B0764",
  card: "#FFFFFF",
  primary: "#7C3AED",
  primaryDark: "#3B0764",
  secondary: "#F3F0FF",
  mutedForeground: "#6B7280",
  border: "#E5E7EB",
  success: "#10B981",
  radius: "0.5rem",
  fontSans: "'Sora', sans-serif",
};

const API_URL = import.meta.env.VITE_API_URL;

export default function ResultsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tailoredResume, originalResume } = location.state || {};
  const [resumeText, setResumeText] = useState(tailoredResume || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/api/resumes`,
        {
          original: originalResume,
          tailored: resumeText,
          jobTitle: "",
          company: "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const [showExportPicker, setShowExportPicker] = useState(false);

  const handleExport = async (format) => {
    setShowExportPicker(false);
    setExporting(true);
    try {
      const endpoint = format === "pdf" ? "generate-pdf" : "generate-docx";
      const extension = format === "pdf" ? "pdf" : "docx";

      const response = await axios.post(
        `${API_URL}/api/${endpoint}`,
        { resumeText, jobTitle: "", company: "" },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `tailored_resume.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  if (!tailoredResume) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-5 text-center"
        style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
      >
        <p className="text-sm" style={{ color: theme.mutedForeground }}>
          No tailored resume found. Please go back and try again.
        </p>
        <button
          onClick={() => navigate("/tailor")}
          className="mt-3 px-5 py-2.5 text-sm font-medium"
          style={{ backgroundColor: theme.primary, color: "#fff", borderRadius: theme.radius }}
        >
          Back to Tailor
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
    >
      <header
        className="border-b px-3.5 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: theme.card, borderColor: theme.border }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: theme.secondary, border: `1.5px solid ${theme.primary}` }}
          >
            <FileText size={16} color={theme.primary} />
          </div>
          <div>
            <h2 className="text-xs font-semibold" style={{ color: theme.foreground }}>
              Tailored Resume
            </h2>
            <div className="text-[10px] flex items-center gap-1" style={{ color: theme.mutedForeground }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.success }} />
              Tailored just now
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-2.5 py-1 text-xs font-medium flex items-center gap-1"
            style={{ backgroundColor: theme.secondary, color: theme.primary, borderRadius: theme.radius }}
          >
            {saving ? (
              <Loader2 size={12} className="animate-spin" />
            ) : saved ? (
              <Check size={12} />
            ) : null}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            onClick={() => setShowExportPicker(true)}
            disabled={exporting}
            className="px-3 py-1 text-xs font-medium flex items-center gap-1"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryDark}, ${theme.primary})`,
              color: "#fff",
              borderRadius: theme.radius,
            }}
          >
            {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
            Export
          </button>
        </div>
      </header>

      {/* Export format picker */}
      {showExportPicker && (
        <div
          className="fixed inset-0 flex items-end justify-center z-30"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowExportPicker(false)}
        >
          <div
            className="w-full p-5 space-y-3"
            style={{
              backgroundColor: theme.card,
              borderTopLeftRadius: "1.25rem",
              borderTopRightRadius: "1.25rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-center mb-2" style={{ color: theme.foreground }}>
              Export as...
            </h3>
            <button
              onClick={() => handleExport("docx")}
              className="w-full py-3.5 font-medium text-sm"
              style={{ backgroundColor: theme.secondary, color: theme.foreground, borderRadius: theme.radius }}
            >
              Word Document (.docx)
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="w-full py-3.5 font-medium text-sm"
              style={{ backgroundColor: theme.secondary, color: theme.foreground, borderRadius: theme.radius }}
            >
              PDF (.pdf)
            </button>
            <button
              onClick={() => setShowExportPicker(false)}
              className="w-full py-3 text-sm"
              style={{ color: theme.mutedForeground }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-3.5 pb-24">
        <div className="flex items-center gap-1.5 mb-2">
          <FileText size={16} color={theme.primary} />
          <span className="text-xs font-medium" style={{ color: theme.mutedForeground }}>Tailored Resume</span>
        </div>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full text-sm outline-none resize-none"
          style={{
            backgroundColor: theme.card,
            border: `2px solid ${theme.primary}`,
            borderRadius: theme.radius,
            padding: "0.875rem",
            minHeight: "55vh",
            color: theme.foreground,
            boxShadow: "0 4px 14px rgba(124,58,237,0.12)",
          }}
        />
      </main>

      {/* Bottom nav - History, Home, Back - evenly spaced */}
      <nav
        className="fixed bottom-0 w-full h-20 flex justify-around items-center border-t"
        style={{ backgroundColor: theme.card + "f2", backdropFilter: "blur(8px)", borderColor: theme.border, zIndex: 20 }}
      >
        <button
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center gap-1.5"
          style={{ color: theme.primary }}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center rounded-full"
            style={{
              width: "38px",
              height: "38px",
              border: `3px solid ${theme.primary}`,
              backgroundColor: "rgba(124,58,237,0.08)",
            }}
          >
            <History size={18} strokeWidth={2.5} color={theme.primary} />
          </motion.div>
          <span className="text-xs font-medium">History</span>
        </button>

        <button
          onClick={() => navigate("/home")}
          className="flex flex-col items-center gap-1.5"
          style={{ color: theme.primary }}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center rounded-full"
            style={{
              width: "38px",
              height: "38px",
              border: `3px solid ${theme.primary}`,
              backgroundColor: "rgba(124,58,237,0.08)",
            }}
          >
            <Home size={18} strokeWidth={2.5} color={theme.primary} />
          </motion.div>
          <span className="text-xs font-medium">Home</span>
        </button>

        <button
          onClick={() => navigate(-1)}
          className="flex flex-col items-center gap-1.5"
          style={{ color: theme.primary }}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ x: -4 }}
            className="flex items-center justify-center rounded-full"
            style={{
              width: "38px",
              height: "38px",
              border: `3px solid ${theme.primary}`,
              backgroundColor: "rgba(124,58,237,0.08)",
            }}
          >
            <ArrowLeft size={18} strokeWidth={2.5} color={theme.primary} />
          </motion.div>
          <span className="text-xs font-medium">Back</span>
        </button>
      </nav>
    </div>
  );
}
