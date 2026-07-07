export interface Translation {
  nav: {
    home: string;
    about: string;
    experience: string;
    skills: string;
    projects: string;
    contact: string;
  };
  hero: {
    contactMe: string;
    viewProjects: string;
  };
  about: {
    title: string;
    email: string;
    phone: string;
    location: string;
    interests: string;
    interestBanner: string;
    interestCta: string;
    interestDismiss: string;
  };
  experience: {
    title: string;
  };
  skills: {
    title: string;
    categories: {
      frontend: string;
      backend: string;
      tools: string;
      languages: string;
      soft: string;
    };
  };
  projects: {
    title: string;
    live: string;
    code: string;
    readMore: string;
    like: string;
    save: string;
    saved: string;
    views: string;
    links: string;
    files: string;
    close: string;
    dragHint: string;
    suggestBanner: string;
    suggestCta: string;
    suggestDismiss: string;
    pinned: string;
  };
  contact: {
    title: string;
    email: string;
    phone: string;
    formTitle: string;
    googleAccount: string;
    googleAccountPlaceholder: string;
    googleAccountAutoHint: string;
    googleAccountClear: string;
    purpose: string;
    purposePlaceholder: string;
    submit: string;
    success: string;
    error: string;
  };
  footer: {
    rights: string;
    interestBanner: string;
    interestCta: string;
    interestDismiss: string;
  };
  welcome: {
    banner: string;
    cta: string;
    dismiss: string;
  };
  idle: {
    banner: string;
    cta: string;
    dismiss: string;
  };
  common: {
    portfolio: string;
    openMenu: string;
    closeMenu: string;
    scrollToTop: string;
    badgeLabel: string;
    badgeHint: string;
  };
  network: {
    offlineTitle: string;
    offlineMessage: string;
    reconnecting: string;
  };
  theme: {
    light: string;
    dark: string;
    system: string;
    toggleTheme: string;
  };
}
