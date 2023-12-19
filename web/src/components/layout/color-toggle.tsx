import { IoMoon, IoSunny } from 'react-icons/io5';

import { useAppStore } from '@/stores';

export const ColorToggle = () => {
  const { colorScheme, setColorScheme } = useAppStore();

  const handleToggleColorScheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300 transition duration-150"
      aria-label="Toggle Light/Dark"
      onClick={handleToggleColorScheme}
    >
      {colorScheme === 'light' ? <IoMoon className="h-6 w-6" /> : <IoSunny className="h-6 w-6" />}
    </button>
  );
};
