import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development the API runs on its own (uvicorn on :8000) and Vite forwards /api to it
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': 'http://localhost:8000',
        },
    },
});
