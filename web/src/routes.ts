import './components/not-found-page';
import './features/auth/login-page';
import './features/search/search-results-page';
import './features/shows/shows-page';
import './features/shows/show-view-page';
import './features/shows/show-preview-page';
import './features/upnext/upnext-page';
import './features/watchlist/watchlist-page';

import { authGuard } from '@/features/auth/auth-guard';

export const routes = [
  { path: '/', redirect: '/watchlist' },
  { path: '/login', component: 'login-page' },
  { path: '/shows', component: 'shows-page', action: authGuard },
  { path: '/show/search', component: 'search-results-page', action: authGuard },
  { path: '/show/view/:id', component: 'show-view-page', action: authGuard },
  { path: '/show/preview/:id', component: 'show-preview-page', action: authGuard },
  { path: '/upnext', component: 'upnext-page', action: authGuard },
  { path: '/watchlist', component: 'watchlist-page', action: authGuard },
  { path: '(.*)', component: 'not-found-page' },
];
