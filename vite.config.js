import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite';
export default defineConfig({
    base: './',
    plugins: [vue()],
    optimizeDeps: {
        include: ['schart.js']
    },
    // server: {
    //     proxy: { // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
    //         // 正则表达式写法
    //         '/api': {
    //             target: 'http://127.0.0.1:9090', // 后端服务实际地址
    //             changeOrigin: true, //开启代理
    //             rewrite: (path) => path.replace(/^\/api/, '')
    //         }
    //     }
    // }
})