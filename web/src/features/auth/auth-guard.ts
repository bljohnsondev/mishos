import { Commands, Context } from '@vaadin/router';

import { AuthService } from './auth-service';

export const authGuard = async (context: Context, commands: Commands) => {
  const isAuthenticated = await new AuthService().isAuthorized();

  if (!isAuthenticated) {
    console.warn('User not authorized', context.pathname);
    return commands.redirect('/login');
  }

  return undefined;
};

export const onboardingGuard = async (context: Context, commands: Commands) => {
  const isOnboardReady = await new AuthService().isOnboardReady();

  if (!isOnboardReady) {
    console.warn('Onboarding is not available', context.pathname);
    return commands.redirect('/login');
  }

  return undefined;
};
