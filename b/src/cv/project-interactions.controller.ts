import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Locale } from '@prisma/client';
import { Public } from '../common/decorators/auth.decorator';
import { ResponseHelper } from '../utils/response.helper';
import { CvService } from './cv.service';
import { ProjectVisitorDto } from './dto/project-interaction.dto';

@ApiTags('Content')
@Controller('content/projects')
export class ProjectInteractionsController {
  constructor(private cvService: CvService) {}

  @Public()
  @Get(':locale/interactions')
  @ApiOperation({ summary: 'Get project likes/views and visitor state' })
  @ApiQuery({ name: 'visitorKey', required: true })
  async getInteractions(
    @Param('locale') locale: Locale,
    @Query('visitorKey') visitorKey: string,
  ) {
    const data = await this.cvService.getProjectInteractions(locale, visitorKey);
    return ResponseHelper.success(data);
  }

  @Public()
  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on a project' })
  async toggleLike(@Param('id') id: string, @Body() dto: ProjectVisitorDto) {
    const data = await this.cvService.toggleProjectLike(id, dto.visitorKey);
    return ResponseHelper.success(data);
  }

  @Public()
  @Post(':id/view')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record a project view' })
  async recordView(@Param('id') id: string, @Body() dto: ProjectVisitorDto) {
    const data = await this.cvService.recordProjectView(id, dto.visitorKey);
    return ResponseHelper.success(data);
  }
}
