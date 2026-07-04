import { PrismaService } from '../../prisma/prisma.service';

export abstract class BaseRepository<TModel extends keyof PrismaService> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: TModel,
  ) {}

  protected get delegate() {
    return this.prisma[this.model] as {
      findUnique: (args: unknown) => Promise<unknown>;
      findFirst: (args: unknown) => Promise<unknown>;
      findMany: (args?: unknown) => Promise<unknown[]>;
      create: (args: unknown) => Promise<unknown>;
      update: (args: unknown) => Promise<unknown>;
      delete: (args: unknown) => Promise<unknown>;
      count: (args?: unknown) => Promise<number>;
    };
  }
}
