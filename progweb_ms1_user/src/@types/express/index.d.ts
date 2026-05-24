// Importamos o enum de roles diretamente do Prisma para garantir que
// nossa tipagem sempre acompanhe o banco de dados.
import { users_role } from '@prisma/client';

// Essa estrutura de declare global permite sobrescrever ou adicionar 
// propriedades em bibliotecas de terceiros (neste caso, o Express).
declare global {
  namespace Express {
    // Aqui estamos exportando a interface do nosso Payload para usarmos no Service depois
    export interface UserPayload {
      id: number;
      role: users_role;
    }

    // Injetamos a propriedade 'user' (opcional) dentro do Request padrão
    export interface Request {
      user?: UserPayload;
    }
  }
}