import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";

// Generate or get session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("traffic_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36)}`;
    sessionStorage.setItem("traffic_session_id", sessionId);
  }
  return sessionId;
};

const usePageTracker = () => {
  const location = useLocation();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname;

    // Avoid tracking the same path multiple times in succession
    if (currentPath === lastTrackedPath.current) {
      return;
    }

    lastTrackedPath.current = currentPath;

    const trackPageView = async () => {
      try {
        await api.post("/traffic/track", {
          path: currentPath,
          referrer: document.referrer || "",
          sessionId: getSessionId(),
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.debug("Failed to track page view:", error);
      }
    };

    // Small delay to ensure page has loaded
    const timeoutId = setTimeout(trackPageView, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);
};

export default usePageTracker;
