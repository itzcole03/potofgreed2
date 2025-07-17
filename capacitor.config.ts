import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bettracker.app",
  appName: "Bet Tracker",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
