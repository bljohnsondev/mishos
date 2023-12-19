import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { SearchForm, SearchFormValues } from '@/features/search';
import { useAppStore } from '@/stores';

import { MainMenuItem, MenuList } from './menu-list';

interface MobileMenuProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen = false, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  // note - since the dialog is a direct child of the body tag it isn't part of the dark class so apply the scheme directly
  const { colorScheme } = useAppStore();

  const handleSelect = (item: MainMenuItem) => {
    onClose();
    item.onClick();
  };

  const handleSubmit = (values: SearchFormValues) => {
    if (values.query && values.query.trim() !== '') {
      onClose();
      navigate({
        pathname: `/show/search/${values.query}`,
      });
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className={`relative md:hidden z-10 ${colorScheme ?? 'dark'}`} onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex h-screen min-h-full items-start justify-center p-3 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="mt-16 w-full transform overflow-hidden p-4 text-left align-middle shadow-xl transition-all bg-neutral-400 dark:bg-neutral-900 border border-neutral-700 rounded-lg">
                  <div className="flex flex-col gap-4">
                    <nav className="rounded-lg bg-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
                      <MenuList onSelect={handleSelect} />
                    </nav>
                    <div>
                      <SearchForm onSubmit={handleSubmit} />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
