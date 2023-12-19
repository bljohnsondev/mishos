import { Listbox, Transition } from '@headlessui/react';
import * as React from 'react';
import { HiChevronUpDown, HiCheck } from 'react-icons/hi2';

import { SeasonDto } from '@/types';

interface SeasonPulldownProps {
  seasons: SeasonDto[];
  value: number | undefined;
  onSelect: (number: number | undefined) => void;
}

export const SeasonPulldown = ({ seasons, value, onSelect }: SeasonPulldownProps) => {
  const handleSelect = (newSeasonNumber: number) => {
    onSelect(newSeasonNumber);
  };

  return (
    <Listbox value={value} onChange={handleSelect}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-neutral-300 border border-neutral-500 dark:border-0 dark:bg-neutral-600 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate text-base">Season {value}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown className="h-5 w-5 text-neutral-800 dark:text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-300 border border-neutral-500 dark:border-0 dark:bg-neutral-600 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {seasons?.map(season => (
              <Listbox.Option
                key={`season-${season.number}`}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active
                      ? 'bg-neutral-500/[0.5] dark:bg-neutral-500 text-neutral-800 dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`
                }
                value={season.number}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      Season {season?.number}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-800 dark:text-green-400">
                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
