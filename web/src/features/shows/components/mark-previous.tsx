import { Switch } from '@headlessui/react';
import * as React from 'react';

interface MarkPreviousProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const MarkPrevious = ({ value, onChange }: MarkPreviousProps) => {
  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch.Label className="mr-4 text-sm text-neutral-700 dark:text-neutral-400">Mark Previous</Switch.Label>
        <Switch
          checked={value}
          onChange={onChange}
          className={`${value ? 'bg-sky-800' : 'bg-neutral-600'}
          relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`${value ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
};
