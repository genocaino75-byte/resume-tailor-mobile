import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Browser } from "@capacitor/browser";
import { X, FileText, Infinity as InfinityIcon } from "lucide-react";

const theme = {
  primaryDark: "#3B0764",
  primary: "#7C3AED",
  accentYellow: "#FBBF24",
  white: "#FFFFFF",
  mutedLight: "rgba(255,255,255,0.6)",
  radius: "1rem",
  fontSans: "'Sora', sans-serif",
};

const PLANS = [
  {
    id: "lifetime",
    label: "Lifetime Access",
    subtext: "Pay once, unlimited tailoring",
    price: "$25.00",
    badge: "BEST VALUE",
    icon: InfinityIcon,
  },
];

export default function PaywallScreen() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("lifetime");

  const handleContinue = () => {
    // Real payment processing (Google Play Billing) not wired up yet -
    // for now, continue straight into the app.
    navigate("/home");
  };

  return (
    <div
      className="relative h-screen w-full flex flex-col overflow-hidden"
      style={{ fontFamily: theme.fontSans }}
    >
      {/* Decorative header */}
      <div
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{
          height: "38vh",
          background: `linear-gradient(135deg, ${theme.primaryDark} 0%, ${theme.primary} 60%, #A855F7 100%)`,
        }}
      >
        <motion.img
          src="/tailor-icon.png"
          alt=""
          className="w-28 h-36"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ objectFit: "contain", filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.3))" }}
        />

        <button
          onClick={() => navigate("/home")}
          className="absolute flex items-center justify-center rounded-full"
          style={{
            top: "20px",
            right: "20px",
            width: "36px",
            height: "36px",
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          <X size={18} color="#ffffff" />
        </button>
      </div>

      {/* Content */}
      <div
        className="flex-1 flex flex-col px-6 pt-6 pb-8 overflow-y-auto"
        style={{ backgroundColor: theme.primaryDark, color: "#ffffff" }}
      >
        <h1 className="text-3xl font-bold mb-1">Go Pro Today</h1>
        <p className="text-sm mb-6" style={{ color: theme.mutedLight }}>
          You've used your 2 free tailors. Unlock unlimited to keep going.
        </p>

        <div className="space-y-3 mb-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className="relative w-full text-left"
              >
                {plan.badge && (
                  <span
                    className="absolute -top-2.5 left-4 px-3 py-0.5 rounded-full text-[10px] font-bold z-10"
                    style={{ backgroundColor: theme.primary, color: "#ffffff" }}
                  >
                    {plan.badge}
                  </span>
                )}
                <div
                  className="flex items-center justify-between p-4"
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: theme.radius,
                    border: isSelected ? `2px solid ${theme.primary}` : "2px solid transparent",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: theme.primary + "1a" }}
                    >
                      <Icon size={18} color={theme.primary} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: theme.primaryDark }}>
                        {plan.label}
                      </h3>
                      <p className="text-xs" style={{ color: "#6B7280" }}>
                        {plan.subtext}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {plan.originalPrice && (
                      <p
                        className="text-xs line-through"
                        style={{ color: "#9CA3AF" }}
                      >
                        {plan.originalPrice}
                      </p>
                    )}
                    <p className="text-lg font-bold" style={{ color: theme.primaryDark }}>
                      {plan.price}
                    </p>
                    {plan.save && (
                      <p className="text-[11px] font-semibold" style={{ color: "#10B981" }}>
                        {plan.save}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleContinue}
          className="w-full py-4 font-bold text-base mb-4"
          style={{
            backgroundColor: theme.accentYellow,
            color: theme.primaryDark,
            borderRadius: theme.radius,
            boxShadow: "0 8px 20px rgba(251,191,36,0.3)",
          }}
        >
          Continue
        </motion.button>

        <button
          onClick={() => alert("Restore Purchase will be available once in-app purchases are live.")}
          className="text-center text-sm mb-4"
          style={{ color: theme.mutedLight }}
        >
          Restore Purchase
        </button>

        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          <button
            onClick={() => Browser.open({ url: "https://genocaino75-byte.github.io/resume-tailor-mobile/terms-of-use.html" })}
            className="uppercase tracking-wide"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Terms of Use
          </button>
          <span>•</span>
          <button
            onClick={() => Browser.open({ url: "https://genocaino75-byte.github.io/resume-tailor-mobile/privacy-policy.html" })}
            className="uppercase tracking-wide"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}
