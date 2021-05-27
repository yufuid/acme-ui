import React from 'react';

export interface ArrowProps {
  className?: string;
}

const Arrow: React.FC<ArrowProps> = (props: ArrowProps) => {
  const { className } = props;
  return (
    <svg width="7px" height="10px" viewBox="0 0 7 10">
      <polygon
        className={className}
        points="18.5857864 18.9497475 12 18.9497475 12 16.9497475 16.5857864 16.9497475 16.5857864 12.363961 18.5857864 12.363961"
      />
    </svg>
  );
};

export default Arrow;
