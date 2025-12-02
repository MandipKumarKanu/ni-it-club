import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MailX, CheckCircle, AlertCircle, Loader2, Home, ArrowLeft } from "lucide-react";
import api from "../services/api";
import Button from "../components/ui/Button";
import { Binary, Dots } from "../components/ui/Doodles";
import SEO from "../components/SEO";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [subscriberInfo, setSubscriberInfo] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      fetchSubscriberInfo();
    } else {
      setLoading(false);
      setError("Invalid unsubscribe link. No token provided.");
    }
  }, [token]);

  const fetchSubscriberInfo = async () => {
    try {
      const { data } = await api.get(`/newsletter/unsubscribe/${token}`);
      setSubscriberInfo(data);
      
      // If already unsubscribed, show that status
      if (data.status === "unsubscribed") {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired unsubscribe link.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setUnsubscribing(true);
    setError("");

    try {
      await api.post("/newsletter/unsubscribe", { token });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to unsubscribe. Please try again.");
    } finally {
      setUnsubscribing(false);
    }
  };

  return (
    <>
      <SEO
        title="Unsubscribe - NI-IT Club"
        description="Manage your newsletter subscription preferences"
      />

      <div className="min-h-[80vh] relative overflow-hidden flex items-center justify-center px-4 py-20">
        {/* Background decorations */}
        <Binary className="absolute top-10 left-10 text-ni-black opacity-5 scale-150" />
        <Binary className="absolute bottom-10 right-10 text-ni-black opacity-5 scale-150" />
        <Dots className="absolute top-1/4 right-1/4 w-32 h-32 text-ni-pink opacity-10" />

        <div className="max-w-lg w-full relative z-10">
          {loading ? (
            <div className="bg-white border-4 border-ni-black p-8 shadow-brutal text-center">
              <Loader2 className="animate-spin mx-auto mb-4" size={48} />
              <p className="font-bold">Loading...</p>
            </div>
          ) : error && !subscriberInfo ? (
            <div className="bg-white border-4 border-ni-black p-8 shadow-brutal">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 border-4 border-ni-black mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="text-red-500" size={32} />
                </div>
                <h1 className="text-2xl font-black mb-2">Oops!</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link to="/">
                  <Button className="flex items-center gap-2 mx-auto">
                    <Home size={18} />
                    Go to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="bg-white border-4 border-ni-black p-8 shadow-brutal">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 border-4 border-ni-black mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="text-green-500" size={32} />
                </div>
                <h1 className="text-2xl font-black mb-2">You're Unsubscribed</h1>
                <p className="text-gray-600 mb-2">
                  {subscriberInfo?.email && (
                    <span className="font-bold">{subscriberInfo.email}</span>
                  )}
                </p>
                <p className="text-gray-600 mb-6">
                  You won't receive any more newsletters from us.
                </p>
                
                <div className="bg-ni-neon border-4 border-ni-black p-4 mb-6">
                  <p className="font-bold text-sm">
                    💛 We're sad to see you go, but we respect your decision.
                  </p>
                  <p className="text-sm mt-2">
                    You can always resubscribe by visiting our website!
                  </p>
                </div>

                <Link to="/">
                  <Button className="flex items-center gap-2 mx-auto">
                    <Home size={18} />
                    Go to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border-4 border-ni-black p-8 shadow-brutal">
              <div className="text-center">
                <div className="w-16 h-16 bg-ni-pink border-4 border-ni-black mx-auto mb-4 flex items-center justify-center">
                  <MailX className="text-white" size={32} />
                </div>
                <h1 className="text-2xl font-black mb-2">Unsubscribe</h1>
                <p className="text-gray-600 mb-2">
                  Are you sure you want to unsubscribe?
                </p>
                {subscriberInfo?.email && (
                  <p className="font-bold text-lg mb-6">{subscriberInfo.email}</p>
                )}

                {error && (
                  <div className="bg-red-100 border-2 border-red-500 p-3 mb-4 text-red-700 font-bold text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handleUnsubscribe}
                    disabled={unsubscribing}
                    className="w-full bg-red-500 hover:bg-red-600"
                  >
                    {unsubscribing ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Unsubscribing...
                      </>
                    ) : (
                      <>
                        <MailX className="mr-2" size={18} />
                        Yes, Unsubscribe Me
                      </>
                    )}
                  </Button>

                  <Link to="/" className="block">
                    <Button className="w-full bg-gray-200 text-ni-black hover:bg-gray-300">
                      <ArrowLeft className="mr-2" size={18} />
                      No, Keep Me Subscribed
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                  You're receiving this because you subscribed to NI-IT Club newsletter.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Unsubscribe;
