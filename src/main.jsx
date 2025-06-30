import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { EnhancedAuthProvider } from "./contexts/EnhancedAuthContext.jsx";
import { EnhancedStoryContextProvider } from "./contexts/EnhancedStoryContext.jsx";
import { SubscriptionProvider } from "./contexts/SubscriptionContext.jsx";

// Register service worker for offline support (only in production or when enabled)
if (
  "serviceWorker" in navigator &&
  (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SW === "true")
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <EnhancedAuthProvider>
        <EnhancedStoryContextProvider>
          <SubscriptionProvider>
            <App />
          </SubscriptionProvider>
        </EnhancedStoryContextProvider>
      </EnhancedAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
