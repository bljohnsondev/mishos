export type ShowCardBadgeVariant = 'primary' | 'success' | 'neutral' | 'warning' | 'danger';

export interface ShowCardBadge {
  variant?: ShowCardBadgeVariant;
  label: string;
}
