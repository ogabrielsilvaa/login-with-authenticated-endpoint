import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository';
import { Prisma } from '@prisma/client';

// ==========================================
// UTILITÁRIO DE ERRO (Recomendado extrair para src/utils/AppError.ts depois)
// ==========================================
export class AppError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

class UserService {
  // ==========================================
  // SERVIÇOS DE USUÁRIO
  // ==========================================

  /**
   * Post - Cria um novo usuário
   */
  async createUser(data: Prisma.usersCreateInput) {
    // 1. Valida se o email já existe
    const emailExists = await userRepository.checkEmailExists(data.email);
    if (emailExists) {
      throw new AppError('Este e-mail já está em uso.', 409); // 409 Conflict
    }

    // 2. Criptografa a senha antes de salvar (Salt rounds = 10)
    const hashedPassword = await bcrypt.hash(data.password_hash, 10);

    // 3. Monta o objeto final e envia ao repositório
    const userData = {
      ...data,
      password_hash: hashedPassword,
    };

    return userRepository.create(userData);
  }

  /**
   * GetAll - Lista usuários com paginação
   */
  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return userRepository.findAll(skip, limit);
  }

  /**
   * GetById - Busca usuário por ID
   */
  async getUserById(id: number, includeAddresses: boolean = false) {
    const user = await userRepository.findById(id, includeAddresses);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }
    return user;
  }

  /**
   * Put / Patch - Atualiza dados do usuário
   */
  async updateUser(id: number, data: Prisma.usersUpdateInput) {
    // 1. Garante que o usuário existe
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    // 2. Se estiver tentando alterar o e-mail, checa se o novo e-mail já pertence a outro
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await userRepository.checkEmailExists(data.email as string);
      if (emailExists) {
        throw new AppError('Este e-mail já está sendo usado por outra conta.', 409);
      }
    }

    // 3. Se enviou uma nova senha, faz o hash
    let updateData = { ...data };
    if (data.password_hash) {
      updateData.password_hash = await bcrypt.hash(data.password_hash as string, 10);
    }

    return userRepository.update(id, updateData);
  }

  /**
   * Delete - Remove um usuário
   */
  async deleteUser(id: number) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }
    return userRepository.delete(id);
  }

  /**
   * GetByState - Busca usuários por estado (Ex: SP, RJ)
   */
  async getUsersByState(state: string) {
    if (!state) throw new AppError('O estado é obrigatório para esta busca.', 400);
    return userRepository.findByState(state);
  }

  // ==========================================
  // SERVIÇOS DE ENDEREÇO
  // ==========================================

  /**
   * GetAdress - Lista endereços de um usuário
   */
  async getUserAddresses(userId: number) {
    // Verifica se o usuário existe antes de buscar os endereços
    await this.getUserById(userId); 
    return userRepository.findAddressesByUserId(userId);
  }

  /**
   * PostAdress - Adiciona um endereço ao usuário
   */
  async addUserAddress(userId: number, data: Prisma.user_addressesCreateWithoutUsersInput) {
    await this.getUserById(userId); // Valida existência
    return userRepository.createAddress(userId, data);
  }

  /**
   * PutAdress / PatchAdress - Atualiza um endereço
   */
  async updateAddress(addressId: number, userId: number, data: Prisma.user_addressesUpdateInput) {
    const address = await userRepository.findAddressById(addressId);
    
    if (!address) {
      throw new AppError('Endereço não encontrado.', 404);
    }

    // Regra de Segurança Crítica: Garantir que o endereço pertence ao usuário que está tentando alterar
    if (address.user_id !== userId) {
      throw new AppError('Acesso negado: Este endereço não pertence a este usuário.', 403);
    }

    return userRepository.updateAddress(addressId, userId, data);
  }

  /**
   * DeleteAdress - Deleta um endereço
   */
  async deleteAddress(addressId: number, userId: number) {
    const address = await userRepository.findAddressById(addressId);
    
    if (!address) {
      throw new AppError('Endereço não encontrado.', 404);
    }

    // Regra de Segurança Crítica: Garantir que o endereço pertence ao usuário
    if (address.user_id !== userId) {
      throw new AppError('Acesso negado: Este endereço não pertence a este usuário.', 403);
    }

    return userRepository.deleteAddress(addressId);
  }
}

export default new UserService();