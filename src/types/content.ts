
export interface ContentBlock {
  id: string;
  type: 'hero' | 'product_grid' | 'banner' | 'slider' | 'testimonials' | 'text' | 'image';
  title?: string;
  content: any;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroBlock {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  backgroundColor?: string;
}

export interface BannerBlock {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  backgroundColor: string;
  startDate?: string;
  endDate?: string;
}

export interface SliderBlock {
  slides: {
    id: string;
    title: string;
    description?: string;
    image: string;
    link?: string;
  }[];
  autoPlay: boolean;
  showDots: boolean;
  duration: number;
}

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  order: number;
  isExternal: boolean;
  isActive: boolean;
}

export interface FooterSection {
  id: string;
  title: string;
  links: {
    title: string;
    url: string;
    isExternal: boolean;
  }[];
  order: number;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  copyrightText: string;
}
