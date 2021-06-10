import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import Radio, { classes } from '../Radio';

describe('Radio', () => {
  mountTestSuite(<Radio />);

  // 渲染不同类型的按钮
  describe('render a radio UI correctly', () => {
    test('should render a base radio', () => {
      const { getByRole } = render(<Radio />);
      const radio = getByRole('radio');
      expect(radio).toHaveClass(classes.root);
    });

    test('should render a disabled radio', () => {
      const { getByRole } = render(<Radio disabled />);
      const radio = getByRole('radio');
      expect(radio).toHaveClass(classes.disabled);
    });

    test('should render a inline radio', () => {
      const { getByRole } = render(<Radio inline />);
      const radio = getByRole('radio');
      expect(radio).toHaveClass(classes.inline);
      expect(radio).toHaveStyle('display: inline-flex;');
    });
  });

  // 是否disabled
  describe('render correctly with disabled props', () => {
    test('should render a disabled radio', () => {
      const { getByRole } = render(<Radio disabled />);
      const radio = getByRole('radio');
      expect(radio).toBeDisabled();
    });

    test('should render a not disabled radio', () => {
      const { getByRole } = render(<Radio />);
      const radio = getByRole('radio');
      expect(radio).not.toBeDisabled();
    });
  });

  // 测试点击时事件
  describe('test click event', () => {
    const clickEvent = jest.fn();
    test('on default radio', () => {
      let target = null;
      let checked = false;
      const mockFn = jest.fn((e) => {
        target = e.target;
        checked = e.target.checked;
      });
      const { getByRole } = render(<Radio onChange={mockFn} />);
      const radio = getByRole('radio');
      userEvent.click(radio);

      expect(radio).toHaveFocus();
      expect(mockFn).toBeCalledTimes(1);
      expect(target).toEqual(expect.any(HTMLInputElement));
      expect(checked).toEqual(true);
    });

    test('on disabled radio', () => {
      const { getByRole } = render(<Radio onChange={clickEvent} disabled />);
      const radio = getByRole('radio');
      userEvent.click(radio);
      expect(radio).not.toHaveFocus();
      expect(clickEvent).not.toBeCalled();
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLInputElement>();
      const mockFn = jest.fn(() => {});

      render(<Radio ref={elementRef} onChange={mockFn} />);

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLInputElement));

      if (elementRef.current) {
        userEvent.click(elementRef.current);
      }
      expect(mockFn).toBeCalledTimes(1);
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLInputElement | null = null;
      const radioRefCallback = (ref: HTMLInputElement) => {
        elementRef = ref;
      };

      render(<Radio ref={radioRefCallback} />);

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLInputElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLInputElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLInputElement>(null);

        return <Radio ref={elementRef} />;
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLInputElement));
      });
    },
  });
});
