import Radio from './Radio';
import RadioGroup from './RadioGroup';
import RadioButton from './RadioButton';

export type { IRadioProps } from './Radio';
export type { IRadioButtonProps } from './RadioButton';
export type { IRadioGroupProps } from './RadioGroup';

Radio.Group = RadioGroup;
Radio.Button = RadioButton;

export default Radio;
