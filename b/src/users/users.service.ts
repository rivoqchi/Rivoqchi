import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from '../shared/repositories/base.repository';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { SearchQuery } from '../common/interfaces/pagination.interface';
import { SearchHelper } from '../shared/pagination/search.helper';
import { PaginationHelper } from '../shared/pagination/pagination.helper';
import { NotFoundException, ConflictException } from '../common/exceptions/business.exception';
import { ResponseHelper } from '../utils/response.helper';
import { CACHE_KEYS } from '../common/constants/app.constants';
import { CacheService } from '../cache/cache.service';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UsersRepository extends BaseRepository<'user'> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findManyWithSearch(query: SearchQuery) {
    const { page, limit, skip, take } = SearchHelper.getPaginationParams(query);

    const where: Prisma.UserWhereInput = {
      ...SearchHelper.buildWhereFromSearch<User>(query.search, ['email', 'firstName', 'lastName']),
      ...SearchHelper.buildFilters(query.filters),
    };

    const orderBy = SearchHelper.buildOrderBy(query.sortBy, query.sortOrder, [
      'email',
      'firstName',
      'lastName',
      'createdAt',
      'updatedAt',
    ]);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            include: { role: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return ResponseHelper.paginated(users, PaginationHelper.buildMeta(total, page, limit));
  }

  async findManyWithCursor(cursor?: string, limit = 10) {
    const take = PaginationHelper.normalizeLimit(limit);

    const users = await this.prisma.user.findMany({
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const hasMore = users.length > take;
    const data = hasMore ? users.slice(0, take) : users;

    return {
      success: true,
      message: 'Success',
      data,
      meta: PaginationHelper.buildCursorMeta(data, take, hasMore),
    };
  }
}

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async findAll(query: SearchQuery) {
    return this.usersRepository.findManyWithSearch(query);
  }

  async findAllCursor(cursor?: string, limit?: number) {
    return this.usersRepository.findManyWithCursor(cursor, limit);
  }

  async findOne(id: string): Promise<UserWithoutPassword> {
    const cached = await this.cacheService.get<UserWithoutPassword>(`${CACHE_KEYS.USER_PREFIX}${id}`);
    if (cached) return cached;

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User');
    }

    await this.cacheService.set(`${CACHE_KEYS.USER_PREFIX}${id}`, user, 300);
    return user;
  }

  async create(dto: CreateUserDto): Promise<UserWithoutPassword> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        status: dto.status,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserWithoutPassword> {
    await this.findOne(id);

    const data: Prisma.UserUpdateInput = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      status: dto.status,
    };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 12);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.cacheService.del(`${CACHE_KEYS.USER_PREFIX}${id}`);
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    await this.cacheService.del(`${CACHE_KEYS.USER_PREFIX}${id}`);
  }
}
