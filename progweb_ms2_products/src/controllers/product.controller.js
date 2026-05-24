const { AppError } = require('../utils/AppError');

class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  getAll = async (req, res, next) => {
    try {
      const products = await this.productService.getAll();
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const product = await this.productService.getById(req.params.id);
      if (!product) {
        throw new AppError("Produto não encontrado", 404);
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  getByCategory = async (req, res, next) => {
    try {
      const products = await this.productService.getByCategory(req.params.id);
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  getByName = async (req, res, next) => {
    try {
      const products = await this.productService.getByName(req.query.name);
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  getByPrice = async (req, res, next) => {
    try {
      const products = await this.productService.getByPrice(req.params.price);
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  getBySize = async (req, res, next) => {
    try {
      const products = await this.productService.getBySize(req.params.size);
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const product = await this.productService.update(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.productService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ProductController;
