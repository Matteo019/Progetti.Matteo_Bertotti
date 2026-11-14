import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    // In development (npm run dev) the /api calls go to the .NET backend (dotnet run)
    server: {
        proxy: {
            '/api': 'http://localhost:5033',
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                signup: resolve(__dirname, 'signup.html'),
                recovery: resolve(__dirname, 'recovery.html'),
                dataEntry: resolve(__dirname, 'data-entry.html'),
                search: resolve(__dirname, 'search.html'),
                admin: resolve(__dirname, 'admin.html'),
                bulkEntry: resolve(__dirname, 'bulk-entry.html'),
            },
        },
    },
});
