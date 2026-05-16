import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // Using relative paths is essential for FiveM/RedM NUI
  build: {
    outDir: '../html',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/js/[name].[hash].js`,
        chunkFileNames: `assets/js/[name].[hash].js`,
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/mp4|webm|ogg/i.test(extType)) {
            extType = 'video';
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          } else if (/mp3|wav|ogg|flac/i.test(extType)) {
            extType = 'music';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
