import * as React from 'react';

import { MainMenuItem, MenuList } from './menu-list';
import { MobileMenu } from './mobile-menu';
import { SiteHeader } from './site-header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const handleToggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <main className="container mx-auto">
      <SiteHeader onToggleMobile={handleToggleMobile} />
      <section className="flex gap-0 md:gap-4 p-4 md:p-0">
        <div className="hidden md:block">
          <MainMenu />
        </div>
        <div className="md:hidden">
          <MobileMenu isOpen={isMobileOpen} onClose={handleToggleMobile} />
        </div>
        <div className="grow">{children}</div>
      </section>
    </main>
  );
};

const MainMenu = () => {
  const handleSelect = (item: MainMenuItem) => {
    item.onClick();
  };

  return (
    <nav className="w-56 p-2 rounded-lg bg-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
      <MenuList onSelect={handleSelect} />
    </nav>
  );
};
