import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'


export default defineConfig({
    plugins: [react()],
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },
    resolve: {
        alias: {
            '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
        }
    }
})
