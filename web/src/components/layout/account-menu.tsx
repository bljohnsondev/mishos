import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { showWarning } from '@/components/notifications';
import { logout } from '@/lib/auth';

interface ActionItem {
  label: string;
  url?: string;
  onClick?: () => void;
}

export const AccountMenu = () => {
  const navigate = useNavigate();

  const items: ActionItem[] = [
    { label: 'Settings' },
    { label: 'Tasks', url: '/task/list' },
    { label: 'Logout', onClick: logout },
  ];

  const handleClick = (item: ActionItem) => {
    if (item.url) {
      navigate(item.url);
    } else if (item.onClick) {
      item.onClick();
    } else {
      showWarning('Functionality not implemented');
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="flex items-center">
        <Menu.Button aria-label="Account Menu" className="text-neutral-800 dark:text-neutral-300">
          <IoPersonCircleOutline className="h-10 w-10" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-20 absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-neutral-300 border border-neutral-400 dark:bg-neutral-800 dark:border-neutral-700 shadow focus:outline-none">
          <div className="px-1 py-1 ">
            {items.map(item => (
              <Menu.Item key={item.label}>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? 'bg-neutral-400 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-400'
                        : 'text-neutral-900 dark:text-neutral-400'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => handleClick(item)}
                  >
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
