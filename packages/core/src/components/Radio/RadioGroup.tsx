import React from 'react';
import { isFunction } from 'lodash-es';
import FormGroup, { FormGroupProps } from '../FormGroup';
import Radio from './Radio';
import RadioGroupContext from './RadioGroupContext';
import { uniteClassNames } from '../../utils/tools';
import { RadioSize } from './types';
import './style/RadioGroup.less';

type RadioSizeType = `${RadioSize}`;

export interface IRadioGroupProps {
  className?: string;
  children?: typeof Radio | typeof Radio[];
  value?: string | number;
  layout?: FormGroupProps['layout'];
  name?: string;
  size?: RadioSizeType;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const classNamePrefix = 'acme-radio-group';

export const classes = {
  root: classNamePrefix,
};

const RadioGroup: React.ForwardRefExoticComponent<
  IRadioGroupProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef((props: IRadioGroupProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { className, children, value, layout, name, size, onChange, ...otherProps } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFunction(onChange)) {
      onChange(e);
    }
  };

  return (
    <RadioGroupContext.Provider value={{ value, name, onChange: handleChange, size }}>
      <FormGroup
        className={uniteClassNames(classes.root, className)}
        ref={ref}
        layout={layout}
        {...otherProps}
      >
        {children}
      </FormGroup>
    </RadioGroupContext.Provider>
  );
});

RadioGroup.defaultProps = {
  className: '',
  layout: 'vertical',
};

export default RadioGroup;
