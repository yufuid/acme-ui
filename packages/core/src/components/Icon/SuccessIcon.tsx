import React from 'react';

export interface ISuccessSvgProps {
  className?: string;
}

export const SuccessSvg = (props: ISuccessSvgProps) => {
  const { className } = props;
  return (
    <svg className={className} width="10px" height="8px" viewBox="0 0 10 8" version="1.1">
      <g id="success" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="success-1" transform="translate(-1053.000000, -8034.000000)" fill="#4CAF51">
          <g id="编组-2备份-41" transform="translate(850.000000, 8020.000000)">
            <polygon
              id="success-1-1"
              transform="translate(207.585786, 16.757359) rotate(-315.000000) translate(-207.585786, -16.757359) "
              points="205 20.5147186 205 18.5147186 208.171573 18.5147186 208.171573 13 210.171573 13 210.171573 20.5147186"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
