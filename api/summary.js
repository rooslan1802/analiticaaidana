import { getQosymshaSummary } from '../server/qosymshaAnalytics.js';

export const config = {
  maxDuration: 60
};

export default async function handler(req, res) {
  try {
    const qosymsha = await getQosymshaSummary();

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).json({
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
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error?.message || 'Ошибка аналитики' });
  }
}
