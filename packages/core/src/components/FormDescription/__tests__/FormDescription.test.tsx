import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import FormDescription, { classes } from '../FormDescription';

const testId = 'test-form-description';

describe('FormDescription', () => {
  mountTestSuite(<FormDescription data-testid={testId}>description</FormDescription>);

  describe('render correctly with default props', () => {
    test('should render a default description', () => {
      const { getByTestId } = render(
        <FormDescription data-testid={testId} error>
          default description
        </FormDescription>,
      );
      const des = getByTestId(testId);
      expect(des).toHaveClass(classes.root);
    });
  });

  describe('render correctly with other props', () => {
    test('should render a error description', () => {
      const { getByTestId } = render(
        <FormDescription data-testid={testId} error>
          error description
        </FormDescription>,
      );
      const des = getByTestId(testId);
      expect(des).toHaveClass(classes.root);
      expect(des).toHaveClass(classes.error);
    });

    test('should render a disabled description', () => {
      const { getByTestId } = render(
        <FormDescription data-testid={testId} disabled>
          disabled description
        </FormDescription>,
      );
      const des = getByTestId(testId);
      expect(des).toHaveClass(classes.root);
      expect(des).toHaveClass(classes.disabled);
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLParagraphElement>();

      render(
        <FormDescription data-testid={testId} ref={elementRef}>
          form description ref using createRef
        </FormDescription>,
      );

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLParagraphElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLParagraphElement | null = null;
      const desRefCallback = (ref: HTMLParagraphElement) => {
        elementRef = ref;
      };

      render(
        <FormDescription data-testid={testId} ref={desRefCallback}>
          form description ref with using callback
        </FormDescription>,
      );

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLParagraphElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLParagraphElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLParagraphElement>(null);

        return (
          <FormDescription data-testid={testId} ref={elementRef}>
            form description ref using useRef
          </FormDescription>
        );
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLParagraphElement));
      });
    },
  });
});
