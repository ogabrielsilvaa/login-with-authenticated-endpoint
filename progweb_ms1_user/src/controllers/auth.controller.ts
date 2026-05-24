import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { AppError } from '../services/user.service';

class AuthController {
  // ==========================================
  // ENDPOINT DE LOGIN
  // ==========================================
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Extraímos os dados assumindo que o frontend enviará as chaves 'email' e 'password'
      const { email, password } = req.body;

      // Validação defensiva básica antes de acionar a camada de serviço
      if (!email || !password) {
        throw new AppError('E-mail e senha são obrigatórios para realizar o login.', 400);
      }

      // O Service faz a busca, compara o hash e gera o JWT
      const result = await authService.login(email, password);
      
      // Retorna 200 OK com o token e os dados públicos do usuário
      res.status(200).json(result);
    } catch (error) {
      next(error); // Encaminha para o nosso Middleware de Erros Global
    }
  }

  // ==========================================
  // ENDPOINT DE LOGOUT
  // ==========================================
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.logout();
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();