import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { SearchQueryDto, CursorPaginationDto } from '../common/dto/pagination.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { Permissions } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/jwt-payload.interface';
import { ResponseHelper } from '../utils/response.helper';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    const profile = await this.usersService.findOne(user.id);
    return ResponseHelper.success(profile);
  }

  @Get()
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get all users with offset pagination' })
  async findAll(@Query() query: SearchQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get('cursor')
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get all users with cursor pagination' })
  async findAllCursor(@Query() query: CursorPaginationDto) {
    return this.usersService.findAllCursor(query.cursor, query.limit);
  }

  @Get(':id')
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const user = await this.usersService.findOne(id);
    return ResponseHelper.success(user);
  }

  @Post()
  @Permissions('users:create')
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return ResponseHelper.success(user, 'User created successfully');
  }

  @Patch(':id')
  @Permissions('users:update')
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);
    return ResponseHelper.success(user, 'User updated successfully');
  }

  @Delete(':id')
  @Permissions('users:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    await this.usersService.remove(id);
  }
}
