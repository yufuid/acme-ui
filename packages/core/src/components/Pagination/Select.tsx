import { get, isFunction } from 'lodash-es';
import React from 'react';

export interface SelectProps {
  className?: string;
  options: { label: string; value: any }[];
  defaultValue?: any;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>, value: any) => void;
}

const Select: React.FC<SelectProps> = (props: SelectProps) => {
  const { className, options, onChange, defaultValue, value } = props;
  const valueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = get(e, 'target.value');
    if (isFunction(onChange)) {
      onChange(e, val);
    }
  };
  return (
    <select value={value} defaultValue={defaultValue} className={className} onChange={valueChange}>
      {options.map((item: { label: string; value: any }, index: number) => {
        const key = `acme-select-${index}`;
        return (
          <option key={key} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
