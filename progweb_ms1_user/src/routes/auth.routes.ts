import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

// ==========================================
// ROTAS DE AUTENTICAÇÃO
// ==========================================

// Rota para autenticar o usuário e gerar o token JWT
router.post('/login', authController.login);

// Rota para invalidar a sessão (no caso do JWT, orientar o cliente a descartar o token)
router.post('/logout', authController.logout);

export default router;