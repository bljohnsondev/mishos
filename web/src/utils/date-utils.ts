import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = import.meta.env.VITE_TIMEZONE ?? 'UTC';

export const formatDate = (date?: Date, format?: string) => {
  return date
    ? dayjs(date)
        .tz(TIMEZONE)
        .format(format ?? 'MM-DD-YYYY')
    : null;
};

export const formatDateTime = (date?: Date) => {
  return date ? dayjs(date).tz(TIMEZONE).format('MM-DD-YYYY HH:mm') : null;
};

export const formatAirTime = (date?: Date) => {
  return date ? dayjs(date).tz(TIMEZONE).format('MM-DD-YYYY [·] h:mm a') : null;
};

export { TIMEZONE as timezone };
