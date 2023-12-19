import * as React from 'react';

import { ShowDto } from '@/types';

const ShowCardContext = React.createContext({});

interface ShowCardContextProps {
  show: ShowDto;
}

interface ShowCardProps {
  show: ShowDto;
  children?: React.ReactNode;
}

export const ShowCard = ({ show, children }: ShowCardProps) => {
  const value: ShowCardContextProps = React.useMemo(() => ({ show }), [show]);

  return (
    <ShowCardContext.Provider value={value}>
      <div className="relative">
        <img
          src={show.imageMedium ?? '/images/empty-medium.jpg'}
          alt={show.name}
          className="object-contain rounded-lg"
        />
        {children}
      </div>
    </ShowCardContext.Provider>
  );
};

const useShowCardContext = () => {
  const context = React.useContext(ShowCardContext);
  if (!context) throw new Error('OverlayContext should be wrapper for this component');
  return context as ShowCardContextProps;
};

interface ShowCardInsetProps {
  children: React.ReactNode;
}

export const ShowCardInset = ({ children }: ShowCardInsetProps) => {
  return <div className="absolute inset-0 flex flex-col">{children}</div>;
};

interface ShowCardOverlayProps {
  onSelect?: () => void;
  children: React.ReactNode;
}

export const ShowCardOverlay = ({ onSelect, children }: ShowCardOverlayProps) => {
  return (
    <div className="absolute inset-0 opacity-0 hover:opacity-100 p-2 hover:bg-gradient-to-b hover:from-black/60 hover:to-black/0 transition duration-300 rounded-lg">
      <ShowCardContent onClick={onSelect}>{children}</ShowCardContent>
    </div>
  );
};

interface OverlayButtonProps {
  onClick: (show: ShowDto) => void;
  children: React.ReactNode;
}

export const OverlayButton = ({ onClick, children }: OverlayButtonProps) => {
  const { show } = useShowCardContext();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation();
    onClick(show);
  };

  return (
    <button
      className="p-2 w-full rounded bg-amber-500 hover:bg-amber-400 text-neutral-800 transition duration-150 flex items-center justify-center gap-2"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

interface ShowCardContentProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const ShowCardContent = ({ onClick, children }: ShowCardContentProps) => {
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = event => {
    event.preventDefault();
    if (onClick) onClick();
  };

  const classNames = 'z-0 flex flex-col items-start justify-end relative h-full w-full';

  return onClick ? (
    <a className={classNames} href="#" onClick={handleClick}>
      {children}
    </a>
  ) : (
    <div className={classNames}>{children}</div>
  );
};
