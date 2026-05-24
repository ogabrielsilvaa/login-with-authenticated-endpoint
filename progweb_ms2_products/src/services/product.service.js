class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getAll() { return await this.productRepository.findAll(); }

  async getById(id) { return await this.productRepository.findById(id); }

  async getByCategory(categoryId) {
    return await this.productRepository.findByField('category_id', Number(categoryId));
  }

  async getByName(name) { return await this.productRepository.findByName(name); }

  async getByPrice(price) {
    return await this.productRepository.findByField('price', Number(price));
  }

  async getBySize(size) { return await this.productRepository.findByField('size', size); }

  async create(data) { return await this.productRepository.create(data); }

  async update(id, data) { return await this.productRepository.update(id, data); }

  async delete(id) { return await this.productRepository.delete(id); }
}

module.exports = ProductService;