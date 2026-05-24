const { AppError } = require('../utils/AppError');

class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  getAll = async (req, res, next) => {
    try {
      const categories = await this.categoryService.getAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const category = await this.categoryService.getById(req.params.id);
      if (!category) {
        throw new AppError("Categoria não encontrada", 404);
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const category = await this.categoryService.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const category = await this.categoryService.update(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.categoryService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CategoryController;
