"use client";
import { useEffect } from "react";

export default function FetchConfig() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalFetch = window.fetch;
      window.fetch = function (input, init) {
        if (typeof input === "string" && input.startsWith("/api/")) {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          if (backendUrl) {
            // Sanitize backend URL by removing trailing slash if present
            const sanitizedUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
            input = `${sanitizedUrl}${input}`;
          }
        }
        return originalFetch(input, init);
      };
    }
  }, []);

  return null;
}
