import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import FormLabel, { classes, FormLabelPlacement } from '../FormLabel';
import Radio from '../../Radio';

const testId = 'test-form-label';

describe('FormLabel', () => {
  mountTestSuite(<FormLabel data-testid={testId}>label</FormLabel>);

  // 渲染不同位置的label
  describe('render a label placement correctly', () => {
    test('should render a right label', () => {
      const { getByTestId } = render(<FormLabel data-testid={testId}>default label</FormLabel>);
      const label = getByTestId(testId);
      expect(label).toHaveClass(classes.root);
      expect(label).toHaveClass(classes.placement(FormLabelPlacement.RIGHT));
    });

    test('should render a left label', () => {
      const { getByTestId } = render(
        <FormLabel data-testid={testId} labelPlacement={FormLabelPlacement.LEFT}>
          left label
        </FormLabel>,
      );
      const label = getByTestId(testId);
      expect(label).toHaveClass(classes.root);
      expect(label).toHaveClass(classes.placement(FormLabelPlacement.LEFT));
    });

    test('should render a top label', () => {
      const { getByTestId } = render(
        <FormLabel data-testid={testId} labelPlacement={FormLabelPlacement.TOP}>
          top label
        </FormLabel>,
      );
      const label = getByTestId(testId);
      expect(label).toHaveClass(classes.root);
      expect(label).toHaveClass(classes.placement(FormLabelPlacement.TOP));
    });

    test('should render a bottom label', () => {
      const { getByTestId } = render(
        <FormLabel data-testid={testId} labelPlacement={FormLabelPlacement.BOTTOM}>
          bottom label
        </FormLabel>,
      );
      const label = getByTestId(testId);
      expect(label).toHaveClass(classes.root);
      expect(label).toHaveClass(classes.placement(FormLabelPlacement.BOTTOM));
    });
  });

  describe('render correctly with required props', () => {
    test('should render a required label', () => {
      const { getByTestId, getByText } = render(
        <FormLabel data-testid={testId} required>
          required label
        </FormLabel>,
      );
      const label = getByTestId(testId);
      expect(label).toBeInTheDocument();
      const required = getByText('*');
      expect(required).toBeInTheDocument();
      expect(required).toHaveClass(classes.required);
    });
  });

  describe('render correctly with control props', () => {
    test('should render a label with control', () => {
      const { getByRole } = render(
        <FormLabel data-testid={testId} control={<Radio />}>
          label with control
        </FormLabel>,
      );
      const control = getByRole('radio');
      expect(control).toBeInTheDocument();
    });
  });

  describe('render correctly with error props', () => {
    test('should render a error label', () => {
      const { getByTestId } = render(
        <FormLabel data-testid={testId} error>
          error label
        </FormLabel>,
      );
      const label = getByTestId(testId);
      expect(label).toHaveClass(classes.error);
    });

    test('should render a error label with control', () => {
      const { getByTestId, getByRole } = render(
        <FormLabel data-testid={testId} error control={<Radio />}>
          error label with control
        </FormLabel>,
      );
      const label = getByTestId(testId);
      expect(label).toHaveClass(classes.error);
      const control = getByRole('radio');
      expect(control).toBeInTheDocument();
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLLabelElement>();

      render(
        <FormLabel data-testid={testId} ref={elementRef}>
          label ref using createRef
        </FormLabel>,
      );

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLLabelElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLLabelElement | null = null;
      const labelRefCallback = (ref: HTMLLabelElement) => {
        elementRef = ref;
      };

      render(
        <FormLabel data-testid={testId} ref={labelRefCallback}>
          label ref with using callback
        </FormLabel>,
      );

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLLabelElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLLabelElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLLabelElement>(null);

        return (
          <FormLabel data-testid={testId} ref={elementRef}>
            label ref using useRef
          </FormLabel>
        );
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLLabelElement));
      });
    },
  });
});
