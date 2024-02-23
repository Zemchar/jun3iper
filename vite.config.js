import {defineConfig} from "vite";
import { resolve } from 'path';
export default defineConfig({
    esbuild: {
        drop: ['console', 'debugger'],
    },
    build: {
        rollupOptions: {
            input: {
                landing: resolve(__dirname, 'index.html'),
                photography: resolve(__dirname, 'pages/Photography.html'),
                programming: resolve(__dirname, 'pages/Programming.html'),
            }
        }

    }
});