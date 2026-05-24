class CategoryService {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getAll() { return await this.categoryRepository.findAll(); }

  async getById(id) { return await this.categoryRepository.findById(id); }

  async create(data) { return await this.categoryRepository.create(data); }

  async update(id, data) { return await this.categoryRepository.update(id, data); }

  async delete(id) { return await this.categoryRepository.delete(id); }
}

module.exports = CategoryService;
