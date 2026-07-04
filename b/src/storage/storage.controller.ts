import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/auth.decorator';
import { ResponseHelper } from '../utils/response.helper';
import { StorageService } from './storage.service';

@ApiTags('Admin Uploads')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin/uploads')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Post('images')
  @ApiOperation({ summary: 'Upload gallery images' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, StorageService.getGalleryMulterOptions()),
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new BadRequestException('Hech qanday rasm yuklanmadi');
    }

    const urls = files.map((file) => `/uploads/gallery/${file.filename}`);
    return ResponseHelper.success({ urls }, 'Rasmlar yuklandi');
  }

  @Delete('images/:filename')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete uploaded gallery image' })
  async deleteImage(@Param('filename') filename: string) {
    await this.storageService.deleteGalleryImage(filename);
  }
}
