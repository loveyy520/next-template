import { FC } from 'react';

interface Props {
    direction?: 'left' | 'right' | 'up' | 'down'
}

export const OlArrowRound: FC<Props> = ({direction='left'}) => {
  const directions = {
    left: '',
    right: 'rotate-180',
    up: 'rotate-90',
    down: '-rotate-90'
  }
  return (
    <i className={`inline-block w-full h-full bg-cover bg-[url(/icons/left-arrow.svg)] transition-transform duration-500 ${directions[direction]}`} />
  );
};