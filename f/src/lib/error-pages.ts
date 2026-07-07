export type ErrorFragment = {
  text: string;
  from: { x: number; y: number; rotate: number };
};

export type ErrorPageConfig = {
  code: string;
  title: string;
  description: string;
  fragments: ErrorFragment[];
  primaryLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
  variant: "404" | "500";
};

export const NOT_FOUND_PAGE: ErrorPageConfig = {
  code: "404",
  title: "Sahifa topilmadi",
  description:
    "Qidirayotgan sahifangiz boshqa yo'nalishga uchib ketgan bo'lishi mumkin. Xavotir olmang — sizni xavfsiz manzilga qaytarib qo'yamiz.",
  fragments: [
    { text: "Bosh sahifa", from: { x: -340, y: -220, rotate: -14 } },
    { text: "Loyihalar", from: { x: 360, y: -180, rotate: 10 } },
    { text: "Kontakt", from: { x: -300, y: 200, rotate: -8 } },
    { text: "Portfolio", from: { x: 320, y: 240, rotate: 12 } },
    { text: "Navbar", from: { x: -420, y: 40, rotate: -18 } },
    { text: "Link buzilgan", from: { x: 400, y: -20, rotate: 16 } },
    { text: "Qayerdasan?", from: { x: -180, y: -300, rotate: 6 } },
    { text: "URL xato", from: { x: 200, y: 300, rotate: -10 } },
    { text: "404", from: { x: 0, y: -360, rotate: 0 } },
    { text: "Topilmadi", from: { x: 0, y: 360, rotate: 0 } },
  ],
  primaryLabel: "Bosh sahifaga qaytish",
  secondaryLabel: "Loyihalarni ko'rish",
  secondaryHref: "/#projects",
  variant: "404",
};

export const SERVER_ERROR_PAGE: ErrorPageConfig = {
  code: "500",
  title: "Server biroz charchagan",
  description:
    "Texnik nosozlik yuz berdi. Jarayon vaqtincha to'xtadi, lekin biz allaqachon tuzatish ustidamiz. Bir ozdan keyin qayta urinib ko'ring.",
  fragments: [
    { text: "Server", from: { x: -360, y: -200, rotate: -12 } },
    { text: "Xatolik", from: { x: 380, y: -160, rotate: 14 } },
    { text: "API", from: { x: -320, y: 220, rotate: -9 } },
    { text: "Timeout", from: { x: 340, y: 260, rotate: 11 } },
    { text: "500", from: { x: 0, y: -380, rotate: 0 } },
    { text: "Jarayon", from: { x: -400, y: 60, rotate: -16 } },
    { text: "Qayta urinish", from: { x: 420, y: 20, rotate: 18 } },
    { text: "Backend", from: { x: -200, y: 320, rotate: -7 } },
    { text: "Kod", from: { x: 220, y: -300, rotate: 8 } },
    { text: "Nosozlik", from: { x: 0, y: 380, rotate: 0 } },
  ],
  primaryLabel: "Qayta urinish",
  secondaryLabel: "Bosh sahifaga qaytish",
  secondaryHref: "/",
  variant: "500",
};
