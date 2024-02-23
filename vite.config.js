import {defineConfig} from "vite";
import { resolve } from 'path';
export default defineConfig({
    esbuild: {
        drop: ['console', 'debugger'],
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                photography: resolve(__dirname, 'src/pages/Photography.html'),
                programming: resolve(__dirname, 'src/pages/Programming.html'),
            }
        }

    }
});