import { Locale } from '@prisma/client';

export const CONTENT_LOCALE = Locale.uz;

export const DEFAULT_ABOUT_GALLERY = [
  'https://picsum.photos/seed/cv-about-1/900/1800',
  'https://picsum.photos/seed/cv-about-2/900/1800',
  'https://picsum.photos/seed/cv-about-3/900/1800',
  'https://picsum.photos/seed/cv-about-4/900/1800',
];

type CvSeed = {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    aboutDetails: string[];
    highlights: { label: string; value: string }[];
    interests: string[];
    gallery: string[];
    social: { platform: string; url: string; icon: string }[];
  };
  experiences: {
    company: string;
    role: string;
    period: string;
    description: string;
    technologies: string[];
  }[];
  skills: { name: string; category: string; level: number }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    repoUrl?: string;
    likes?: number;
    views?: number;
  }[];
};

export const cvSeed: CvSeed = {
  personal: {
    name: 'Ismingiz',
    title: 'Full Stack Dasturchi',
    email: 'hello@example.com',
    phone: '+998 90 000 00 00',
    location: "Toshkent, O'zbekiston",
    bio: "Zamonaviy veb ilovalar yaratishga ishtiyoqli dasturchi. Toza kod, tez ishlash va foydalanuvchi uchun qulay interfeys — mening asosiy ustuvor yo'nalishlarim.",
    aboutDetails: [
      "5+ yillik tajriba bilan korporativ va startup loyihalarida ishlaganman. Frontend arxitekturasi, UI/UX va backend integratsiyasini yagona tizim sifatida quraman.",
      "Jamoa bilan ishlash, kod review va mentoring kundalik faoliyatimning muhim qismi. Har bir loyihada barqarorlik, xavfsizlik va o'lchovlanuvchanlikni birinchi o'ringa qo'yaman.",
      "Bo'sh vaqtimda ochiq manba loyihalar, yangi texnologiyalar va dizayn trendlarini o'rganish bilan shug'ullanaman.",
    ],
    highlights: [
      { label: 'Tajriba', value: '5+ yil' },
      { label: 'Loyihalar', value: '20+' },
      { label: 'Mijozlar', value: '12+' },
      { label: 'Jamoa', value: '8 kishi' },
    ],
    interests: ['Next.js', 'UI/UX', 'Open Source', 'Mentorlik', 'Startup', 'TypeScript'],
    gallery: DEFAULT_ABOUT_GALLERY,
    social: [
      { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { platform: 'Telegram', url: 'https://t.me', icon: 'send' },
    ],
  },
  experiences: [
    {
      company: 'Tech Company',
      role: 'Senior Frontend Dasturchi',
      period: '2023 — Hozirgacha',
      description:
        'React va Next.js yordamida bir nechta mijoz loyihalarida frontend ishlab chiqishni boshqardim.',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    },
    {
      company: 'Startup Inc',
      role: 'Full Stack Dasturchi',
      period: '2021 — 2023',
      description: "G'oyadan joriy etishgacha veb ilovalarni yaratdim va qo'llab-quvvatladim.",
      technologies: ['Node.js', 'PostgreSQL', 'React', 'Docker'],
    },
  ],
  skills: [
    { name: 'Next.js', category: 'frontend', level: 90 },
    { name: 'React', category: 'frontend', level: 95 },
    { name: 'TypeScript', category: 'frontend', level: 85 },
    { name: 'Tailwind CSS', category: 'frontend', level: 90 },
    { name: 'Node.js', category: 'backend', level: 80 },
    { name: 'PostgreSQL', category: 'backend', level: 75 },
    { name: 'Git', category: 'tools', level: 90 },
    { name: 'Docker', category: 'tools', level: 70 },
    { name: 'Ingliz tili', category: 'languages', level: 90 },
    { name: "O'zbek tili", category: 'languages', level: 100 },
    { name: 'Muloqot', category: 'soft', level: 92 },
    { name: 'Jamoa bilan ishlash', category: 'soft', level: 90 },
    { name: 'Muammolarni hal qilish', category: 'soft', level: 88 },
    { name: 'Vaqt boshqaruvi', category: 'soft', level: 85 },
  ],
  projects: [
    {
      title: 'E-Commerce Platforma',
      description: "To'lov integratsiyasi va admin paneli bilan to'liq e-commerce yechimi.",
      technologies: ['Next.js', 'Stripe', 'PostgreSQL'],
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com',
    },
    {
      title: 'Vazifalar Boshqaruv Ilovasi',
      description:
        'Drag-and-drop funksiyasi bilan real vaqtda hamkorlik vazifalar menejeri.',
      technologies: ['React', 'Socket.io', 'MongoDB'],
      repoUrl: 'https://github.com',
    },
  ],
};

export const uiTranslations: Record<string, string> = {
  'nav.home': 'Bosh sahifa',
  'nav.about': 'Men haqimda',
  'nav.experience': 'Tajriba',
  'nav.skills': "Ko'nikmalar",
  'nav.projects': 'Loyihalar',
  'nav.contact': 'Aloqa',
  'hero.contactMe': "Bog'lanish",
  'hero.viewProjects': 'Loyihalarim',
  'about.title': 'Men haqimda',
  'about.email': 'Email',
  'about.phone': 'Telefon',
  'about.location': 'Manzil',
  'about.interestBanner':
    "Men siz bilan ishlash uchun loyiq inson ekanmi? Keling, birgalikda kuchli natijalarga erishamiz!",
  'about.interestCta': "Bog'lanish",
  'about.interestDismiss': 'Yopish',
  'experience.title': 'Tajriba',
  'skills.title': "Ko'nikmalar",
  'skills.categories.frontend': 'Frontend',
  'skills.categories.backend': 'Backend',
  'skills.categories.tools': 'Asboblar',
  'skills.categories.languages': 'Tillar',
  'skills.categories.soft': 'Soft skills',
  'projects.title': 'Loyihalar',
  'projects.live': 'Jonli',
  'projects.code': 'Kod',
  'projects.suggestBanner':
    'Siz allaqachon 2 ta loyiha ko\'rdingiz — eng katta loyihalarimdan biri "{project}" ni taklif qilaymi?',
  'projects.suggestCta': "Ko'rish",
  'projects.suggestDismiss': 'Yopish',
  'projects.pinned': 'Pin',
  'contact.title': 'Aloqa',
  'contact.email': 'Email',
  'contact.phone': 'Telefon',
  'contact.formTitle': 'Menga yozing',
  'contact.googleAccount': 'Google akkaunt',
  'contact.googleAccountPlaceholder': 'sizning@gmail.com',
  'contact.googleAccountAutoHint':
    "Google akkauntingiz avtomatik tanlandi. Boshqasini ishlatmoqchi bo'lsangiz, o'chirib qayta yozing.",
  'contact.googleAccountClear': 'Tozalash',
  'contact.purpose': 'Maqsad',
  'contact.purposePlaceholder': 'Nima haqida yozmoqchisiz?',
  'contact.submit': 'Yuborish',
  'contact.success': 'Xabaringiz yuborildi! Tez orada javob beraman.',
  'contact.error': "Xabar yuborilmadi. Qayta urinib ko'ring.",
  'footer.rights': 'Barcha huquqlar himoyalangan.',
  'footer.interestBanner':
    "Men sizdan juda xursandman! Menga qiziqish bildirganingiz va men haqimda o'rganganingiz uchun rahmat — iltimos, menga xabar qoldiring!",
  'footer.interestCta': 'Xabar qoldirish',
  'footer.interestDismiss': 'Yopish',
  'welcome.banner':
    "Xush kelibsiz! Men {name} — portfolioimga qiziqishingiz meni xursand qildi. Keling, men haqimda ko'proq bilib olaylik!",
  'welcome.cta': 'Tanishib olaylik',
  'welcome.dismiss': 'Yopish',
  'idle.banner':
    "Sizga yordam bera olamanmi? Qidirayotgan narsangizni topishda yoki savollaringizga javob berishda yordam beraman!",
  'idle.cta': 'Yordam olish',
  'idle.dismiss': 'Yopish',
  'common.portfolio': 'Portfolio',
  'common.openMenu': 'Menyuni ochish',
  'common.closeMenu': 'Menyuni yopish',
  'theme.light': "Yorug' rejim",
  'theme.dark': "Qorong'u rejim",
  'theme.system': 'Tizim rejimi',
  'theme.toggleTheme': "Mavzuni o'zgartirish",
};

export const siteSettingsSeed = {
  name: 'CV Portfolio',
  description: 'Professional CV & Portfolio Website',
  url: 'http://127.0.0.1:3001',
  seo_meta_title: '',
  seo_meta_description: '',
  seo_keywords: '',
  seo_og_title: '',
  seo_og_description: '',
  seo_hidden_content: '',
  seo_twitter_handle: '',
};
