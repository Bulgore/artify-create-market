
export interface PageData {
  id: string;
  title: string;
  content: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  title: string;
  url: string;
  isExternal?: boolean;
  children?: NavigationItem[];
}
