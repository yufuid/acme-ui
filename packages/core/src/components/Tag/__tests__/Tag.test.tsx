import React from 'react';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tag, { classes } from '../Tag';
import { RefTestCaseType } from '../../../../tests/shared/refTest';

const testId = 'tag-test-id';

describe('rag', () => {
  mountTestSuite(<Tag />);

  describe('render a tag correctly', () => {
    test('render default tag', () => {
      const { getByTestId } = render(<Tag data-testid={testId}>default tag</Tag>);
      const tag = getByTestId(testId);
      expect(tag).not.toBeNull();
      expect(tag).toHaveClass(classes.root);
      expect(tag).toHaveTextContent('default tag');
    });
    test('render close tag', () => {
      const { getByTestId } = render(
        <Tag data-testid={testId} closable>
          close tag
        </Tag>,
      );
      const tag = getByTestId(testId);
      expect(tag).not.toBeNull();
      expect(tag).toHaveTextContent('close tag');
      const close = tag.querySelector(`.${classes.closeIcon}`);
      expect(close).not.toBeNull();
      if (close) {
        userEvent.click(close);
        expect(tag).toHaveClass(classes.visible);
      }
    });
  });

  refTestSuite('test ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLSpanElement>();

      render(<Tag ref={elementRef}>tag</Tag>);

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLSpanElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLSpanElement | null = null;
      const CheckboxRefCallback = (ref: HTMLSpanElement) => {
        elementRef = ref;
      };

      render(<Tag ref={CheckboxRefCallback}>tag</Tag>);

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLSpanElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLInputElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLInputElement>(null);

        return <Tag ref={elementRef}>tagRef using useRef</Tag>;
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLSpanElement));
      });
    },
  });
});
