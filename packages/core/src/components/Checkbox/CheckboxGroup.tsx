import React, { ForwardedRef, useEffect } from 'react';
import indexOf from 'lodash/indexOf';
import isFunction from 'lodash/isFunction';
import FormGroup from '../FormGroup';
import Checkbox, { CheckboxProps } from './Checkbox';
import { FormGroupProps } from '../FormGroup/FormGroup';

type TValue = Required<CheckboxProps>['value'];

export interface CheckboxGroupProps<T = TValue> {
  className?: string;
  children?: typeof Checkbox | typeof Checkbox[];
  /**
   * 初次选中的值
   */
  defaultValues?: T[];
  /**
   * 选中的值
   */
  values?: T[];
  /**
   * values 发生改变
   * @param values
   */
  onChange?: (values: T[]) => void;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * input name
   */
  name?: string;
  /**
   * 垂直/水平布局
   */
  layout?: FormGroupProps['layout'];
}

export interface CheckboxGroupContext {
  values: TValue[];
  name?: string;
  disabled: boolean | undefined;
  onChange: (value: string) => void;
}

export const CheckGroupContext = React.createContext<CheckboxGroupContext | null>(null);

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (props: CheckboxGroupProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { className, name, children, disabled, onChange, values, defaultValues, ...otherProps } =
      props;
    const [currValues, setCurrValues] = React.useState(defaultValues || []);

    useEffect(() => {
      if (values) setCurrValues(values);
    }, [values]);

    const handleChange = (value: string | number) => {
      const intervalValues = [...currValues];
      const valueIndex = indexOf(currValues, value);
      if (valueIndex === -1) {
        intervalValues.push(value);
      } else {
        intervalValues.splice(valueIndex, 1);
      }
      if (!('values' in props)) {
        setCurrValues(intervalValues);
      }
      if (isFunction(onChange)) {
        onChange(intervalValues);
      }
    };

    const context = {
      values: currValues || [],
      name,
      disabled,
      onChange: handleChange,
    };

    return (
      <FormGroup ref={ref} className={className} {...otherProps}>
        <CheckGroupContext.Provider value={context}>{children}</CheckGroupContext.Provider>
      </FormGroup>
    );
  },
);

CheckboxGroup.defaultProps = {
  defaultValues: [],
  disabled: false,
  name: '',
};

export default CheckboxGroup;
