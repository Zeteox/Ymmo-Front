import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: env.VITE_MAIN_API_PROXY_TARGET || "http://127.0.0.1:5000",
          changeOrigin: true,
        },
        "/ia": {
          target:
            env.VITE_IA_API_PROXY_TARGET ||
            env.VITE_PYTHON_API_PROXY_TARGET ||
            "http://127.0.0.1:5100",
          changeOrigin: true,
        },
      },
    },
  }
})
