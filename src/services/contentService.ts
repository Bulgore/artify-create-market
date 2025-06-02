
import { ContentBlock, MenuItem, FooterSection, SiteSettings } from '@/types/content';

export const contentService = {
  // Gestion des blocs de contenu
  getBlocks: (): ContentBlock[] => {
    const saved = localStorage.getItem('homepage_blocks');
    return saved ? JSON.parse(saved) : [];
  },

  saveBlocks: (blocks: ContentBlock[]): void => {
    localStorage.setItem('homepage_blocks', JSON.stringify(blocks));
  },

  // Gestion du menu
  getMenuItems: (): MenuItem[] => {
    const saved = localStorage.getItem('header_menu');
    return saved ? JSON.parse(saved) : [];
  },

  saveMenuItems: (items: MenuItem[]): void => {
    localStorage.setItem('header_menu', JSON.stringify(items));
  },

  // Gestion du footer
  getFooterSections: (): FooterSection[] => {
    const saved = localStorage.getItem('footer_sections');
    return saved ? JSON.parse(saved) : [];
  },

  saveFooterSections: (sections: FooterSection[]): void => {
    localStorage.setItem('footer_sections', JSON.stringify(sections));
  },

  // Paramètres du site
  getSiteSettings: (): SiteSettings => {
    const saved = localStorage.getItem('site_settings');
    return saved ? JSON.parse(saved) : {
      siteName: 'Podsleek',
      siteDescription: 'Plateforme de création et d\'impression à la demande',
      primaryColor: '#33C3F0',
      secondaryColor: '#0FA0CE',
      copyrightText: '© 2024 Podsleek. Tous droits réservés.'
    };
  },

  saveSiteSettings: (settings: SiteSettings): void => {
    localStorage.setItem('site_settings', JSON.stringify(settings));
  }
};
