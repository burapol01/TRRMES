import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const outputDirMap = {
  dev: 'build/DEV/dist',
  uat: 'build/UAT/dist',
  prod: 'build/PROD/dist',
};

// https://vitejs.dev/config/
// Export Vite configuration
export default defineConfig(({ mode }) => {
  // Determine the correct output directory based on the mode
  const outDir = outputDirMap[mode] || 'build/DEV/dist';

  return {
    plugins: [react()],
    base: "/trr-mes/",
    build: {
      chunkSizeWarningLimit: 3000,      
      outDir, // Set the output directory dynamically
    },
    // esbuild: {
    //   drop: ["console", "debugger"],
    // },
  };
});