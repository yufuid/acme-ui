import React from 'react';

export interface ISvgProps {
  className?: string;
  size?: number;
}

// 当前loading的svg是个渐变色，所以不好直接使用fill来填充色值，所以判断类型吧
export const PrimaryLoadingSvg = (props: ISvgProps) => {
  const { size, className } = props;
  const svgSize = size || 16;
  return (
    <svg
      className={className}
      width={svgSize}
      height={svgSize}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.96942 15.9999C7.97961 16 7.98981 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0V2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14V15.9999H7.96942Z"
        fill="url(#paint0_linear_primary)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16V14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2V0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
        fill="url(#paint1_linear_primary)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_primary"
          x1="8"
          y1="16"
          x2="8"
          y2="7"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9D9DF8" />
          <stop offset="1" stopColor="#3939FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_primary"
          x1="8"
          y1="0"
          x2="8"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3A3AFF" />
          <stop offset="1" stopColor="#A8A8F7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const WhiteLoadingSvg = (props: ISvgProps) => {
  const { size, className } = props;
  const svgSize = size || 16;
  return (
    <svg
      className={className}
      width={svgSize}
      height={svgSize}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.96973 15.9999C7.97992 16 7.99012 16 8.00031 16C12.4186 16 16.0003 12.4183 16.0003 8C16.0003 3.58172 12.4186 0 8.00031 0V2C11.314 2 14.0003 4.68629 14.0003 8C14.0003 11.3137 11.314 14 8.00031 14V15.9999H7.96973Z"
          fill="url(#paint0_linear)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 16V14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2V0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
          fill="url(#paint1_linear)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="8.00031"
          y1="16"
          x2="8.00031"
          y2="7"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="8"
          y1="0"
          x2="8"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <clipPath id="clip0">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
