const TELEGRAM_API = 'https://api.telegram.org';

async function telegram(method, body) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error('Falta configurar TELEGRAM_BOT_TOKEN');
  }

  const response = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Telegram respondió ${response.status}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot de Reportes Gusi activo');
  }

  try {
    const update = req.body;

    if (update.message) {
      const chatId = update.message.chat.id;
      const message = update.message.text || '';

      if (message === '/start') {
        await telegram('sendMessage', {
          chat_id: chatId,
          text:
            '🚛 ¡Bienvenido al sistema de Reportes de Fallas Gusi!\n\n' +
            'Aquí podrás registrar fallas de las unidades de Transportes.\n\n' +
            'Selecciona una opción para continuar:',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '📝 Crear reporte de falla',
                  callback_data: 'crear_reporte',
                },
              ],
              [
                {
                  text: '🔎 Consultar un reporte',
                  callback_data: 'consultar_reporte',
                },
              ],
            ],
          },
        });
      }
    }

    if (update.callback_query) {
      const query = update.callback_query;

      await telegram('answerCallbackQuery', {
        callback_query_id: query.id,
      });

      if (query.data === 'crear_reporte') {
        await telegram('sendMessage', {
          chat_id: query.message.chat.id,
          text:
            '📝 Vamos a crear tu reporte de falla.\n\n' +
            'Primero, selecciona el tipo de equipo:',
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Tracto', callback_data: 'equipo_tracto' },
                { text: 'Kenworth (KW)', callback_data: 'equipo_kw' },
              ],
              [
                { text: 'Scania', callback_data: 'equipo_scania' },
                { text: 'Termo', callback_data: 'equipo_termo' },
              ],
              [
                { text: 'Autobús', callback_data: 'equipo_autobus' },
                { text: 'Otro', callback_data: 'equipo_otro' },
              ],
            ],
          },
        });
      } else if (query.data === 'consultar_reporte') {
        await telegram('sendMessage', {
          chat_id: query.message.chat.id,
          text:
            '🔎 La consulta de reportes estará disponible ' +
            'cuando conectemos la base de datos.',
        });
      } else if (query.data.startsWith('equipo_')) {
        const equipos = {
          equipo_tracto: 'Tracto',
          equipo_kw: 'Kenworth (KW)',
          equipo_scania: 'Scania',
          equipo_termo: 'Termo',
          equipo_autobus: 'Autobús',
          equipo_otro: 'Otro',
        };

        await telegram('sendMessage', {
          chat_id: query.message.chat.id,
          text:
            `Equipo seleccionado: ${equipos[query.data]}\n\n` +
            'Perfecto. En el siguiente paso agregaremos ' +
            'las preguntas para registrar el número económico, ' +
            'kilometraje y descripción de la falla.',
        });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error procesando actualización:', error);
    return res.status(200).json({ ok: true });
  }
}
