class CategoryRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async findAll() {
    return await this.prisma.categories.findMany();
  }

  async findById(id) {
    return await this.prisma.categories.findUnique({
      where: { id: Number(id) }
    });
  }

  async create(data) {
    return await this.prisma.categories.create({ data });
  }

  async update(id, data) {
    return await this.prisma.categories.update({
      where: { id: Number(id) },
      data
    });
  }

  async delete(id) {
    return await this.prisma.categories.delete({
      where: { id: Number(id) }
    });
  }
}

module.exports = CategoryRepository;
