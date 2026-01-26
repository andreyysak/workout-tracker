import { defineConfig } from 'vite'
import mpa from 'vite-plugin-mpa'
import injectHTML from "vite-plugin-html-inject";

export default defineConfig({
    plugins: [
        // @ts-ignore
        (mpa.default || mpa)({
            open: 'index.html',
            scanDir: 'src/views',
        }),
        injectHTML(),
    ],
    server: {
        port: 5185,
    },
})