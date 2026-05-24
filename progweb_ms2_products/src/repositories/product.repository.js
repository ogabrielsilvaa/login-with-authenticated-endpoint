class ProductRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  // Helper para incluir relações em todas as buscas
  get include() {
    return { categories: true };
  }

  async findAll() {
    return await this.prisma.products.findMany({ include: this.include });
  }

  async findById(id) {
    return await this.prisma.products.findUnique({
      where: { id: Number(id) },
      include: this.include
    });
  }

  async findByField(field, value) {
    const where = {};
    where[field] = value;
    return await this.prisma.products.findMany({ where, include: this.include });
  }

  async findByName(name) {
    return await this.prisma.products.findMany({
      where: { name: { contains: name } },
      include: this.include
    });
  }

  async create(data) {
    return await this.prisma.products.create({ data });
  }

  async update(id, data) {
    return await this.prisma.products.update({
      where: { id: Number(id) },
      data
    });
  }

  async delete(id) {
    return await this.prisma.products.delete({
      where: { id: Number(id) }
    });
  }
}

module.exports = ProductRepository;