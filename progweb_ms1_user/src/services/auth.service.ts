import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import userRepository from '../repositories/user.repository';
import { AppError } from './user.service';

class AuthService {
  // ==========================================
  // SERVIÇO DE LOGIN
  // ==========================================
  async login(email: string, password_plain: string) {
    const secret = process.env.JWT_SECRET;
    
    // confiamos no formato (ex: '1d', '2h') do .env ou do fallback.
    const expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as string;

    if (!secret) {
      console.error('[ERRO CRÍTICO] JWT_SECRET não está definido no arquivo .env');
      throw new AppError('Erro interno de configuração do servidor.', 500);
    }

    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    const isPasswordValid = await bcrypt.compare(password_plain, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    // Configurando as opções do JWT com a tipagem explícita para evitar erros
    const jwtOptions: SignOptions = {
      expiresIn: expiresIn as SignOptions['expiresIn'],
    };

    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      },
      secret,
      jwtOptions
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      }
    };
  }

  // ==========================================
  // SERVIÇO DE LOGOUT (Stateless)
  // ==========================================
  async logout() {
    return {
      message: 'Logout realizado com sucesso. O cliente deve descartar o token.'
    };
  }
}

export default new AuthService();