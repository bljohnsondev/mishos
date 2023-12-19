interface PageTitleProps {
  title: string;
  rightContent?: React.ReactNode;
}

export const PageTitle = ({ title, rightContent }: PageTitleProps) => (
  <div className="font-semibold text-xl mb-4 py-3 px-4 rounded-lg text-neutral-800 bg-neutral-300 dark:text-neutral-300 dark:bg-neutral-900 flex flex-col md:flex-row items-center gap-3">
    <div>{title}</div>
    {rightContent && <div className="md:ml-auto">{rightContent}</div>}
  </div>
);
