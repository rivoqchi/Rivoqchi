import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  IsEnum,
  IsEmail,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Locale } from '@prisma/client';

export class LocaleParamDto {
  @ApiProperty({ enum: Locale })
  @IsEnum(Locale)
  locale!: Locale;
}

export class UpdatePersonalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bio!: string;

  @ApiPropertyOptional({ type: [String], description: 'Additional about paragraphs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aboutDetails?: string[];

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'object',
      properties: { label: { type: 'string' }, value: { type: 'string' } },
    },
  })
  @IsOptional()
  @IsArray()
  highlights?: { label: string; value: string }[];

  @ApiPropertyOptional({ type: [String], description: 'Focus areas / interests' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];
}

export class CreateSocialLinkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  platform!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  icon!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateSocialLinkDto extends PartialType(CreateSocialLinkDto) {}

export class CreateExperienceDto {
  @ApiProperty({ enum: Locale })
  @IsEnum(Locale)
  locale!: Locale;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  company!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  role!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  period!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  technologies!: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}

export class CreateSkillDto {
  @ApiProperty({ enum: Locale })
  @IsEnum(Locale)
  locale!: Locale;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  level!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}

export class CreateProjectDto {
  @ApiProperty({ enum: Locale })
  @IsEnum(Locale)
  locale!: Locale;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  technologies!: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  liveUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  repoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: "Taklif bannerida ko'rsatish uchun pin" })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class UpdateTranslationsDto {
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  @IsObject()
  translations!: Record<string, string>;
}

export class UpdateSiteSettingsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url!: string;
}

export class UpdateSeoSettingsDto {
  @ApiProperty({ required: false, example: 'Islom Anvarov — Full Stack Developer' })
  @IsString()
  metaTitle!: string;

  @ApiProperty({ required: false, example: 'Toshkentdagi Full Stack dasturchi. React, Node.js...' })
  @IsString()
  metaDescription!: string;

  @ApiProperty({ required: false, example: 'full stack developer, react, nodejs, toshkent' })
  @IsString()
  keywords!: string;

  @ApiProperty({ required: false })
  @IsString()
  ogTitle!: string;

  @ApiProperty({ required: false })
  @IsString()
  ogDescription!: string;

  @ApiProperty({ required: false })
  @IsString()
  hiddenContent!: string;

  @ApiProperty({ required: false, example: 'islomanvarov' })
  @IsString()
  twitterHandle!: string;
}
