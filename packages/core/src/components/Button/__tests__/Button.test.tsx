import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import Button, { classes } from '../Button';
import { ButtonMode, ButtonColor, ButtonSize } from '../types';

describe('Button', () => {
  mountTestSuite(<Button>按钮</Button>);

  // 渲染不同类型的按钮
  describe('render a button UI correctly', () => {
    test('should render a primary button', () => {
      const { getByRole } = render(<Button>primary button</Button>);
      const button = getByRole('button');
      expect(button).toHaveClass(classes.base);
      expect(button).toHaveClass(classes.appearance(ButtonMode.CONTAINED, ButtonColor.PRIMARY));
      expect(button).toHaveClass(classes.size(ButtonSize.DEFAULT));
    });

    test('should render a outlined danger button', () => {
      const mode = ButtonMode.OUTLINED;
      const color = ButtonColor.DANGER;
      const { getByRole } = render(
        <Button mode={mode} color={color}>
          outlined danger button
        </Button>,
      );
      const button = getByRole('button');
      expect(button).toHaveClass(classes.base);
      expect(button).toHaveClass(classes.appearance(mode, color));
    });

    test('should render a large button', () => {
      const size = ButtonSize.LARGE;
      const { getByRole } = render(<Button size={size}>outlined danger button</Button>);
      const button = getByRole('button');
      expect(button).toHaveClass(classes.size(size));
    });
  });

  // 是否disabled
  describe('render correctly with disabled props', () => {
    test('should render a disabled button', () => {
      const { getByRole } = render(<Button disabled>disabled button</Button>);
      const button = getByRole('button');
      expect(button).toBeDisabled();
    });

    test('should render a not disabled button', () => {
      const { getByRole } = render(<Button>not disabled button</Button>);
      const button = getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  // loading
  describe('render correctly with loading props', () => {
    test('should render a loading button', () => {
      const { getByRole } = render(<Button loading>loading button</Button>);
      const button = getByRole('button');
      expect(button).toHaveClass(classes.loading);
    });

    test('should render a not disabled button', () => {
      const { getByRole } = render(<Button>not loading button</Button>);
      const button = getByRole('button');
      expect(button).not.toHaveClass(classes.loading);
    });
  });

  // ghost
  describe('render correctly with ghost props', () => {
    test('should render a ghost button', () => {
      const { getByRole } = render(<Button ghost>ghost button</Button>);
      const button = getByRole('button');
      expect(button).toHaveClass(classes.ghost(ButtonMode.CONTAINED));
    });

    test('should render a not ghost button', () => {
      const { getByRole } = render(<Button>not ghost button</Button>);
      const button = getByRole('button');
      expect(button).not.toHaveClass(classes.ghost(ButtonMode.CONTAINED));
    });
  });

  // fullWidth
  describe('render correctly with fullWidth props', () => {
    test('should render a fullWidth button', () => {
      const { getByRole } = render(<Button fullWidth>fullWidth button</Button>);
      const button = getByRole('button');
      expect(button).toHaveClass(classes.full);
    });

    test('should render a not fullWidth button', () => {
      const { getByRole } = render(<Button>not fullWidth button</Button>);
      const button = getByRole('button');
      expect(button).not.toHaveClass(classes.full);
    });
  });

  // 添加另外的节点
  describe('render correctly with Icon props', () => {
    test('should render a startIcon button', () => {
      const { getByRole } = render(
        <Button fullWidth>
          <div id="start-icon">start</div>fullWidth button
        </Button>,
      );
      const button = getByRole('button');
      const endIcon = button.getElementsByTagName('div')[0];
      expect(endIcon).toBeInTheDocument();
    });

    test('should render a not endIcon button', () => {
      const { getByRole } = render(
        <Button>
          endIcon button<div id="end-icon">end</div>
        </Button>,
      );
      const button = getByRole('button');
      const endIcon = button.getElementsByTagName('div')[0];
      expect(endIcon).toBeInTheDocument();
    });
  });

  // 测试点击时事件
  describe('test click event', () => {
    const clickEvent = jest.fn();
    test('on default button', () => {
      let target = null;
      const mockFn = jest.fn((e) => {
        target = e.target;
      });
      const { getByRole } = render(<Button onClick={mockFn}>primary button</Button>);
      const button = getByRole('button');
      userEvent.click(button);

      expect(button).toHaveFocus();
      expect(mockFn).toBeCalledTimes(1);
      expect(target).toEqual(expect.any(HTMLButtonElement));
    });

    test('on disabled button', () => {
      const { getByRole } = render(
        <Button onClick={clickEvent} disabled>
          primary button
        </Button>,
      );
      const button = getByRole('button');
      userEvent.click(button);
      expect(button).not.toHaveFocus();
      expect(clickEvent).not.toBeCalled();
    });

    test('on loading button', () => {
      const { getByRole } = render(
        <Button onClick={clickEvent} loading>
          primary button
        </Button>,
      );
      const button = getByRole('button');
      userEvent.click(button);
      expect(button).not.toHaveFocus();
      expect(clickEvent).not.toBeCalled();
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLButtonElement>();
      const mockFn = jest.fn(() => {});

      render(
        <Button ref={elementRef} onClick={mockFn}>
          buttonRef using createRef
        </Button>,
      );

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLButtonElement));

      if (elementRef.current) {
        userEvent.click(elementRef.current);
      }
      expect(mockFn).toBeCalledTimes(1);
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLButtonElement | null = null;
      const buttonRefCallback = (ref: HTMLButtonElement) => {
        elementRef = ref;
      };

      render(<Button ref={buttonRefCallback}>buttonRef with using callback</Button>);

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLButtonElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLButtonElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLButtonElement>(null);

        return <Button ref={elementRef}>buttonRef using useRef</Button>;
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLButtonElement));
      });
    },
  });
});
