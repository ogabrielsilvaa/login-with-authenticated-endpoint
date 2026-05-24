import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../services/user.service';
import { users_role } from '@prisma/client';

// ==========================================
// 1. MIDDLEWARE DE AUTENTICAÇÃO (Verifica o Token)
// ==========================================
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Verifica se o header existe
    if (!authHeader) {
      throw new AppError('Token JWT não fornecido.', 401);
    }

    // 2. Verifica se o formato é "Bearer <token>"
    // Alguns clientes podem esquecer o prefixo ou o Swagger pode duplicar.
    // Esta lógica limpa o header e pega apenas a última parte (o token real).
    const parts = authHeader.split(' ');
    
    if (parts.length < 2 || parts[0] !== 'Bearer') {
      throw new AppError('Token mal formatado. O formato deve ser "Bearer <token>".', 401);
    }

    const token = parts[1];

    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as Express.UserPayload;

    req.user = decoded;

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Seu token expirou. Faça login novamente.', 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Token inválido ou corrompido.', 401));
    }
    next(error);
  }
};
// ==========================================
// 2. MIDDLEWARE DE AUTORIZAÇÃO (Verifica o Role)
// ==========================================
/**
 * Factory Function: É uma função que recebe os cargos permitidos e retorna um middleware.
 * Exemplo de uso: authorizeRoles('ADMIN') ou authorizeRoles('ADMIN', 'USER')
 */
export const authorizeRoles = (...allowedRoles: users_role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Garante que o usuário está logado (req.user existe)
    if (!req.user) {
      return next(new AppError('Usuário não autenticado.', 401));
    }

    // 2. Verifica se o 'role' do usuário atual está dentro do array de cargos permitidos
    if (!allowedRoles.includes(req.user.role)) {
      // 403 Forbidden: Eu sei quem você é (autenticado), mas você não tem permissão para entrar aqui.
      return next(new AppError('Acesso negado. Você não tem permissão para executar esta ação.', 403));
    }

    // 3. Tem permissão? Segue o fluxo.
    next();
  };
};