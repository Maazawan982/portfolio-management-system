export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  email?: string;
  youtube?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  location: string;
  status: 'Available for hire' | 'Open to collaborate' | 'Building in public' | 'Focused on deep work';
  socials: SocialLinks;
  resumeUrl?: string;
  accentColor: string;
  theme: 'dark' | 'light' | 'terminal';
  stats: {
    views: number;
    likes: number;
    endorsements: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  username: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  imageUrl: string;
  tags: string[];
  category: 'Full Stack' | 'Frontend' | 'Backend' | 'Mobile' | 'Open Source' | 'AI / ML' | 'Systems';
  featured: boolean;
  order: number;
  starsCount?: number;
  metrics?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  username: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  technologies: string[];
  order: number;
}

export interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    years?: number;
  }[];
}

export interface InquiryReply {
  id: string;
  senderName: string;
  senderEmail: string;
  replyMessage: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  recipientUsername: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  replied?: boolean;
  repliedAt?: string;
  replies?: InquiryReply[];
}

export interface PublicPortfolioData {
  profile: UserProfile;
  projects: Project[];
  experiences: Experience[];
  skills: SkillCategory[];
  totalProjects: number;
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
}
