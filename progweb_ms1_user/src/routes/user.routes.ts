import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// ==========================================
// ROTAS DE USUÁRIO (/users)
// ==========================================

// GetAll e Post
router.route('/')
  .get(isAuthenticated, authorizeRoles('ADMIN'), userController.getAllUsers)
  .post(userController.createUser);

// GetByState (Deve vir antes do /:id para o Express não confundir 'state' com 'id')
router.get('/state/:state', userController.getUsersByState);

// GetById, Put, Patch e Delete
router.route('/:id')
  .get( isAuthenticated, authorizeRoles('ADMIN'), userController.getUserById)
  .put(isAuthenticated, authorizeRoles('ADMIN'),userController.updateUser)     // Put: Atualização completa
  .patch(isAuthenticated, authorizeRoles('ADMIN'),userController.updateUser)   // Patch: Atualização parcial (Prisma lida igual)
  .delete(isAuthenticated, authorizeRoles('ADMIN'),userController.deleteUser);

// ==========================================
// ROTAS DE ENDEREÇOS DO USUÁRIO (/users/:id/addresses)
// ==========================================

// GetAdress e PostAdress
router.route('/:id/addresses')
  .get(isAuthenticated,userController.getUserAddresses)
  .post(isAuthenticated,userController.addUserAddress);

// PutAdress, PatchAdress e DeleteAdress
router.route('/:id/addresses/:addressId')
  .put(isAuthenticated, authorizeRoles('ADMIN'),userController.updateAddress)
  .patch(isAuthenticated, authorizeRoles('ADMIN'),userController.updateAddress)
  .delete(isAuthenticated, authorizeRoles('ADMIN'),userController.deleteAddress);

export default router;