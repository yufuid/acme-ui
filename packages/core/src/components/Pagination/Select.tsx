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
    const value = get(e, 'target.value');
    if (isFunction(onChange)) {
      onChange(e, value);
    }
  };
  return (
    <select value={value} defaultValue={defaultValue} className={className} onChange={valueChange}>
      {options.map((item: { label: string; value: any }) => {
        return <option value={item.value}>{item.label}</option>;
      })}
    </select>
  );
};

export default Select;
