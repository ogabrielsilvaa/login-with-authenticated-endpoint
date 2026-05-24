const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const CategoryRepository = require('../repositories/category.repository');
const CategoryService = require('../services/category.service');
const CategoryController = require('../controllers/category.controller');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();
const repository = new CategoryRepository(prisma);
const service = new CategoryService(repository);
const controller = new CategoryController(service);

router.use(isAuthenticated);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Rotas restritas para ADMIN
router.post('/', authorizeRoles('ADMIN'), controller.create);
router.put('/:id', authorizeRoles('ADMIN'), controller.update);
router.delete('/:id', authorizeRoles('ADMIN'), controller.delete);

module.exports = router;
