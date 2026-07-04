import { PrismaClient, Locale } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ADMIN_LOGIN, ADMIN_PASSWORD } from '../src/common/constants/admin.constants';
import { cvSeed, siteSettingsSeed, uiTranslations, CONTENT_LOCALE } from './cv-seed-data';

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    { name: 'users:read', description: 'Read users' },
    { name: 'users:create', description: 'Create users' },
    { name: 'users:update', description: 'Update users' },
    { name: 'users:delete', description: 'Delete users' },
    { name: 'roles:read', description: 'Read roles' },
    { name: 'roles:manage', description: 'Manage roles' },
    { name: 'permissions:read', description: 'Read permissions' },
    { name: 'permissions:manage', description: 'Manage permissions' },
    { name: 'content:manage', description: 'Manage site content' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Standard user',
    },
  });

  const allPermissions = await prisma.permission.findMany();

  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  const readPermission = allPermissions.find((p) => p.name === 'users:read');
  if (readPermission) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: readPermission.id,
        },
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: readPermission.id,
      },
    });
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await prisma.user.deleteMany({ where: { email: 'admin@example.com' } });

  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_LOGIN },
    update: { password: hashedPassword },
    create: {
      email: ADMIN_LOGIN,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  const otherLocales = Object.values(Locale).filter((l) => l !== CONTENT_LOCALE);
  await prisma.uiTranslation.deleteMany({ where: { locale: { in: otherLocales } } });
  await prisma.project.deleteMany({ where: { locale: { in: otherLocales } } });
  await prisma.skill.deleteMany({ where: { locale: { in: otherLocales } } });
  await prisma.experience.deleteMany({ where: { locale: { in: otherLocales } } });
  await prisma.socialLink.deleteMany({
    where: { personalInfo: { locale: { in: otherLocales } } },
  });
  await prisma.personalInfo.deleteMany({ where: { locale: { in: otherLocales } } });

  const locale = CONTENT_LOCALE;
  const seed = cvSeed;

  const personal = await prisma.personalInfo.upsert({
    where: { locale },
    update: {
      name: seed.personal.name,
      title: seed.personal.title,
      email: seed.personal.email,
      phone: seed.personal.phone,
      location: seed.personal.location,
      bio: seed.personal.bio,
      gallery: seed.personal.gallery,
      aboutDetails: seed.personal.aboutDetails,
      highlights: seed.personal.highlights,
      interests: seed.personal.interests,
    },
    create: {
      locale,
      name: seed.personal.name,
      title: seed.personal.title,
      email: seed.personal.email,
      phone: seed.personal.phone,
      location: seed.personal.location,
      bio: seed.personal.bio,
      gallery: seed.personal.gallery,
      aboutDetails: seed.personal.aboutDetails,
      highlights: seed.personal.highlights,
      interests: seed.personal.interests,
    },
  });

  await prisma.socialLink.deleteMany({ where: { personalInfoId: personal.id } });
  for (const [index, social] of seed.personal.social.entries()) {
    await prisma.socialLink.create({
      data: {
        personalInfoId: personal.id,
        platform: social.platform,
        url: social.url,
        icon: social.icon,
        sortOrder: index,
      },
    });
  }

  await prisma.experience.deleteMany({ where: { locale } });
  for (const [index, exp] of seed.experiences.entries()) {
    await prisma.experience.create({
      data: {
        locale,
        company: exp.company,
        role: exp.role,
        period: exp.period,
        description: exp.description,
        technologies: exp.technologies,
        sortOrder: index,
      },
    });
  }

  await prisma.skill.deleteMany({ where: { locale } });
  for (const [index, skill] of seed.skills.entries()) {
    await prisma.skill.create({
      data: {
        locale,
        name: skill.name,
        category: skill.category,
        level: skill.level,
        sortOrder: index,
      },
    });
  }

  await prisma.project.deleteMany({ where: { locale } });
  for (const [index, project] of seed.projects.entries()) {
    const defaultLikes = [128, 94, 76, 112];
    const defaultViews = [1540, 890, 620, 1100];
    await prisma.project.create({
      data: {
        locale,
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        liveUrl: project.liveUrl,
        repoUrl: project.repoUrl,
        likes: project.likes ?? defaultLikes[index] ?? 0,
        views: project.views ?? defaultViews[index] ?? 0,
        sortOrder: index,
      },
    });
  }

  for (const [key, value] of Object.entries(uiTranslations)) {
    await prisma.uiTranslation.upsert({
      where: { locale_key: { locale, key } },
      update: { value },
      create: { locale, key, value },
    });
  }

  for (const [key, value] of Object.entries(siteSettingsSeed)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
