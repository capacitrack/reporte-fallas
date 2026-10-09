export default function handler(req, res) {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reportes de Fallas Gusi</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f0f4f8;
            color: #17324d;
            text-align: center;
            padding: 60px 20px;
          }
          main {
            max-width: 500px;
            margin: auto;
            padding: 30px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px #0001;
          }
          h1 { color: #123b64; }
          .status { color: #16803c; font-weight: bold; }
        </style>
      </head>
      <body>
        <main>
          <h1>🚛 Reportes de Fallas Gusi</h1>
          <p>Sistema de reportes de Transportes</p>
          <p class="status">Aplicación publicada correctamente</p>
          <p>El siguiente paso es conectar el bot de Telegram.</p>
        </main>
      </body>
    </html>
  `);
}
