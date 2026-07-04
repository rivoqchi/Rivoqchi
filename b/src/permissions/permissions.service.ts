import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { SearchQuery } from '../common/interfaces/pagination.interface';
import { SearchHelper } from '../shared/pagination/search.helper';
import { PaginationHelper } from '../shared/pagination/pagination.helper';
import { NotFoundException, ConflictException } from '../common/exceptions/business.exception';
import { ResponseHelper } from '../utils/response.helper';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: SearchQuery) {
    const { page, limit, skip, take } = SearchHelper.getPaginationParams(query);

    const where = SearchHelper.buildWhereFromSearch(query.search, ['name', 'description']);

    const [permissions, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip,
        take,
        orderBy: SearchHelper.buildOrderBy(query.sortBy, query.sortOrder, ['name', 'createdAt']),
      }),
      this.prisma.permission.count({ where }),
    ]);

    return ResponseHelper.paginated(permissions, PaginationHelper.buildMeta(total, page, limit));
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({ where: { id } });

    if (!permission) {
      throw new NotFoundException('Permission');
    }

    return permission;
  }

  async create(dto: CreatePermissionDto) {
    const existing = await this.prisma.permission.findUnique({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Permission already exists');
    }

    const permission = await this.prisma.permission.create({ data: dto });
    return ResponseHelper.success(permission, 'Permission created successfully');
  }

  async update(id: string, dto: UpdatePermissionDto) {
    await this.findOne(id);
    const permission = await this.prisma.permission.update({ where: { id }, data: dto });
    return ResponseHelper.success(permission, 'Permission updated successfully');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.permission.delete({ where: { id } });
    return ResponseHelper.success(null, 'Permission deleted successfully');
  }
}
