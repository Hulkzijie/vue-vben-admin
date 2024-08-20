import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          '/jeecg-boot': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/jeecg-boot/, ''),
            // mock代理目标地址
            target: 'http://localhost:8080/jeecg-boot',
            ws: true,
          },
        },
      },
    },
  };
});
