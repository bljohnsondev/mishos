interface EnvConfig {
  apiUrl: string;
  loginUrl: string;
  homeUrl: string;
}

export const config: EnvConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  loginUrl: import.meta.env.VITE_LOGIN_URL || '/login',
  homeUrl: import.meta.env.VITE_HOME_URL || '/',
};
