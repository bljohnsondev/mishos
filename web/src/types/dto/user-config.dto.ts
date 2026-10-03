export interface UserConfigDto {
  id?: string;
  notifierTimezone?: string;
  notifierType?: string;
  notifierUrl?: string;
  theme?: string;
  hideSpoilers?: boolean;
  passwordCurrent?: string;
  passwordNew1?: string;
  passwordNew2?: string;
}
