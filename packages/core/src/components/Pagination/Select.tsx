import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import React from 'react';

type SelectValue = React.SelectHTMLAttributes<HTMLSelectElement>['value'];

export interface SelectProps<T extends SelectValue> {
  className?: string;
  options: { label: string; value: T }[];
  defaultValue?: T;
  value?: T;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>, value: T) => void;
}

const Select = <P extends SelectValue>(
  props: React.PropsWithChildren<SelectProps<P>>,
): React.ReactElement | null => {
  const { className, options, onChange, defaultValue, value } = props;
  const valueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = get(e, 'target.value');
    if (isFunction(onChange)) {
      onChange(e, val);
    }
  };
  return (
    <select value={value} defaultValue={defaultValue} className={className} onChange={valueChange}>
      {options.map((item: { label: string; value: SelectValue }, index: number) => {
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
