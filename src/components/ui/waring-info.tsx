import { type ReactElement } from 'react';

export function WaringInfo({
  headTitle,
  description,
  children,
}: {
  headTitle: string;
  description: ReactElement;
  children?: ReactElement | ReactElement[];
}) {
  return (
    <div
      id="alert-additional-content-4"
      className="p-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800 mb-8"
    >
      <div className="flex items-center">
        <svg
          className="shrink-0 w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <h3 className="text-lg font-medium">{headTitle}</h3>
      </div>
      <div className="mt-2 mb-4 text-sm text-black dark:text-white">{description}</div>
      {children}
    </div>
  );
}
