const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/AppError');

// ==========================================
// 1. MIDDLEWARE DE AUTENTICAÇÃO (Verifica o Token)
// ==========================================
const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('Token JWT não fornecido.', 401);
    }

    const parts = authHeader.split(' ');
    
    if (parts.length < 2 || parts[0] !== 'Bearer') {
      throw new AppError('Token mal formatado. O formato deve ser "Bearer <token>".', 401);
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError('Chave secreta JWT não configurada no servidor.', 500);
    }

    const decoded = jwt.verify(token, secret);

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
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Usuário não autenticado.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Acesso negado. Você não tem permissão para esta ação.', 403));
    }

    next();
  };
};

module.exports = {
  isAuthenticated,
  authorizeRoles
};
