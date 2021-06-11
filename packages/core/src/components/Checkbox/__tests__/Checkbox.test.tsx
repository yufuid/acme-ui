import React from 'react';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox, { classes } from '../Checkbox';
import { RefTestCaseType } from '../../../../tests/shared/refTest';

const getCheckbox = (container: Element) => {
  const doms = container.getElementsByTagName('span');
  if (doms.length) {
    return doms[0];
  }
  return null;
};

describe('checkbox', () => {
  mountTestSuite(<Checkbox />);

  describe('render a checkbox correctly', () => {
    test('render default checkbox', () => {
      const { container } = render(<Checkbox />);
      const checkbox = getCheckbox(container);
      expect(checkbox).not.toBeNull();
      expect(checkbox).toHaveClass(classes.root);
      expect(checkbox).toContainHTML('input');
    });
    test('render disabled checkbox', () => {
      const { container } = render(<Checkbox disabled />);
      const checkbox = getCheckbox(container);
      expect(checkbox).not.toBeNull();
      if (checkbox) {
        expect(checkbox).toHaveClass(classes.disabled);
        const checkboxInput = checkbox.firstChild;
        expect(checkboxInput).toBeDisabled();
      }
    });
    test('render indeterminate checkbox', () => {
      const { container } = render(<Checkbox indeterminate />);
      const checkbox = getCheckbox(container);
      expect(checkbox).not.toBeNull();
      if (checkbox) {
        const checkboxInput = checkbox.firstChild;
        expect(checkboxInput).not.toBeDisabled();
        const indeterminateDom = checkbox.lastChild;
        expect(indeterminateDom).toHaveClass(classes.indeterminate);
      }
    });
  });

  describe('test Event correctly', () => {
    test('on default checkbox', () => {
      let target = null;
      let checked = false;
      const mockFn = jest.fn((isChecked, e) => {
        target = e.target;
        checked = isChecked;
      });
      const { container } = render(<Checkbox onChange={mockFn} />);
      const checkboxInput = container.getElementsByTagName('input')[0];
      userEvent.click(checkboxInput);
      expect(target).toEqual(expect.any(HTMLInputElement));
      expect(checked).toEqual(true);
      expect(checkboxInput).toHaveFocus();
      expect(checkboxInput).toBeChecked();
    });
    test('on disabled checkbox', () => {
      const mockFn = jest.fn(() => {});
      const { container } = render(<Checkbox disabled onChange={mockFn} />);
      fireEvent.click(container);
      const checkboxInput = container.getElementsByTagName('input')[0];
      expect(checkboxInput).not.toHaveFocus();
      expect(checkboxInput).not.toBeChecked();
      expect(mockFn).not.toBeCalled();
    });
  });

  refTestSuite('test ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLInputElement>();
      const mockFn = jest.fn(() => {});

      render(<Checkbox ref={elementRef} onChange={mockFn} />);

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLInputElement));

      if (elementRef.current) {
        userEvent.click(elementRef.current);
      }
      expect(mockFn).toBeCalledTimes(1);
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLInputElement | null = null;
      const CheckboxRefCallback = (ref: HTMLInputElement) => {
        elementRef = ref;
      };

      render(<Checkbox ref={CheckboxRefCallback} />);

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLInputElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLInputElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLInputElement>(null);

        return <Checkbox ref={elementRef}>buttonRef using useRef</Checkbox>;
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLInputElement));
      });
    },
  });
});
