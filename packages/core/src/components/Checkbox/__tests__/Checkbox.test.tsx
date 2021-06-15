import React from 'react';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox, { classes } from '../Checkbox';
import { RefTestCaseType } from '../../../../tests/shared/refTest';

const testId = 'checkbox-test-id';

describe('checkbox', () => {
  mountTestSuite(<Checkbox />);

  describe('render a checkbox correctly', () => {
    test('render default checkbox', () => {
      const { getByTestId } = render(<Checkbox data-testid={testId} />);
      const checkbox = getByTestId(testId);
      expect(checkbox).not.toBeNull();
      expect(checkbox).toHaveClass(classes.root);
      expect(checkbox).toContainHTML('input');
    });
    test('render disabled checkbox', () => {
      const { getByTestId } = render(<Checkbox data-testid={testId} disabled />);
      const checkbox = getByTestId(testId);
      expect(checkbox).not.toBeNull();
      expect(checkbox).toHaveClass(classes.disabled);
      expect(checkbox.querySelector('input')).toBeDisabled();
    });
    test('render indeterminate checkbox', () => {
      const { getByTestId } = render(<Checkbox data-testid={testId} indeterminate />);
      const checkbox = getByTestId(testId);
      expect(checkbox).not.toBeNull();
      expect(checkbox.querySelector(`.${classes.indeterminate}`)).not.toBeNull();
    });
  });

  describe('test Event correctly', () => {
    test('on default checkbox', () => {
      let target = null;
      let checked = false;
      const mockFn = jest.fn((e) => {
        target = e.target;
        checked = target.checked;
      });
      const { getByTestId } = render(<Checkbox data-testid={testId} onChange={mockFn} />);
      const checkbox = getByTestId(testId);
      userEvent.click(checkbox);
      expect(target).toEqual(expect.any(HTMLInputElement));
      expect(checked).toEqual(true);
      expect(checkbox.querySelector('input')).toBeChecked();
    });
    test('on disabled checkbox', () => {
      const mockFn = jest.fn(() => {});
      const { getByTestId } = render(<Checkbox data-testid={testId} disabled onChange={mockFn} />);
      const checkbox = getByTestId(testId);
      userEvent.click(checkbox);
      expect(checkbox.querySelector('input')).not.toHaveFocus();
      expect(checkbox.querySelector('input')).not.toBeChecked();
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
