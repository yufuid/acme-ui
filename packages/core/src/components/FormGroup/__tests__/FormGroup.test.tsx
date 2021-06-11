import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import FormGroup, { classes, FormGroupLayout } from '../FormGroup';

const testId = 'test-form-group';

describe('FormLabel', () => {
  mountTestSuite(<FormGroup data-testid={testId}>label</FormGroup>);

  describe('render a group placement correctly', () => {
    test('should render a VERTICAL group', () => {
      const { getByTestId } = render(<FormGroup data-testid={testId}>default group</FormGroup>);
      const group = getByTestId(testId);
      expect(group).toHaveClass(classes.root);
      expect(group).toHaveClass(classes.layout(FormGroupLayout.VERTICAL));
    });

    test('should render a HORIZONTAL group', () => {
      const { getByTestId } = render(
        <FormGroup data-testid={testId} layout={FormGroupLayout.HORIZONTAL}>
          HORIZONTAL group
        </FormGroup>,
      );

      const group = getByTestId(testId);
      expect(group).toHaveClass(classes.root);
      expect(group).toHaveClass(classes.layout(FormGroupLayout.HORIZONTAL));
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLDivElement>();

      render(
        <FormGroup data-testid={testId} ref={elementRef}>
          form group ref using createRef
        </FormGroup>,
      );

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLDivElement | null = null;
      const labelRefCallback = (ref: HTMLDivElement) => {
        elementRef = ref;
      };

      render(
        <FormGroup data-testid={testId} ref={labelRefCallback}>
          form group ref with using callback
        </FormGroup>,
      );

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLDivElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLDivElement>(null);

        return (
          <FormGroup data-testid={testId} ref={elementRef}>
            form group ref using useRef
          </FormGroup>
        );
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLDivElement));
      });
    },
  });
});
