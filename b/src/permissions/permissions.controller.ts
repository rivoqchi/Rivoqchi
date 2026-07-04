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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { SearchQueryDto } from '../common/dto/pagination.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { Permissions } from '../common/decorators/auth.decorator';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Get()
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get all permissions' })
  findAll(@Query() query: SearchQueryDto) {
    return this.permissionsService.findAll(query);
  }

  @Get(':id')
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get permission by ID' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.permissionsService.findOne(id);
  }

  @Post()
  @Permissions('permissions:manage')
  @ApiOperation({ summary: 'Create a new permission' })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Patch(':id')
  @Permissions('permissions:manage')
  @ApiOperation({ summary: 'Update permission' })
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('permissions:manage')
  @ApiOperation({ summary: 'Delete permission' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.permissionsService.remove(id);
  }
}
