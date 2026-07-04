import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Locale } from '@prisma/client';
import { Public } from '../common/decorators/auth.decorator';
import { ResponseHelper } from '../utils/response.helper';
import { CvService } from './cv.service';

@ApiTags('Content')
@Controller('content')
export class CvController {
  constructor(private cvService: CvService) {}

  @Public()
  @Get(':locale')
  @ApiOperation({ summary: 'Get all site content for a locale' })
  async getContent(@Param('locale') locale: Locale) {
    const content = await this.cvService.getContentByLocale(locale);
    return ResponseHelper.success(content);
  }
}
