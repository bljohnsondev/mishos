import { useAppStore } from '@/stores';

export const LoadingOverlay = () => {
  const { loading } = useAppStore();
  return loading ? (
    <div className="z-50 fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-20 opacity-100 flex items-center justify-center"></div>
  ) : null;
};
