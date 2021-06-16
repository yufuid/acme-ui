import React from 'react';

export interface DeleteSvgProps {
  className?: string;
}

const DeleteSvg = (props: DeleteSvgProps) => {
  const { className } = props;

  return (
    <svg fill="currentColor" width="8px" height="8px" viewBox="0 0 8 8" className={className}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-864.000000, -1551.000000)">
          <rect fill="none" x="552" y="1455" width="816" height="152" />
          <g transform="translate(814.000000, 1543.000000)">
            <rect fill="none" x="0" y="0" width="66" height="24" rx="12" />
            <polygon
              fill="currentColor"
              points="57.0710678 8.70710678 54.2426407 11.5355339 57.0710678 14.363961 56.363961 15.0710678 53.5355339 12.2426407 50.7071068 15.0710678 50 14.363961 52.8284271 11.5355339 50 8.70710678 50.7071068 8 53.5355339 10.8284271 56.363961 8"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default DeleteSvg;
