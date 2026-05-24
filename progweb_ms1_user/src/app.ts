import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.routes';
import { AppError } from './services/user.service';
import authRoutes from './routes/auth.routes';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();

// ==========================================
// CONFIGURAÇÃO DO SWAGGER (Deve vir antes das rotas da API)
// ==========================================
// Resolve o caminho do arquivo YAML de forma segura, seja rodando via ts-node ou arquivo compilado
const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// ==========================================
// MIDDLEWARES GLOBAIS
// ==========================================
app.use(helmet()); // Adiciona headers de segurança (previne XSS, Clickjacking, etc)
app.use(cors()); // Permite que seu frontend/outros serviços chamem esta API
app.use(express.json()); // Permite leitura de JSON no req.body

// ==========================================
// ROTAS
// ==========================================
// Adicionei o prefixo /api/v1. É uma regra de ouro em arquitetura de microsserviços 
// para facilitar atualizações futuras sem quebrar os clientes atuais.
app.use('/api/v1/users', userRoutes);

app.use('/api/v1/auth', authRoutes);

// Rota de Health Check (Essencial para o Docker/Kubernetes saber se o serviço está vivo)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', service: 'ecommerce_users', timestamp: new Date() });
});

// ==========================================
// TRATAMENTO DE ERROS GLOBAL (Sempre o último middleware)
// ==========================================
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Se não for um erro mapeado por nós, logamos para o console e retornamos 500
  console.error('[ERRO CRÍTICO NÃO TRATADO]:', err);
  
  return res.status(500).json({
    status: 'error',
    message: 'Erro interno no servidor.',
  });
});

export default app;