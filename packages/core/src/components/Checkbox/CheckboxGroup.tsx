import React, { ForwardedRef, useEffect } from 'react';
import indexOf from 'lodash/indexOf';
import isFunction from 'lodash/isFunction';
import FormGroup from '../FormGroup';
import Checkbox from './Checkbox';
import { FormGroupProps } from '../FormGroup/FormGroup';

export interface CheckboxGroupProps {
  className?: string;
  children?: typeof Checkbox | typeof Checkbox[];
  /**
   * 初次选中的值
   */
  defaultValues?: string[];
  /**
   * 选中的值
   */
  values?: string[];
  /**
   * values 发生改变
   * @param values
   */
  onChange?: (values: string[]) => void;
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
  values: string[];
  name?: string;
  disabled: boolean | undefined;
  onChange: (value: string) => void;
}

export const GroupContext = React.createContext<CheckboxGroupContext | null>(null);

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (props: CheckboxGroupProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { className, name, children, disabled, onChange, values, defaultValues, ...otherProps } =
      props;
    const [currValues, setCurrValues] = React.useState(defaultValues || []);

    useEffect(() => {
      if (values) setCurrValues(values);
    }, [values]);

    const handleChange = (value: string) => {
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
        <GroupContext.Provider value={context}>{children}</GroupContext.Provider>
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
