import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { NativePurchases, PURCHASE_TYPE } from "@capgo/native-purchases";
import axios from "axios";
import { X, Infinity as InfinityIcon, Loader2 } from "lucide-react";

const theme = {
  primaryDark: "#3B0764",
  primary: "#7C3AED",
  accentYellow: "#FBBF24",
  white: "#FFFFFF",
  mutedLight: "rgba(255,255,255,0.6)",
  radius: "1rem",
  fontSans: "'Sora', sans-serif",
};

const API_URL = import.meta.env.VITE_API_URL;

// Must match the Product ID created in Google Play Console exactly.
const LIFETIME_PRODUCT_ID = "lifetime_access";

export default function PaywallScreen() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);       // purchase in progress
  const [restoring, setRestoring] = useState(false);   // restore in progress
  const [error, setError] = useState("");
  const [price, setPrice] = useState(null);            // null until the real store price loads (no hardcoded fallback)

  const isNative = Capacitor.isNativePlatform();

  // On mount (native only), fetch the real localized price from the store.
  useEffect(() => {
    if (!isNative) return;
    (async () => {
      try {
        const { products } = await NativePurchases.getProducts({
          productIdentifiers: [LIFETIME_PRODUCT_ID],
          productType: PURCHASE_TYPE.INAPP,
        });
        if (products && products.length > 0 && products[0].priceString) {
          setPrice(products[0].priceString);
        }
      } catch (err) {
        // Non-fatal: just keep the fallback price. Log for debugging.
        console.error("Failed to load product price:", err);
      }
    })();
  }, [isNative]);

  // Send a confirmed purchase token to our backend to grant lifetime access.
  const confirmWithBackend = async (purchaseToken) => {
    const token = localStorage.getItem("authToken");
    return axios.post(
      `${API_URL}/api/billing/confirm`,
      { purchaseToken, productId: LIFETIME_PRODUCT_ID },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const handlePurchase = async () => {
    setError("");

    // In the browser preview there's no Google Play — guard against it.
    if (!isNative) {
      setError("Purchases are only available in the installed app.");
      return;
    }

    setLoading(true);
    try {
      // Launch Google Play's purchase flow. Google validates the payment;
      // a successful return means the user actually paid.
      const transaction = await NativePurchases.purchaseProduct({
        productIdentifier: LIFETIME_PRODUCT_ID,
        productType: PURCHASE_TYPE.INAPP,
      });

      const purchaseToken = transaction?.transactionId || transaction?.purchaseToken;
      if (!purchaseToken) {
        throw new Error("No purchase token returned.");
      }

      // Tell our backend to record it and flip has_lifetime.
      await confirmWithBackend(purchaseToken);

      // Success — into the app.
      navigate("/home");
    } catch (err) {
      console.error("Purchase failed:", err);
      // User cancelling the Google sheet also throws — treat that quietly.
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("cancel")) {
        // User backed out; no error message needed.
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError("Something went wrong with your purchase. You were not charged if it didn't complete.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setError("");

    if (!isNative) {
      setError("Restore is only available in the installed app.");
      return;
    }

    setRestoring(true);
    try {
      // Ask Google Play for this account's existing purchases.
      await NativePurchases.restorePurchases();
      const { purchases } = await NativePurchases.getPurchases();

      // Find a lifetime purchase among them.
      const lifetime = (purchases || []).find(
        (p) => p.productIdentifier === LIFETIME_PRODUCT_ID || p.productId === LIFETIME_PRODUCT_ID
      );

      if (!lifetime) {
        setError("No previous purchase found for this account.");
        return;
      }

      const purchaseToken = lifetime.transactionId || lifetime.purchaseToken;
      if (!purchaseToken) {
        setError("Couldn't read your previous purchase. Please contact support.");
        return;
      }

      await confirmWithBackend(purchaseToken);
      navigate("/home");
    } catch (err) {
      console.error("Restore failed:", err);
      setError("Couldn't restore your purchase. Please try again.");
    } finally {
      setRestoring(false);
    }
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
          <div className="relative w-full text-left">
            <span
              className="absolute -top-2.5 left-4 px-3 py-0.5 rounded-full text-[10px] font-bold z-10"
              style={{ backgroundColor: theme.primary, color: "#ffffff" }}
            >
              BEST VALUE
            </span>
            <div
              className="flex items-center justify-between p-4"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: theme.radius,
                border: `2px solid ${theme.primary}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.primary + "1a" }}
                >
                  <InfinityIcon size={18} color={theme.primary} />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: theme.primaryDark }}>
                    Lifetime Access
                  </h3>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Pay once, unlimited tailoring
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold" style={{ color: theme.primaryDark }}>
                  {price ? price : <Loader2 size={18} className="animate-spin" style={{ color: theme.primaryDark }} />}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-center mb-3" style={{ color: theme.accentYellow }}>
            {error}
          </p>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePurchase}
          disabled={loading || restoring}
          className="w-full py-4 font-bold text-base mb-4 flex items-center justify-center gap-2"
          style={{
            backgroundColor: theme.accentYellow,
            color: theme.primaryDark,
            borderRadius: theme.radius,
            boxShadow: "0 8px 20px rgba(251,191,36,0.3)",
            opacity: loading || restoring ? 0.7 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            "Continue"
          )}
        </motion.button>

        <button
          onClick={handleRestore}
          disabled={loading || restoring}
          className="text-center text-sm mb-4"
          style={{ color: theme.mutedLight }}
        >
          {restoring ? "Restoring..." : "Restore Purchase"}
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
