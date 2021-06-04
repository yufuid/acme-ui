import React from 'react';

export interface DoubleArrowProps {
  className?: string;
}

const DoubleArrow: React.FC<DoubleArrowProps> = (props: DoubleArrowProps) => {
  const { className } = props;
  return (
    <svg width="9px" height="8px" viewBox="0 0 9 8" fill="currentColor" className={className}>
      <g stroke="none" strokeWidth="1" fillRule="evenodd">
        <g transform="translate(-338.000000, -455.000000)">
          <path
            d="M341.535534,455 L342.242641,455.707107 L339.414214,458.535534 L342.242641,461.363961 L341.535534,462.071068 L338,458.535534 L341.535534,455 Z M345.535534,455 L346.242641,455.707107 L343.414214,458.535534 L346.242641,461.363961 L345.535534,462.071068 L342,458.535534 L345.535534,455 Z"
            transform="translate(342.121320, 458.535534) scale(-1, 1) translate(-342.121320, -458.535534) "
          />
        </g>
      </g>
    </svg>
  );
};

export default DoubleArrow;
