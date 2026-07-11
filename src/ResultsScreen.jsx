import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Sparkles, Download, Check, Loader2 } from "lucide-react";

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
  success: "#10B981",
  radius: "0.75rem",
  fontHeading: "'Poppins', 'Inter', sans-serif",
  fontSans: "'Inter', sans-serif",
};

const API_URL = import.meta.env.VITE_API_URL;

export default function ResultsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tailoredResume, originalResume, jobDescription } = location.state || {};
  const [resumeText, setResumeText] = useState(tailoredResume || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);

  const jobTitle = "Tailored Resume";

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/resumes`, {
        original: originalResume,
        tailored: resumeText,
        jobTitle: "",
        company: "",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/generate-docx`,
        { resumeText, jobTitle: "", company: "" },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tailored_resume.docx");
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
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
      >
        <p style={{ color: theme.mutedForeground }}>
          No tailored resume found. Please go back and try again.
        </p>
        <button
          onClick={() => navigate("/tailor")}
          className="mt-4 px-6 py-3 font-medium"
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
      {/* Header */}
      <header
        className="border-b px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: theme.card, borderColor: theme.border }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: theme.secondary }}
          >
            <Sparkles size={16} style={{ color: theme.primary }} />
          </div>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: theme.foreground }}>
              {jobTitle}
            </h2>
            <div className="text-[10px] flex items-center gap-1" style={{ color: theme.mutedForeground }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.success }} />
              Tailored just now
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 text-xs font-medium flex items-center gap-1"
            style={{ backgroundColor: theme.secondary, color: theme.primary, borderRadius: theme.radius }}
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : saved ? (
              <Check size={14} />
            ) : null}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-1.5 text-sm font-medium flex items-center gap-1.5"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryDark}, ${theme.primary})`,
              color: "#fff",
              borderRadius: theme.radius,
            }}
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Export
          </button>
        </div>
      </header>

      {/* Editable tailored resume */}
      <main className="flex-1 overflow-y-auto p-4">
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full h-full text-sm outline-none resize-none"
          style={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.radius,
            padding: "1rem",
            minHeight: "60vh",
            color: theme.foreground,
          }}
        />
      </main>
    </div>
  );
}
