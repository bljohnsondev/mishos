import { SideMenuItem } from './side-menu-item';

export const sideMenuItems: SideMenuItem[] = [
  {
    name: 'watchlist',
    tooltip: 'Watch List',
    iconLibrary: 'hi-outline',
    iconName: 'list-bullet',
    route: '/watchlist',
  },
  {
    name: 'shows',
    tooltip: 'Shows',
    iconLibrary: 'hi-outline',
    iconName: 'tv',
    route: '/shows',
  },
  /*
  {
    name: 'settings',
    tooltip: 'Settings',
    iconLibrary: 'hi-outline',
    iconName: 'cog',
    route: '/settings',
  },
  */
];
