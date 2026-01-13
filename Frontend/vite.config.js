import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1", // bind IPv4 loopback (use "0.0.0.0" to expose to LAN)
    port: 5173,
  },
});
