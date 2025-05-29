import { type ReactElement } from 'react';

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  stacks: string;
  image: string;
  linkDemo: string;
  linkGithub: string;
  isShow: boolean;
}

export interface ProjectData {
  id: number;
  title: string;
  slug: string;
  stacks: string;
  linkGithub: string;
  linkDemo: string;
  content: string;
  description: string;
  isShow: boolean;
  updated_at: string;
  buttonGroup: ReactElement;
}
