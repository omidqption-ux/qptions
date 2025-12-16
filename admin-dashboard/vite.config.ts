import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from "vite-plugin-svgr";
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ }) => {



  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
          // This will transform your SVG to a React component
          exportType: "named",
          namedExport: "ReactComponent",
        },
      })
    ],
    server: {
      port: 3002,
      proxy: {
        // Everything starting with /api goes to your backend
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
          // If your backend routes are WITHOUT the /api prefix, uncomment next line:
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // (optional) If you also need websockets, e.g. Socket.IO:
        // '/socket.io': {
        //   target: 'http://localhost:5001',
        //   ws: true,
        //   changeOrigin: true,
        // },
      },
    },
    // `vite preview` also on 3002 for convenience
    preview: { port: 3002, host: true },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    // Prevent "process is not defined" from 3rd-party libs
    define: {
      'process.env': {},
    },

  }
})
