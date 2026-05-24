import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';


// Objeto de seleção padrão para evitar o vazamento do password_hash
// O schema confirma que os campos estão em snake_case
const userDefaultSelect = {
  id: true,
  email: true,
  full_name: true,
  phone: true,
  role: true,
  created_at: true,
  updated_at: true,
};

export class UserRepository {
  // ==========================================
  // MÉTODOS DE USUÁRIO
  // ==========================================

  /**
   * Busca todos os usuários (GetAll).
   */
  async findAll(skip: number = 0, take: number = 20) {
    return prisma.users.findMany({
      skip,
      take,
      select: userDefaultSelect,
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Busca um usuário pelo ID, opcionalmente trazendo seus endereços (GetById).
   */
  async findById(id: number, includeAddresses: boolean = false) {
    return prisma.users.findUnique({
      where: { id },
      select: {
        ...userDefaultSelect,
        user_addresses: includeAddresses, // O Prisma lê o nome exato da relação
      },
    });
  } 

  /**
   * UTILITÁRIO INTERNO: Busca usuário pelo email INCLUINDO o password_hash.
   * IMPORTANTE: Use este método APENAS no Service de Autenticação/Login.
   */
  async findByEmailWithPassword(email: string) {
    return prisma.users.findUnique({
      where: { email },
    });
  }

  /**
   * UTILITÁRIO INTERNO: Verifica se um email já existe (para validação de cadastro).
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const count = await prisma.users.count({ where: { email } });
    return count > 0;
  }

  /**
   * Cria um novo usuário (Post).
   */
  async create(data: Prisma.usersCreateInput) {
    return prisma.users.create({
      data,
      select: userDefaultSelect,
    });
  }

  /**
   * Atualiza os dados de um usuário (Put/Patch).
   */
  async update(id: number, data: Prisma.usersUpdateInput) {
    return prisma.users.update({
      where: { id },
      data,
      select: userDefaultSelect,
    });
  }

  /**
   * Remove um usuário (Delete).
   */
  async delete(id: number) {
    return prisma.users.delete({
      where: { id },
      select: { id: true },
    });
  }

  /**
   * Filtra usuários que possuem endereço em um estado específico (GetByState).
   */
  async findByState(state: string) {
    return prisma.users.findMany({
      where: {
        user_addresses: {
          some: {
            state: {
              equals: state,
            },
          },
        },
      },
      select: {
        ...userDefaultSelect,
        user_addresses: {
          where: { state },
        },
      },
    });
  }

  // ==========================================
  // MÉTODOS DE ENDEREÇO (ADDRESSES)
  // ==========================================

  /**
   * Retorna todos os endereços de um usuário específico (GetAdress).
   */
  async findAddressesByUserId(userId: number) {
    return prisma.user_addresses.findMany({
      where: { user_id: userId },
      orderBy: { is_main: 'desc' },
    });
  }

  /**
   * Busca um endereço específico para validação.
   */
  async findAddressById(id: number) {
    return prisma.user_addresses.findUnique({
      where: { id },
    });
  }

  /**
   * Cria um endereço para o usuário (PostAdress).
   */
  async createAddress(userId: number, data: Prisma.user_addressesCreateWithoutUsersInput) {
    if (data.is_main) {
      return prisma.$transaction(async (tx) => {
        await tx.user_addresses.updateMany({
          where: { user_id: userId, is_main: true },
          data: { is_main: false },
        });
        return tx.user_addresses.create({
          data: { ...data, user_id: userId },
        });
      });
    }

    return prisma.user_addresses.create({
      data: { ...data, user_id: userId },
    });
  }

  /**
   * Atualiza um endereço (PutAdress).
   */
  async updateAddress(addressId: number, userId: number, data: Prisma.user_addressesUpdateInput) {
    if (data.is_main === true) {
      return prisma.$transaction(async (tx) => {
        await tx.user_addresses.updateMany({
          where: { user_id: userId, id: { not: addressId } },
          data: { is_main: false },
        });
        return tx.user_addresses.update({
          where: { id: addressId },
          data,
        });
      });
    }

    return prisma.user_addresses.update({
      where: { id: addressId },
      data,
    });
  }

  /**
   * Deleta um endereço (DeleteAdress).
   */
  async deleteAddress(addressId: number) {
    return prisma.user_addresses.delete({
      where: { id: addressId },
    });
  }
}

export default new UserRepository();