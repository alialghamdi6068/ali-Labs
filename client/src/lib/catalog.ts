export type CatalogVersion = {
  version: string;
  date: string;
  downloads: number;
  size: string;
  loaders: string[];
  gameVersions: string[];
  changelog: string;
};

export type CatalogProject = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  type: string;
  icon: string;
  accent: string;
  downloads: number;
  followers: number;
  loaders: string[];
  gameVersions: string[];
  updated: string;
  author: string;
  featured?: boolean;
  versions: CatalogVersion[];
};

export const catalogProjects: CatalogProject[] = [
  {
    slug: "lumen-shaders", name: "Lumen Shaders", summary: "إضاءة سينمائية خفيفة للأجهزة المتوسطة، مصممة لتبقى اللعبة سلسة.", description: "حزمة تظليل تركز على الضوء الطبيعي والظلال الناعمة من دون التضحية بمعدل الإطارات. مناسبة للبناء والاستكشاف واللقطات السينمائية.", type: "Shader", icon: "L", accent: "#8b5cf6", downloads: 184200, followers: 3900, loaders: ["Iris", "OptiFine"], gameVersions: ["1.21", "1.20.6"], updated: "منذ 3 أيام", author: "noura.dev", featured: true,
    versions: [{ version: "2.4.0", date: "2026/10/28", downloads: 42000, size: "18.4 MB", loaders: ["Iris"], gameVersions: ["1.21"], changelog: "تحسين انعكاسات الماء، وتقليل استهلاك الذاكرة في المشاهد الكثيفة." }],
  },
  {
    slug: "atlas-commands", name: "Atlas Commands", summary: "أدوات أوامر منظمة لبناة الخرائط والسيرفرات الإبداعية.", description: "مجموعة أوامر قابلة للتركيب تساعدك على إدارة المناطق واللاعبين والمهام داخل الخريطة بطريقة واضحة وقابلة للتوسع.", type: "Mod", icon: "A", accent: "#22d3ee", downloads: 97200, followers: 2100, loaders: ["Fabric", "Quilt"], gameVersions: ["1.21", "1.20.4"], updated: "منذ أسبوع", author: "atlas-lab",
    versions: [{ version: "1.8.2", date: "2026/10/22", downloads: 18000, size: "2.1 MB", loaders: ["Fabric", "Quilt"], gameVersions: ["1.21"], changelog: "إضافة أوامر المناطق وتحسين رسائل الأخطاء للمطورين." }],
  },
  {
    slug: "tiny-towns", name: "Tiny Towns", summary: "قرى صغيرة حيّة تضيف تفاصيل جديدة للاستكشاف والبناء.", description: "توسعة خفيفة تضيف قرى ذات طابع خاص، شخصيات غير لاعبة ومهام قصيرة للرحلات الطويلة.", type: "Data pack", icon: "T", accent: "#f59e0b", downloads: 68400, followers: 1640, loaders: ["Vanilla"], gameVersions: ["1.21", "1.20.6"], updated: "منذ أسبوعين", author: "mira.builds",
    versions: [{ version: "0.9.1", date: "2026/10/14", downloads: 12400, size: "640 KB", loaders: ["Vanilla"], gameVersions: ["1.21"], changelog: "قرية جديدة في المناطق الثلجية وتوازن أفضل لمكافآت المهام." }],
  },
  {
    slug: "redstone-notes", name: "Redstone Notes", summary: "مكتبة قوالب صغيرة لتجارب Redstone والتعليم السريع.", description: "قوالب تعليمية جاهزة مع شرح داخل اللعبة لمساعدتك على فهم الدوائر وبناء أنظمة أكثر ترتيبًا.", type: "Resource pack", icon: "R", accent: "#fb7185", downloads: 42100, followers: 880, loaders: ["Vanilla"], gameVersions: ["1.20.6", "1.20.4"], updated: "منذ شهر", author: "circuitry",
    versions: [{ version: "3.2.0", date: "2026/09/29", downloads: 7800, size: "5.8 MB", loaders: ["Vanilla"], gameVersions: ["1.20.6"], changelog: "تحديث القوالب التعليمية وإضافة 12 تجربة جديدة." }],
  },
];

export const formatNumber = (value: number) => new Intl.NumberFormat("en-US", { notation: value > 99999 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
export const findProject = (slug?: string) => catalogProjects.find(project => project.slug === slug);
