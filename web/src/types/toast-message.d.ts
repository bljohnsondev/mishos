export type ToastVariant = 'primary' | 'success' | 'neutral' | 'warning' | 'danger';

export interface ToastMessage {
  title?: string;
  message: string;
  variant?: ToastVariant;
}
