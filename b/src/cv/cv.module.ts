import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { CvAdminController } from './cv-admin.controller';
import { ProjectInteractionsController } from './project-interactions.controller';

@Module({
  controllers: [CvController, CvAdminController, ProjectInteractionsController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}
