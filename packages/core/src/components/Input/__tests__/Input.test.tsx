import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import Input, { classes } from '../Input';

describe('Input', () => {
  mountTestSuite(<Input />);

  // 渲染不同类型的输入框
  describe('render a input type correctly', () => {
    // 正常状态
    test('render a base input', () => {
      const { getByTestId } = render(<Input />);
      const inputRoot = getByTestId('acme-input-root');
      expect(inputRoot).toHaveClass(classes.root);
    });
    // 禁用状态
    test('render a disabled input', () => {
      const { getByTestId } = render(<Input disabled data-testid="acme-input" />);
      const inputRoot = getByTestId('acme-input-root');
      const input = getByTestId('acme-input');
      expect(inputRoot).toHaveClass(classes.disabled);
      expect(input).toBeDisabled();
    });

    // 成功状态
    test('render a success status input', () => {
      const { getByTestId } = render(<Input success />);
      const inputRoot = getByTestId('acme-input-root');
      expect(inputRoot).toHaveClass(classes.success);
    });

    // 错误态
    test('render a error status input', () => {
      const { getByTestId } = render(<Input error />);
      const inputRoot = getByTestId('acme-input-root');
      expect(inputRoot).toHaveClass(classes.error);
    });

    // loading状态
    test('should render a startIcon button', () => {
      const { getByTestId } = render(<Input loading />);
      const inputRoot = getByTestId('acme-input-root');
      const endIcon = inputRoot.getElementsByClassName(classes.loadingIcon)[0];
      expect(endIcon).toBeInTheDocument();
    });

    // 与父元素同宽
    test('render a fullWidth input', () => {
      const { getByTestId } = render(<Input fullWidth />);
      const inputRoot = getByTestId('acme-input-root');
      expect(inputRoot).toHaveClass(classes.full);
    });
  });

  // 输入事件测试
  describe('', () => {
    test('on default button', async () => {
      const { getByTestId } = render(<Input data-testid="acme-input" />);
      const input = getByTestId('acme-input');
      userEvent.type(input, 'hello world');
      expect(input).toHaveValue('hello world');
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLInputElement>();
      const mockFn = jest.fn(() => {});

      render(<Input ref={elementRef} onFocus={mockFn} />);

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLInputElement));

      if (elementRef.current) {
        userEvent.click(elementRef.current);
      }
      expect(mockFn).toBeCalledTimes(1);
      expect(elementRef.current).toHaveFocus();
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLInputElement | null = null;
      const inputRefCallback = (ref: HTMLInputElement) => {
        elementRef = ref;
      };

      render(<Input ref={inputRefCallback} />);

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLInputElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLInputElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLInputElement>(null);

        return <Input ref={elementRef} />;
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLInputElement));
      });
    },
  });
});
