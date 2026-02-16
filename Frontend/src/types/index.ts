export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  likes_count: number;
  liked: boolean;
  created_at?: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: { name: string };
}

export interface CounterItem {
  id: number;
  endCounter: number;
  text: string;
  lineRight?: boolean;
  lineRightMobile?: boolean;
}

export interface AboutItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  date: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface NavItem {
  id: number;
  title: string;
  icon: React.ReactNode;
  link: string;
}

export interface SocialNetwork {
  id: number;
  src: string;
  logo: React.ReactNode;
}

export interface FollowersData {
  followers_count: number;
  following: boolean;
}

export interface VisitsData {
  unique_visitors: number;
  total_page_views: number;
}

export interface Review {
  id: number;
  name: string;
  comment: string;
  rating: number;
  created_at: string;
}
