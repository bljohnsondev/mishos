import { IoList, IoTvOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export interface MainMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface MenuListProps {
  onSelect: (item: MainMenuItem) => void;
}

export const MenuList = ({ onSelect }: MenuListProps) => {
  const navigate = useNavigate();

  const menuItems: MainMenuItem[] = [
    { icon: <IoList className="w-4 h-4" />, label: 'Watch List', onClick: () => navigate('/watchlist') },
    { icon: <IoTvOutline className="w-4 h-4" />, label: 'Shows', onClick: () => navigate('/show/list') },
  ];

  return (
    <ul>
      {menuItems.map(item => (
        <li key={item.label}>
          <button
            onClick={() => onSelect(item)}
            className="w-full text-left px-3 py-4 md:py-2 focus:outline-none rounded-lg flex items-center gap-4 hover:bg-neutral-400/[0.5] dark:hover:bg-neutral-700 dark:hover:text-neutral-300 transition duration-150"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};
