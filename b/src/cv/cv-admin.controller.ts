import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Locale } from '@prisma/client';
import { Roles } from '../common/decorators/auth.decorator';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { ResponseHelper } from '../utils/response.helper';
import { CvService } from './cv.service';
import {
  CreateExperienceDto,
  CreateProjectDto,
  CreateSkillDto,
  CreateSocialLinkDto,
  UpdateExperienceDto,
  UpdatePersonalDto,
  UpdateProjectDto,
  UpdateSeoSettingsDto,
  UpdateSiteSettingsDto,
  UpdateSkillDto,
  UpdateSocialLinkDto,
  UpdateTranslationsDto,
} from './dto/cv.dto';

@ApiTags('Admin Content')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin/content')
export class CvAdminController {
  constructor(private cvService: CvService) {}

  @Get(':locale')
  @ApiOperation({ summary: 'Get all content for admin editing' })
  async getAdminData(@Param('locale') locale: Locale) {
    const content = await this.cvService.getAdminData(locale);
    return ResponseHelper.success(content);
  }

  @Patch('personal/:locale')
  @ApiOperation({ summary: 'Update personal info' })
  async updatePersonal(
    @Param('locale') locale: Locale,
    @Body() dto: UpdatePersonalDto,
  ) {
    const result = await this.cvService.updatePersonal(locale, dto);
    return ResponseHelper.success(result, 'Personal info updated');
  }

  @Post('social-links/:locale')
  @ApiOperation({ summary: 'Create social link' })
  async createSocialLink(
    @Param('locale') locale: Locale,
    @Body() dto: CreateSocialLinkDto,
  ) {
    const result = await this.cvService.createSocialLink(locale, dto);
    return ResponseHelper.success(result, 'Social link created');
  }

  @Patch('social-links/:id')
  @ApiOperation({ summary: 'Update social link' })
  async updateSocialLink(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateSocialLinkDto,
  ) {
    const result = await this.cvService.updateSocialLink(id, dto);
    return ResponseHelper.success(result, 'Social link updated');
  }

  @Delete('social-links/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete social link' })
  async deleteSocialLink(@Param('id', ParseObjectIdPipe) id: string) {
    await this.cvService.deleteSocialLink(id);
  }

  @Post('experiences')
  @ApiOperation({ summary: 'Create experience' })
  async createExperience(@Body() dto: CreateExperienceDto) {
    const result = await this.cvService.createExperience(dto);
    return ResponseHelper.success(result, 'Experience created');
  }

  @Patch('experiences/:id')
  @ApiOperation({ summary: 'Update experience' })
  async updateExperience(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateExperienceDto,
  ) {
    const result = await this.cvService.updateExperience(id, dto);
    return ResponseHelper.success(result, 'Experience updated');
  }

  @Delete('experiences/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete experience' })
  async deleteExperience(@Param('id', ParseObjectIdPipe) id: string) {
    await this.cvService.deleteExperience(id);
  }

  @Post('skills')
  @ApiOperation({ summary: 'Create skill' })
  async createSkill(@Body() dto: CreateSkillDto) {
    const result = await this.cvService.createSkill(dto);
    return ResponseHelper.success(result, 'Skill created');
  }

  @Patch('skills/:id')
  @ApiOperation({ summary: 'Update skill' })
  async updateSkill(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateSkillDto,
  ) {
    const result = await this.cvService.updateSkill(id, dto);
    return ResponseHelper.success(result, 'Skill updated');
  }

  @Delete('skills/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete skill' })
  async deleteSkill(@Param('id', ParseObjectIdPipe) id: string) {
    await this.cvService.deleteSkill(id);
  }

  @Post('projects')
  @ApiOperation({ summary: 'Create project' })
  async createProject(@Body() dto: CreateProjectDto) {
    const result = await this.cvService.createProject(dto);
    return ResponseHelper.success(result, 'Project created');
  }

  @Patch('projects/:id')
  @ApiOperation({ summary: 'Update project' })
  async updateProject(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    const result = await this.cvService.updateProject(id, dto);
    return ResponseHelper.success(result, 'Project updated');
  }

  @Delete('projects/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete project' })
  async deleteProject(@Param('id', ParseObjectIdPipe) id: string) {
    await this.cvService.deleteProject(id);
  }

  @Patch('translations/:locale')
  @ApiOperation({ summary: 'Update UI translations' })
  async updateTranslations(
    @Param('locale') locale: Locale,
    @Body() dto: UpdateTranslationsDto,
  ) {
    const result = await this.cvService.updateTranslations(locale, dto);
    return ResponseHelper.success(result, 'Translations updated');
  }

  @Patch('site-settings')
  @ApiOperation({ summary: 'Update site settings' })
  async updateSiteSettings(@Body() dto: UpdateSiteSettingsDto) {
    const result = await this.cvService.updateSiteSettings(dto);
    return ResponseHelper.success(result, 'Site settings updated');
  }

  @Patch('seo-settings')
  @ApiOperation({ summary: 'Update SEO settings' })
  async updateSeoSettings(@Body() dto: UpdateSeoSettingsDto) {
    const result = await this.cvService.updateSeoSettings(dto);
    return ResponseHelper.success(result, 'SEO settings updated');
  }
}
