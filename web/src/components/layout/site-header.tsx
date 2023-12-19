import * as React from 'react';
import { IoGridOutline } from 'react-icons/io5';
import { PiTelevisionSimpleBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '@/components/spinner';
import { SearchForm, SearchFormValues } from '@/features/search';
import { useAppStore } from '@/stores';

import { AccountMenu } from './account-menu';
import { ColorToggle } from './color-toggle';

const APP_NAME = 'mishos';

interface SiteHeaderProps {
  onToggleMobile: () => void;
}

export const SiteHeader = ({ onToggleMobile }: SiteHeaderProps) => {
  const navigate = useNavigate();
  const { loading } = useAppStore();

  const handleSubmit = (values: SearchFormValues) => {
    if (values.query && values.query.trim() !== '') {
      navigate({
        pathname: `/show/search/${values.query}`,
      });
    }
  };

  return (
    <header className="flex flex-col gap-3 md:flex-row items-center md:h-16 py-2">
      <div className="flex items-center gap-3 w-full px-6 pt-3 md:w-fit md:p-0">
        <PiTelevisionSimpleBold className="h-8 w-8" />
        <h1 className="text-xl font-bold tracking-wide">{APP_NAME}</h1>
        <div className="ml-auto md:hidden flex items-center gap-4">
          <ColorToggle />
          <AccountMenu />
          <button onClick={onToggleMobile} className="focus:outline-none">
            <IoGridOutline className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="mx-auto hidden md:block">
        <SearchForm onSubmit={handleSubmit} />
      </div>
      <div className="hidden md:flex items-center justify-end gap-4 w-32">
        {loading && <Spinner />}
        <ColorToggle />
        <AccountMenu />
      </div>
    </header>
  );
};
