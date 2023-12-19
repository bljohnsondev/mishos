import { IoEye, IoEyeOff } from 'react-icons/io5';

interface FollowButtonProps {
  onClick: () => void;
}

export const FollowButton = ({ onClick }: FollowButtonProps) => {
  return (
    <button
      className="flex items-center gap-3 px-2 py-1 rounded text-neutral-400 border border-neutral-600 hover:bg-neutral-800 transition duration-150"
      onClick={onClick}
    >
      <IoEye className="w-4 h-4" />
      <span className="text-xs">Follow</span>
    </button>
  );
};

export const UnfollowButton = ({ onClick }: FollowButtonProps) => {
  return (
    <button
      className="flex items-center gap-3 px-2 py-1 rounded text-neutral-400 border border-neutral-600 hover:bg-neutral-800 transition duration-150"
      onClick={onClick}
    >
      <IoEyeOff className="w-4 h-4" />
      <span className="text-xs">Unfollow</span>
    </button>
  );
};
