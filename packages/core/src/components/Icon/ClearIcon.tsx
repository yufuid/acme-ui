import React from 'react';

export interface IClearIconProps {
  className?: string;
  onClick?: () => void;
}

export const ClearSvg = (props: IClearIconProps) => {
  const { className, onClick } = props;
  return (
    <svg
      className={className}
      onClick={onClick}
      width="16px"
      height="16px"
      viewBox="0 0 16 16"
      version="1.1"
    >
      <g id="clear" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="clear-1" transform="translate(-1608.000000, -1813.000000)">
          <g id="clear-1-1" transform="translate(1396.000000, 1803.000000)">
            <g id="clear-1-1-1" transform="translate(212.000000, 10.000000)">
              <circle id="clear-circle" fill="#999999" cx="8" cy="8" r="8" />
              <polygon
                id="clear-path"
                fill="#FFFFFF"
                transform="translate(8.000000, 8.000000) rotate(-315.000000) translate(-8.000000, -8.000000) "
                points="9 4 9 7 12 7 12 9 9 9 9 12 7 12 7 9 4 9 4 7 7 7 7 4"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
