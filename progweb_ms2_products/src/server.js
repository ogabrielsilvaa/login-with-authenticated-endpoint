const app = require('./app');

const PORT = process.env.PORT || 3002;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 Microsserviço de Produto iniciado com sucesso!
  📡 Porta: ${PORT}
  🛠️  Ambiente: ${process.env.NODE_ENV || 'development'}
  📚 Swagger: http://localhost:${PORT}/api-docs
  `);
});

process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM. Encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});
