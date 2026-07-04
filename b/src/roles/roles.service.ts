import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './dto/role.dto';
import { SearchQuery } from '../common/interfaces/pagination.interface';
import { SearchHelper } from '../shared/pagination/search.helper';
import { PaginationHelper } from '../shared/pagination/pagination.helper';
import { NotFoundException, ConflictException } from '../common/exceptions/business.exception';
import { ResponseHelper } from '../utils/response.helper';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: SearchQuery) {
    const { page, limit, skip, take } = SearchHelper.getPaginationParams(query);

    const where = SearchHelper.buildWhereFromSearch(query.search, ['name', 'description']);

    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip,
        take,
        orderBy: SearchHelper.buildOrderBy(query.sortBy, query.sortOrder, ['name', 'createdAt']),
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      }),
      this.prisma.role.count({ where }),
    ]);

    return ResponseHelper.paginated(roles, PaginationHelper.buildMeta(total, page, limit));
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role');
    }

    return role;
  }

  async create(dto: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Role already exists');
    }

    const role = await this.prisma.role.create({ data: dto });
    return ResponseHelper.success(role, 'Role created successfully');
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.findOne(id);
    const role = await this.prisma.role.update({ where: { id }, data: dto });
    return ResponseHelper.success(role, 'Role updated successfully');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.role.delete({ where: { id } });
    return ResponseHelper.success(null, 'Role deleted successfully');
  }

  async assignPermissions(id: string, dto: AssignPermissionsDto) {
    await this.findOne(id);

    await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });

    await this.prisma.rolePermission.createMany({
      data: dto.permissionIds.map((permissionId) => ({
        roleId: id,
        permissionId,
      })),
    });

    const role = await this.findOne(id);
    return ResponseHelper.success(role, 'Permissions assigned successfully');
  }
}
