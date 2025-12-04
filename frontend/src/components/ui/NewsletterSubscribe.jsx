import React, { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import api from "../../services/api";

const NewsletterSubscribe = ({ variant = "default" }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showNameField, setShowNameField] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/newsletter/subscribe", {
        email,
        name: name || undefined,
      });
      setSuccess(true);
      setEmail("");
      setName("");
      setShowNameField(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to subscribe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className={`${
          variant === "compact" ? "p-4" : "p-6"
        } bg-green-100 border-4 border-black`}
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-600 shrink-0" size={24} />
          <div>
            <p className="font-bold text-green-800">You're subscribed! 🎉</p>
            <p className="text-sm text-green-700">
              Check your inbox for a welcome email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant for footer
  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 border-ni-white px-4 py-2 border-4 font-bold focus:outline-none  focus:ring-ni-neon focus:border-none focus:ring-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-ni-neon border-3 border-ni-black font-bold hover:shadow-brutal transition-all disabled:opacity-50 cursor-target"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm font-bold flex items-center gap-1">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </form>
    );
  }

  // Default full variant
  return (
    <div className="bg-ni-neon border-4 border-ni-black p-6 shadow-brutal">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-ni-black">
          <Mail className="text-ni-neon" size={24} />
        </div>
        <div>
          <h3 className="font-black text-xl">Stay in the Loop! 📬</h3>
          <p className="text-sm">Get updates on events, projects & more</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="w-full px-4 py-3 border-3 border-ni-black font-bold focus:outline-none focus:ring-2 focus:ring-ni-black"
        />

        {showNameField && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full px-4 py-3 border-3 border-ni-black font-bold focus:outline-none focus:ring-2 focus:ring-ni-black"
          />
        )}

        {!showNameField && (
          <button
            type="button"
            onClick={() => setShowNameField(true)}
            className="text-sm font-bold underline hover:no-underline"
          >
            + Add your name
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-ni-black text-ni-neon border-3 border-ni-black font-black text-lg hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Subscribing...
            </>
          ) : (
            <>
              <Send size={20} />
              Subscribe Now
            </>
          )}
        </button>

        {error && (
          <p className="text-red-600 font-bold flex items-center gap-1 bg-red-100 p-2 border-2 border-red-500">
            <AlertCircle size={16} /> {error}
          </p>
        )}

        <p className="text-xs text-center">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSubscribe;
