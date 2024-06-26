import { logout } from '@/lib/auth';

import type { SideMenuItem } from './side-menu-item';

export const sideMenuItems: SideMenuItem[] = [
  {
    name: 'watchlist',
    tooltip: 'Watch List',
    iconLibrary: 'hi-outline',
    iconName: 'check-badge',
    route: '/watchlist',
  },
  {
    name: 'upcoming',
    tooltip: 'Upcoming',
    iconLibrary: 'hi-outline',
    iconName: 'calendar-days',
    route: '/upcoming',
  },
  {
    name: 'shows',
    tooltip: 'Shows',
    iconLibrary: 'hi-outline',
    iconName: 'tv',
    route: '/shows',
  },
  {
    name: 'divider',
  },
  {
    name: 'settings',
    tooltip: 'Settings',
    iconLibrary: 'hi-outline',
    iconName: 'cog-6-tooth',
    route: '/settings',
  },
  {
    name: 'logout',
    tooltip: 'Logout',
    iconLibrary: 'local',
    iconName: 'logout',
    action: () => {
      logout();
    },
  },
];
