import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

class UserController {
  // ==========================================
  // ENDPOINTS DE USUÁRIO
  // ==========================================

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // Forçamos o tipo para string. Se for array, o (as string) ignora o aviso, 
      // mas na prática pegamos a conversão. Se undefined, cai no fallback (1 ou 20).
      const pageQuery = req.query.page as string | undefined;
      const limitQuery = req.query.limit as string | undefined;

      const page = pageQuery ? parseInt(pageQuery, 10) : 1;
      const limit = limitQuery ? parseInt(limitQuery, 10) : 20;
      
      const users = await userService.getAllUsers(page, limit);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      // req.params no TS pode ser inferido como genérico. O 'as string' garante a segurança.
      const id = parseInt(req.params.id as string, 10);
      
      // Validação segura para booleanos no query
      const includeAddressesQuery = req.query.includeAddresses as string | undefined; 
      const includeAddresses = includeAddressesQuery === 'true'; 

      const user = await userService.getUserById(id, includeAddresses);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const updatedUser = await userService.updateUser(id, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await userService.deleteUser(id);
      res.status(204).send(); // 204 indica sucesso, mas sem corpo na resposta
    } catch (error) {
      next(error);
    }
  }

  async getUsersByState(req: Request, res: Response, next: NextFunction) {
    try {
      const state = req.params.state as string;
      const users = await userService.getUsersByState(state);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ENDPOINTS DE ENDEREÇO
  // ==========================================

  async getUserAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id as string, 10);
      const addresses = await userService.getUserAddresses(userId);
      res.status(200).json(addresses);
    } catch (error) {
      next(error);
    }
  }

  async addUserAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id as string, 10);
      const address = await userService.addUserAddress(userId, req.body);
      res.status(201).json(address);
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id as string, 10);
      const addressId = parseInt(req.params.addressId as string, 10);
      
      const updatedAddress = await userService.updateAddress(addressId, userId, req.body);
      res.status(200).json(updatedAddress);
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id as string, 10);
      const addressId = parseInt(req.params.addressId as string, 10);
      
      await userService.deleteAddress(addressId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();