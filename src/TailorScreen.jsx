import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { ArrowLeft, Sparkles, Loader2, Settings, FileText, Briefcase, Cpu, Check } from "lucide-react";

// Point pdf.js at its matching worker version via CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n\n";
  }
  return fullText.trim();
}

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

  // Prevent the browser's default "open/download the file" behavior for
  // any drag that misses the actual drop zones (e.g. dropped slightly
  // outside the textarea boundary).
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);
    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);

  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dragOverResume, setDragOverResume] = useState(false);
  const [dragOverJD, setDragOverJD] = useState(false);

  const canSubmit = resume.trim() && jobDescription.trim() && !loading;

  const handleFileDrop = async (e, setter, setDragOver) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const isTxt = file.type === "text/plain" || file.name.endsWith(".txt");
    const isDocx =
      file.name.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const isPdf = file.name.endsWith(".pdf") || file.type === "application/pdf";

    if (isTxt) {
      const reader = new FileReader();
      reader.onload = (event) => setter(event.target.result);
      reader.readAsText(file);
    } else if (isDocx) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setter(result.value);
      } catch (err) {
        console.error("Failed to read .docx file:", err);
        alert("Couldn't read that Word document. Please try copying and pasting the text instead.");
      }
    } else if (isPdf) {
      try {
        const text = await extractPdfText(file);
        setter(text);
      } catch (err) {
        console.error("Failed to read PDF file:", err);
        alert("Couldn't read that PDF. Please try copying and pasting the text instead.");
      }
    } else {
      alert("Only .txt, .docx, and .pdf files can be dropped directly.");
    }
  };

  const [loadingStep, setLoadingStep] = useState(0);

  const handleTailor = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please paste both your resume and the job description.");
      return;
    }
    setError("");
    setLoading(true);
    setLoadingStep(0);

    // Cosmetic step progression while the real API call is in flight -
    // gives the user a sense of progress during the wait.
    const stepTimer = setTimeout(() => setLoadingStep(1), 1800);

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
      clearTimeout(stepTimer);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-8"
        style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
      >
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke={theme.border} strokeWidth="4" />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={theme.primary}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="289"
              animate={{ strokeDashoffset: [289, 60] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cpu size={44} color={theme.primary} strokeWidth={1.5} />
          </motion.div>
        </div>

        <h2 className="text-xl font-bold text-center mb-2" style={{ color: theme.foreground }}>
          Refining your career narrative...
        </h2>
        <p className="text-sm text-center mb-6" style={{ color: theme.mutedForeground }}>
          Our AI is analyzing the job description and tailoring your resume to match.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.primary }}
            >
              <Check size={12} color="#ffffff" strokeWidth={3} />
            </div>
            <span className="text-sm font-medium" style={{ color: theme.primary }}>
              Analyzing keywords
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            {loadingStep >= 1 ? (
              <Loader2 size={20} className="animate-spin flex-shrink-0" color={theme.mutedForeground} />
            ) : (
              <div
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{ border: `2px solid ${theme.border}` }}
              />
            )}
            <span
              className="text-sm"
              style={{ color: loadingStep >= 1 ? theme.foreground : theme.mutedForeground }}
            >
              Rewriting bullet points...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.background, fontFamily: theme.fontSans }}
    >
      <header
        className="sticky top-0 z-10 backdrop-blur-md border-b px-4 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: theme.background + "cc", borderColor: theme.border }}
      >
        <div className="flex items-center gap-2.5">
          <motion.button
            onClick={() => navigate(-1)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ x: -4 }}
            className="transition-opacity"
            style={{ color: theme.mutedForeground }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className="text-base font-semibold tracking-tight" style={{ color: theme.foreground }}>
            Tailor to Job
          </h1>
        </div>
        <button
          onClick={() => navigate("/settings")}
          style={{ color: theme.primary }}
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
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
            <FileText size={16} color={theme.primary} />
            <label className="text-xs font-medium" style={{ color: theme.mutedForeground }}>
              Your Resume
            </label>
          </div>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            onDragOver={(e) => { e.preventDefault(); setDragOverResume(true); }}
            onDragLeave={() => setDragOverResume(false)}
            onDrop={(e) => handleFileDrop(e, setResume, setDragOverResume)}
            placeholder="Paste your resume here, or drag a .txt file..."
            className="w-full text-sm outline-none"
            style={{
              backgroundColor: dragOverResume ? theme.secondary : theme.card,
              border: `2px ${dragOverResume ? "dashed" : "solid"} ${theme.primary}`,
              borderRadius: theme.radius,
              padding: "0.75rem",
              minHeight: "140px",
              color: theme.foreground,
              boxShadow: "0 4px 14px rgba(124,58,237,0.12)",
              transition: "background-color 0.15s ease",
            }}
          />
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Briefcase size={16} color={theme.primary} />
            <label className="text-xs font-medium" style={{ color: theme.mutedForeground }}>
              Job Description
            </label>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            onDragOver={(e) => { e.preventDefault(); setDragOverJD(true); }}
            onDragLeave={() => setDragOverJD(false)}
            onDrop={(e) => handleFileDrop(e, setJobDescription, setDragOverJD)}
            placeholder="Paste job description here, or drag a .txt file..."
            className="w-full text-sm outline-none"
            style={{
              backgroundColor: dragOverJD ? theme.secondary : theme.card,
              border: `2px ${dragOverJD ? "dashed" : "solid"} ${theme.primary}`,
              borderRadius: theme.radius,
              padding: "0.75rem",
              minHeight: "140px",
              color: theme.foreground,
              boxShadow: "0 4px 14px rgba(124,58,237,0.12)",
              transition: "background-color 0.15s ease",
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
