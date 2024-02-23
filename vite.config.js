import {defineConfig} from "vite";
import { resolve } from 'path';
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                landing: resolve(__dirname, 'index.html'),
                programming: resolve(__dirname, 'pages/Programming.html'),
                photo: resolve(__dirname, 'pages/Photography.html'),
            }
        }

    }
});