import React from 'react';

export interface ArrowProps {
  className?: string;
}

const Arrow: React.FC<ArrowProps> = (props: ArrowProps) => {
  const { className } = props;
  return (
    <svg width="7px" height="10px" viewBox="0 0 7 10" fill="currentColor" className={className}>
      <g stroke="none" strokeWidth="1">
        <g id="hover" transform="translate(-417.000000, -454.000000)">
          <polygon
            transform="translate(419.292893, 458.656854) rotate(-45.000000) translate(-419.292893, -458.656854) "
            points="422.585786 461.949747 416 461.949747 416 459.949747 420.585786 459.949747 420.585786 455.363961 422.585786 455.363961"
          />
        </g>
      </g>
    </svg>
  );
};

export default Arrow;
