import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './dto/role.dto';
import { SearchQueryDto } from '../common/dto/pagination.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { Permissions } from '../common/decorators/auth.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @Permissions('roles:read')
  @ApiOperation({ summary: 'Get all roles' })
  findAll(@Query() query: SearchQueryDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  @Permissions('roles:read')
  @ApiOperation({ summary: 'Get role by ID' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Permissions('roles:manage')
  @ApiOperation({ summary: 'Create a new role' })
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Patch(':id')
  @Permissions('roles:manage')
  @ApiOperation({ summary: 'Update role' })
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('roles:manage')
  @ApiOperation({ summary: 'Delete role' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.rolesService.remove(id);
  }

  @Post(':id/permissions')
  @Permissions('roles:manage')
  @ApiOperation({ summary: 'Assign permissions to role' })
  assignPermissions(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, dto);
  }
}
