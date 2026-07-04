import { Injectable, NotFoundException } from '@nestjs/common';
import { Locale } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { normalizeSiteUrl } from '../shared/utils/site-url.util';
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

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function parseSeoSettings(settings: Record<string, string>) {
  return {
    metaTitle: settings.seo_meta_title ?? '',
    metaDescription: settings.seo_meta_description ?? '',
    keywords: settings.seo_keywords ?? '',
    ogTitle: settings.seo_og_title ?? '',
    ogDescription: settings.seo_og_description ?? '',
    hiddenContent: settings.seo_hidden_content ?? '',
    twitterHandle: settings.seo_twitter_handle ?? '',
  };
}

function asHighlightArray(
  value: unknown,
): { label: string; value: string }[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is { label: string; value: string } =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as { label?: unknown }).label === 'string' &&
      typeof (item as { value?: unknown }).value === 'string',
  );
}

@Injectable()
export class CvService {
  constructor(private prisma: PrismaService) {}

  async getContentByLocale(locale: Locale) {
    const [personal, experiences, skills, projects, translations, siteSettings] =
      await Promise.all([
        this.prisma.personalInfo.findUnique({
          where: { locale },
          include: { socialLinks: { orderBy: { sortOrder: 'asc' } } },
        }),
        this.prisma.experience.findMany({
          where: { locale },
          orderBy: { sortOrder: 'asc' },
        }),
        this.prisma.skill.findMany({
          where: { locale },
          orderBy: { sortOrder: 'asc' },
        }),
        this.prisma.project.findMany({
          where: { locale },
          orderBy: [{ isPinned: 'desc' }, { sortOrder: 'asc' }],
        }),
        this.prisma.uiTranslation.findMany({ where: { locale } }),
        this.prisma.siteSetting.findMany(),
      ]);

    if (!personal) {
      throw new NotFoundException(`Content for locale "${locale}" not found`);
    }

    const translationMap = Object.fromEntries(
      translations.map((t) => [t.key, t.value]),
    );

    const settings = Object.fromEntries(siteSettings.map((s) => [s.key, s.value]));

    return {
      cv: {
        personal: {
          name: personal.name,
          title: personal.title,
          email: personal.email,
          phone: personal.phone,
          location: personal.location,
          avatar: personal.avatar ?? undefined,
          gallery: asStringArray(personal.gallery),
          bio: personal.bio,
          aboutDetails: asStringArray(personal.aboutDetails),
          highlights: asHighlightArray(personal.highlights),
          interests: asStringArray(personal.interests),
          social: personal.socialLinks.map((link) => ({
            id: link.id,
            platform: link.platform,
            url: link.url,
            icon: link.icon,
          })),
        },
        experiences: experiences.map((exp) => ({
          id: exp.id,
          company: exp.company,
          role: exp.role,
          period: exp.period,
          description: exp.description,
          technologies: asStringArray(exp.technologies),
        })),
        skills: skills.map((skill) => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          level: skill.level,
        })),
        projects: projects.map((project) => {
          const images = asStringArray(project.images);
          const cover = project.image ?? images[0];

          return {
            id: project.id,
            title: project.title,
            description: project.description,
            image: cover ?? undefined,
            images: images.length > 0 ? images : cover ? [cover] : undefined,
            technologies: asStringArray(project.technologies),
            liveUrl: project.liveUrl ?? undefined,
            repoUrl: project.repoUrl ?? undefined,
            likes: project.likes,
            views: project.views,
            isPinned: project.isPinned,
          };
        }),
      },
      translations: translationMap,
      siteSettings: {
        name: settings.name ?? 'CV Portfolio',
        description: settings.description ?? '',
        url: settings.url ?? '',
      },
      seoSettings: parseSeoSettings(settings),
    };
  }

  async updatePersonal(locale: Locale, dto: UpdatePersonalDto) {
    const { gallery, aboutDetails, highlights, interests, ...rest } = dto;
    return this.prisma.personalInfo.update({
      where: { locale },
      data: {
        ...rest,
        ...(gallery !== undefined ? { gallery } : {}),
        ...(aboutDetails !== undefined ? { aboutDetails } : {}),
        ...(highlights !== undefined ? { highlights } : {}),
        ...(interests !== undefined ? { interests } : {}),
      },
      include: { socialLinks: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async createSocialLink(locale: Locale, dto: CreateSocialLinkDto) {
    const personal = await this.getPersonalOrThrow(locale);
    return this.prisma.socialLink.create({
      data: { ...dto, personalInfoId: personal.id },
    });
  }

  async updateSocialLink(id: string, dto: UpdateSocialLinkDto) {
    await this.getSocialLinkOrThrow(id);
    return this.prisma.socialLink.update({ where: { id }, data: dto });
  }

  async deleteSocialLink(id: string) {
    await this.getSocialLinkOrThrow(id);
    await this.prisma.socialLink.delete({ where: { id } });
  }

  async createExperience(dto: CreateExperienceDto) {
    return this.prisma.experience.create({ data: dto });
  }

  async updateExperience(id: string, dto: UpdateExperienceDto) {
    await this.getExperienceOrThrow(id);
    return this.prisma.experience.update({ where: { id }, data: dto });
  }

  async deleteExperience(id: string) {
    await this.getExperienceOrThrow(id);
    await this.prisma.experience.delete({ where: { id } });
  }

  async createSkill(dto: CreateSkillDto) {
    return this.prisma.skill.create({ data: dto });
  }

  async updateSkill(id: string, dto: UpdateSkillDto) {
    await this.getSkillOrThrow(id);
    return this.prisma.skill.update({ where: { id }, data: dto });
  }

  async deleteSkill(id: string) {
    await this.getSkillOrThrow(id);
    await this.prisma.skill.delete({ where: { id } });
  }

  async createProject(dto: CreateProjectDto) {
    const { images, image, ...rest } = dto;
    const imageList = images?.filter(Boolean) ?? [];

    return this.prisma.project.create({
      data: {
        ...rest,
        images: imageList,
        image: imageList[0] ?? image ?? null,
      },
    });
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    await this.getProjectOrThrow(id);

    const { images, image, ...rest } = dto;
    const data = { ...rest } as {
      title?: string;
      description?: string;
      technologies?: string[];
      liveUrl?: string;
      repoUrl?: string;
      sortOrder?: number;
      isPinned?: boolean;
      images?: string[];
      image?: string | null;
    };

    if (images !== undefined) {
      const imageList = images.filter(Boolean);
      data.images = imageList;
      data.image = imageList[0] ?? null;
    } else if (image !== undefined) {
      data.image = image || null;
    }

    return this.prisma.project.update({ where: { id }, data });
  }

  async deleteProject(id: string) {
    await this.getProjectOrThrow(id);
    await this.prisma.project.delete({ where: { id } });
  }

  async updateTranslations(locale: Locale, dto: UpdateTranslationsDto) {
    const entries = Object.entries(dto.translations);

    await this.prisma.$transaction(
      entries.map(([key, value]) =>
        this.prisma.uiTranslation.upsert({
          where: { locale_key: { locale, key } },
          update: { value },
          create: { locale, key, value },
        }),
      ),
    );

    return this.prisma.uiTranslation.findMany({ where: { locale } });
  }

  async updateSiteSettings(dto: UpdateSiteSettingsDto) {
    const entries: [string, string][] = [
      ['name', dto.name],
      ['description', dto.description],
      ['url', normalizeSiteUrl(dto.url)],
    ];

    await this.prisma.$transaction(
      entries.map(([key, value]) =>
        this.prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );

    return dto;
  }

  async updateSeoSettings(dto: UpdateSeoSettingsDto) {
    const entries: [string, string][] = [
      ['seo_meta_title', dto.metaTitle],
      ['seo_meta_description', dto.metaDescription],
      ['seo_keywords', dto.keywords],
      ['seo_og_title', dto.ogTitle],
      ['seo_og_description', dto.ogDescription],
      ['seo_hidden_content', dto.hiddenContent],
      ['seo_twitter_handle', dto.twitterHandle],
    ];

    await this.prisma.$transaction(
      entries.map(([key, value]) =>
        this.prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );

    return dto;
  }

  async getAdminData(locale: Locale) {
    return this.getContentByLocale(locale);
  }

  async getProjectInteractions(locale: Locale, visitorKey: string) {
    const projects = await this.prisma.project.findMany({
      where: { locale },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        likes: true,
        views: true,
        projectLikes: {
          where: { visitorKey },
          select: { projectId: true },
        },
      },
    });

    return {
      projects: projects.map((project) => ({
        id: project.id,
        likes: project.likes,
        views: project.views,
        liked: project.projectLikes.length > 0,
      })),
    };
  }

  async toggleProjectLike(projectId: string, visitorKey: string) {
    await this.getProjectOrThrow(projectId);

    const existing = await this.prisma.projectLike.findUnique({
      where: {
        projectId_visitorKey: { projectId, visitorKey },
      },
    });

    if (existing) {
      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.projectLike.delete({
          where: { projectId_visitorKey: { projectId, visitorKey } },
        });
        return tx.project.update({
          where: { id: projectId },
          data: { likes: { decrement: 1 } },
          select: { likes: true },
        });
      });

      return { likes: Math.max(0, updated.likes), liked: false };
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.projectLike.create({
        data: { projectId, visitorKey },
      });
      return tx.project.update({
        where: { id: projectId },
        data: { likes: { increment: 1 } },
        select: { likes: true },
      });
    });

    return { likes: updated.likes, liked: true };
  }

  async recordProjectView(projectId: string, visitorKey: string) {
    await this.getProjectOrThrow(projectId);

    const VIEW_COOLDOWN_MS = 30 * 60 * 1000;
    const now = new Date();
    const existing = await this.prisma.projectView.findUnique({
      where: { projectId_visitorKey: { projectId, visitorKey } },
    });

    if (
      existing &&
      now.getTime() - existing.lastViewedAt.getTime() < VIEW_COOLDOWN_MS
    ) {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        select: { views: true },
      });
      return { views: project?.views ?? 0, recorded: false };
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.projectView.upsert({
        where: { projectId_visitorKey: { projectId, visitorKey } },
        update: { lastViewedAt: now },
        create: { projectId, visitorKey, lastViewedAt: now },
      });
      return tx.project.update({
        where: { id: projectId },
        data: { views: { increment: 1 } },
        select: { views: true },
      });
    });

    return { views: updated.views, recorded: true };
  }

  private async getPersonalOrThrow(locale: Locale) {
    const personal = await this.prisma.personalInfo.findUnique({ where: { locale } });
    if (!personal) throw new NotFoundException('Personal info not found');
    return personal;
  }

  private async getSocialLinkOrThrow(id: string) {
    const link = await this.prisma.socialLink.findUnique({ where: { id } });
    if (!link) throw new NotFoundException('Social link not found');
    return link;
  }

  private async getExperienceOrThrow(id: string) {
    const item = await this.prisma.experience.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Experience not found');
    return item;
  }

  private async getSkillOrThrow(id: string) {
    const item = await this.prisma.skill.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Skill not found');
    return item;
  }

  private async getProjectOrThrow(id: string) {
    const item = await this.prisma.project.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Project not found');
    return item;
  }
}
