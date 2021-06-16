import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import userEvent from '@testing-library/user-event';
import Switch, { classes, SwitchSize } from '../Switch';
import { RefTestCaseType } from '../../../../tests/shared/refTest';

const testId = 'switch-test-id';

describe('✨️ Switch correctly', () => {
  mountTestSuite(<Switch />);

  test('render default switch', () => {
    const { getByTestId } = render(<Switch data-testid={testId} />);
    const acmeSwitch = getByTestId(testId);
    expect(acmeSwitch).toHaveClass(classes.root);
    expect(acmeSwitch).toHaveClass(classes.size(SwitchSize.DEFAULT));
  });
  test('render small switch', () => {
    const { getByTestId } = render(<Switch data-testid={testId} size={SwitchSize.SMALL} />);
    const acmeSwitch = getByTestId(testId);
    expect(acmeSwitch).toHaveClass(classes.root);
    expect(acmeSwitch).toHaveClass(classes.size(SwitchSize.SMALL));
  });
  test('render disabled switch', () => {
    const { getByTestId } = render(<Switch data-testid={testId} loading />);
    const acmeSwitch = getByTestId(testId);
    expect(acmeSwitch).toHaveClass(classes.disabled);
    expect(acmeSwitch.querySelector('input')).toBeDisabled();
  });
  test('render loading switch', () => {
    const { getByTestId } = render(<Switch data-testid={testId} loading />);
    const acmeSwitch = getByTestId(testId);
    expect(acmeSwitch).toHaveClass(classes.disabled);
    const input = acmeSwitch.getElementsByTagName('input')[0];
    const content = acmeSwitch.getElementsByClassName(classes.content)[0];
    expect(input).toBeDisabled();
    if (content) {
      const loading = content.getElementsByTagName('svg');
      expect(loading.length).toEqual(1);
    }
  });

  describe('test Event correctly', () => {
    test('on default checkbox', () => {
      let target = null;
      let checked = false;
      const mockFn = jest.fn((e) => {
        target = e.target;
        checked = target.checked;
      });
      const { getByTestId } = render(<Switch data-testid={testId} onChange={mockFn} />);
      const acmeSwitch = getByTestId(testId);
      userEvent.click(acmeSwitch);
      expect(target).toEqual(expect.any(HTMLInputElement));
      expect(checked).toEqual(true);
      expect(acmeSwitch.querySelector('input')).toBeChecked();
    });
  });

  refTestSuite('test ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLLabelElement>();
      const mockFn = jest.fn(() => {});

      render(<Switch ref={elementRef} onChange={mockFn} />);

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLLabelElement));

      if (elementRef.current) {
        userEvent.click(elementRef.current);
      }
      expect(mockFn).toBeCalledTimes(1);
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLLabelElement | null = null;
      const SwitchRefCallback = (ref: HTMLLabelElement) => {
        elementRef = ref;
      };

      render(<Switch ref={SwitchRefCallback} />);

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLLabelElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLLabelElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLLabelElement>(null);

        return <Switch ref={elementRef} />;
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLLabelElement));
      });
    },
  });
});
