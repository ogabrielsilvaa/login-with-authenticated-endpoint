/**
 * @typedef {Object} UserPayload
 * @property {number} id - ID do usuário autenticado
 * @property {'USER'|'ADMIN'} role - Papel do usuário
 */

/**
 * @typedef {Object} ProductCreateInput
 * @property {number} category_id - ID da categoria
 * @property {string} name - Nome do produto
 * @property {string} [description] - Descrição do produto
 * @property {number} price - Preço do produto
 * @property {string} [size] - Tamanho do produto (ex: M, G, 42)
 */

/**
 * @typedef {Object} ProductUpdateInput
 * @property {number} [category_id]
 * @property {string} [name]
 * @property {string} [description]
 * @property {number} [price]
 * @property {string} [size]
 */
