import type { Project } from "@/types/cv";

const IMG = {
  ecommerce: "https://picsum.photos/seed/ecommerce-cv/800/500",
  ecommerce2: "https://picsum.photos/seed/ecommerce-cv2/800/500",
  task: "https://picsum.photos/seed/task-cv/800/500",
  task2: "https://picsum.photos/seed/task-cv2/800/500",
  portfolio: "https://picsum.photos/seed/portfolio-cv/800/500",
  portfolio2: "https://picsum.photos/seed/portfolio-cv2/800/500",
  dashboard: "https://picsum.photos/seed/dashboard-cv/800/500",
  dashboard2: "https://picsum.photos/seed/dashboard-cv2/800/500",
};

export const PROJECTS: Project[] = [
    {
      id: "1",
      title: "E-Commerce Platforma",
      description:
        "To'lov integratsiyasi va admin paneli bilan to'liq onlayn do'kon yechimi.",
      content: `<p>Bu loyiha <strong>to'liq e-commerce ekosistemasi</strong> bo'lib, mijozlar uchun <em>zamonaviy xarid tajribasi</em> yaratadi.</p>
<ul><li>Stripe orqali xavfsiz to'lov</li><li>Real vaqtda buyurtma kuzatuvi</li><li>Admin dashboard va analitika</li></ul>
<p>Frontend <strong>Next.js 16</strong> va backend <em>PostgreSQL</em> asosida qurilgan.</p>`,
      image: IMG.ecommerce,
      images: [IMG.ecommerce, IMG.ecommerce2],
      technologies: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"],
      liveUrl: "https://example.com",
      repoUrl: "https://github.com",
      links: [
        { label: "Jonli sayt", url: "https://example.com", type: "live" },
        { label: "GitHub", url: "https://github.com", type: "repo" },
        { label: "Demo", url: "https://example.com/demo", type: "demo" },
      ],
      files: [
        { name: "Loyiha taqdimoti.pdf", url: "#", size: "2.4 MB" },
        { name: "API hujjatlari.pdf", url: "#", size: "1.1 MB" },
      ],
      likes: 128,
      views: 1540,
    },
    {
      id: "2",
      title: "Vazifalar Boshqaruv Ilovasi",
      description:
        "Real vaqtda hamkorlik va drag-and-drop bilan task manager.",
      content: `<p><strong>Jamoa uchun</strong> mo'ljallangan vazifalar menejeri. <em>Drag-and-drop</em> interfeysi va real vaqtda yangilanishlar.</p>
<ul><li>Kanban va ro'yxat ko'rinishlari</li><li>Socket.io bilan live sync</li><li>Filtr va qidiruv tizimi</li></ul>`,
      image: IMG.task,
      images: [IMG.task, IMG.task2],
      technologies: ["React", "Socket.io", "MongoDB", "Node.js"],
      repoUrl: "https://github.com",
      links: [{ label: "GitHub", url: "https://github.com", type: "repo" }],
      likes: 94,
      views: 890,
    },
    {
      id: "3",
      title: "Portfolio CMS",
      description: "Kontent boshqaruv tizimi bilan shaxsiy portfolio sayt.",
      content: `<p>CV va portfolio saytlar uchun <strong>CMS yechimi</strong>. Admin panel orqali <em>barcha kontentni</em> boshqarish mumkin.</p>`,
      image: IMG.portfolio,
      images: [IMG.portfolio, IMG.portfolio2],
      technologies: ["Next.js", "Prisma", "Zustand", "shadcn/ui"],
      liveUrl: "https://example.com",
      repoUrl: "https://github.com",
      likes: 76,
      views: 620,
    },
    {
      id: "4",
      title: "Analytics Dashboard",
      description: "Real vaqtda ma'lumotlar vizualizatsiyasi va hisobotlar.",
      content: `<p><strong>Biznes analitikasi</strong> uchun dashboard. <em>Grafiklar</em>, filtrlar va eksport imkoniyatlari bilan.</p>`,
      image: IMG.dashboard,
      images: [IMG.dashboard, IMG.dashboard2],
      technologies: ["React", "D3.js", "TypeScript", "REST API"],
      liveUrl: "https://example.com",
      likes: 112,
      views: 1100,
    },
  ];

export function getProjects(): Project[] {
  return PROJECTS;
}
