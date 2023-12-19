import dayjs from 'dayjs';

export const formatDate = (date?: Date) => {
  return date ? dayjs(date).format('MM-DD-YYYY') : null;
};

export const formatDateTime = (date?: Date) => {
  return date ? dayjs(date).format('MM-DD-YYYY HH:mm') : null;
};
