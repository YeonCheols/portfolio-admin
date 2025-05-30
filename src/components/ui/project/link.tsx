import Link from 'next/link';
import { BsGithub as GithubIcon } from 'react-icons/bs';
import { FiExternalLink as LinkIcon } from 'react-icons/fi';
import { type ProjectResponse } from '@/docs/api';
import { type ProjectLinkProps } from '@/types/link';

const ProjectLink = ({ title, linkGithub, linkDemo }: Pick<ProjectResponse, 'title' | 'linkGithub' | 'linkDemo'>) => {
  const LinkComponent = ({ url, text, icon }: ProjectLinkProps) => {
    const eventName = `Click ${text} - Project ${title}`;

    return (
      <Link href={url} target="_blank" passHref data-umami-event={eventName}>
        <div className="flex items-center gap-2 font-medium text-neutral-700 dark:text-neutral-300 ">
          {icon}
          <span className="text-[15px] transition-all duration-300 dark:text-teal-500 hover:dark:text-teal-400">
            {text}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex gap-4">
      {linkGithub && <LinkComponent url={linkGithub} text="Source Code" icon={<GithubIcon size={22} />} />}
      {linkGithub && linkDemo && <span className="text-neutral-400 dark:text-neutral-600">|</span>}
      {linkDemo && <LinkComponent url={linkDemo} text="Live Demo" icon={<LinkIcon size={22} />} />}
    </div>
  );
};

export default ProjectLink;
