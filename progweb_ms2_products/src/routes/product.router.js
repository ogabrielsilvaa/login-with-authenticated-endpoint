const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const ProductRepository = require('../repositories/product.repository');
const ProductService = require('../services/product.service');
const ProductController = require('../controllers/product.controller');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();
const repository = new ProductRepository(prisma);
const service = new ProductService(repository);
const controller = new ProductController(service);

router.use(isAuthenticated);

router.get('/', controller.getAll);
router.get('/search/name', controller.getByName);
router.get('/category/:id', controller.getByCategory);
router.get('/price/:price', controller.getByPrice);
router.get('/size/:size', controller.getBySize);
router.get('/:id', controller.getById);

// Rotas restritas para ADMIN
router.post('/', authorizeRoles('ADMIN'), controller.create);
router.put('/:id', authorizeRoles('ADMIN'), controller.update);
router.delete('/:id', authorizeRoles('ADMIN'), controller.delete);

module.exports = router;
