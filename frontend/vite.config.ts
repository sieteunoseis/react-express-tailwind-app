/// <reference types="vitest" />
import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {

    // Load env file from parent directory
    const env = loadEnv(mode, path.join(process.cwd(), '..'), '')
    console.log('Loaded environment:', Object.keys(env)) // Using env to avoid the error

    return {
      plugins: [react()],
      envDir: '..',
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      server: {
        proxy: {
          '/api': {
            // In development, proxy to localhost. In Docker, this won't be used.
            target: `http://localhost:${env.PORT || 3000}`,
            changeOrigin: true
          }
        }
      },
      define: {
        // Make API URL available at build time for production
        __API_URL__: JSON.stringify(env.VITE_API_URL || `http://localhost:${env.PORT || 3000}`)
      },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
      }
    }
})
