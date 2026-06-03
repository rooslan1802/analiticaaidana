import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { getQosymshaSummary } from './server/qosymshaAnalytics.js';

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [
      react(),
      {
        name: 'qosymsha-api',
        configureServer(server) {
          server.middlewares.use('/api/summary', async (req, res) => {
            try {
              const qosymsha = await getQosymshaSummary();
              const payload = {
                ok: qosymsha.ok,
                source: qosymsha.ok ? 'qosymsha' : '',
                updatedAt: new Date().toLocaleString('ru-RU', {
                  timeZone: 'Asia/Almaty',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                cities: qosymsha.cities || [],
                errors: qosymsha.errors || []
              };
              res.setHeader('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
              res.setHeader('pragma', 'no-cache');
              res.setHeader('expires', '0');
              res.setHeader('content-type', 'application/json; charset=utf-8');
              res.end(JSON.stringify(payload));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader('content-type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ ok: false, message: error?.message || 'Ошибка Qosymsha' }));
            }
          });
        }
      }
    ]
  };
});
