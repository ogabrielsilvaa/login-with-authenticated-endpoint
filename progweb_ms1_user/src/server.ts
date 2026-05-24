import 'dotenv/config'; // Garante que o .env seja lido antes de tudo
import app from './app';
import { prisma } from './config/prisma';

// Usa a porta do .env ou cai para 3001 (evita conflito com frontends rodando na 3000)
const PORT = process.env.PORT || 3001;

async function bootstrap() {
  try {
    // 1. Testa a conexão com o banco ANTES de abrir a porta HTTP
    await prisma.$connect();
    console.log('✅ Banco de dados conectado com sucesso (Prisma/MariaDB).');

    // 2. Inicia o servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 Serviço de Usuários rodando na porta ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api/v1/users`);
      console.log(`🩺 Health Check: http://localhost:${PORT}/health`);
      console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
    });

    // 3. Graceful Shutdown (Desligamento Gracioso)
    // Se o Docker/PM2 pedir para desligar, terminamos as requisições ativas e fechamos o banco
    const gracefulShutdown = async () => {
      console.log('\n🛑 Sinal de encerramento recebido. Desligando servidor...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('💤 Conexão com o banco de dados encerrada. Serviço finalizado.');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown); // Ctrl+C
    process.on('SIGTERM', gracefulShutdown); // Docker/Kill command

  } catch (error) {
    console.error('❌ Falha crítica ao iniciar o serviço:', error);
    await prisma.$disconnect();
    process.exit(1); // Encerra o processo com código de erro
  }
}

bootstrap();