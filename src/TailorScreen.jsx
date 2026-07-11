import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

const theme = {
  background: "#F9FAFB",
  foreground: "#3B0764",
  card: "#FFFFFF",
  primary: "#7C3AED",
  primaryDark: "#3B0764",
  secondary: "#F3F0FF",
  mutedForeground: "#6B7280",
  border: "#E5E7EB",
  radius: "0.5rem",
  fontSans: "'Inter', sans-serif",
};

const API_URL = import.meta.env.VITE_API_URL;

export default function TailorScreen() {
  const navigate = useNavigate();
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = resume.trim() && jobDescription.trim() && !loading;

  const handleTailor = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please paste both your resume and the job description.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/tailor`, {
        resume,
        jobDescription,
      });
      navigate("/results", {
        state: {
          originalResume: resume,
          jobDescription,
          tailoredResume: response.data.tailoredResume,
        },
      });
    } catch (err) {
      console.error("Tailor request failed:", err);
      setError("Something went wrong tailoring your resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
    >
      <header
        className="sticky top-0 z-10 backdrop-blur-md border-b px-4 py-2.5 flex items-center gap-2.5"
        style={{ backgroundColor: theme.background + "cc", borderColor: theme.border }}
      >
        <button
          onClick={() => navigate(-1)}
          className="hover:opacity-70 transition-opacity"
          style={{ color: theme.mutedForeground }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-semibold tracking-tight" style={{ color: theme.foreground }}>
          Tailor to Job
        </h1>
      </header>

      <main className="flex-1 w-full p-4 space-y-4 overflow-y-auto pb-6">
        <section className="text-center py-1 space-y-1.5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto overflow-hidden"
            style={{ backgroundColor: theme.primary, border: `2px solid ${theme.primaryDark}` }}
          >
            <img src="/tailor-icon.png" alt="" className="w-14 h-14" style={{ objectFit: "contain" }} />
          </div>
          <h2 className="text-base font-semibold" style={{ color: theme.foreground }}>
            Optimize for Success
          </h2>
          <p className="text-xs max-w-xs mx-auto" style={{ color: theme.mutedForeground }}>
            Paste your resume and the job description below.
          </p>
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-1.5">
            <img src="/tailor-icon.png" alt="" className="w-5 h-5 rounded-full" style={{ border: `1.5px solid ${theme.primary}` }} />
            <label className="text-xs font-medium" style={{ color: theme.mutedForeground }}>
              Your Resume
            </label>
          </div>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume here..."
            className="w-full text-sm outline-none"
            style={{
              backgroundColor: theme.card,
              border: `2px solid ${theme.primary}`,
              borderRadius: theme.radius,
              padding: "0.75rem",
              minHeight: "140px",
              color: theme.foreground,
              boxShadow: "0 4px 14px rgba(124,58,237,0.12)",
            }}
          />
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-1.5">
            <img src="/tailor-icon.png" alt="" className="w-5 h-5 rounded-full" style={{ border: `1.5px solid ${theme.primary}` }} />
            <label className="text-xs font-medium" style={{ color: theme.mutedForeground }}>
              Job Description
            </label>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full text-sm outline-none"
            style={{
              backgroundColor: theme.card,
              border: `2px solid ${theme.primary}`,
              borderRadius: theme.radius,
              padding: "0.75rem",
              minHeight: "140px",
              color: theme.foreground,
              boxShadow: "0 4px 14px rgba(124,58,237,0.12)",
            }}
          />
        </section>

        {error && (
          <p className="text-xs text-center" style={{ color: "#DC2626" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleTailor}
          disabled={!canSubmit}
          className="w-full py-3 font-semibold text-sm flex items-center justify-center gap-2"
          style={{
            background: canSubmit
              ? `linear-gradient(135deg, ${theme.primaryDark}, ${theme.primary})`
              : theme.secondary,
            color: canSubmit ? "#ffffff" : theme.mutedForeground,
            borderRadius: theme.radius,
            boxShadow: canSubmit ? "0 6px 16px rgba(124,58,237,0.28)" : "none",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Tailoring...
            </>
          ) : (
            "Tailor My Resume"
          )}
        </button>
      </main>
    </div>
  );
}
