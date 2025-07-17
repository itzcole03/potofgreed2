import React, { useState, useEffect } from "react";
import { Download, X, Share } from "lucide-react";

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (running in standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Show prompt after 3 seconds if conditions are met
    const timer = setTimeout(() => {
      if (
        iOS &&
        !standalone &&
        !localStorage.getItem("installPromptDismissed")
      ) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("installPromptDismissed", "true");
  };

  if (!showPrompt || !isIOS || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Download className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">
              Install Bet Tracker
            </h3>
            <p className="text-white/70 text-xs mt-1">
              Add to your home screen for a native app experience
            </p>
            <div className="flex items-center space-x-2 mt-2 text-xs text-blue-400">
              <span>1. Tap</span>
              <Share className="w-4 h-4" />
              <span>2. Scroll down</span>
              <span>3. Tap "Add to Home Screen"</span>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
