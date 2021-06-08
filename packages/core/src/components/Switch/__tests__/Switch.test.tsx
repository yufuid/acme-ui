import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { mountTestSuite } from 'tests/shared';
import Switch, { classes, SwitchSize } from '../Switch';

describe('✨️ Switch correctly', () => {
  mountTestSuite(<Switch />);

  test('render default switch', () => {
    const { container } = render(<Switch />);
    expect(container.firstChild).toHaveClass(classes.root);
    expect(container.firstChild).toHaveClass(classes.size(SwitchSize.DEFAULT));
  });
  test('render small switch', () => {
    const { container } = render(<Switch size={SwitchSize.SMALL} />);
    expect(container.firstChild).toHaveClass(classes.root);
    expect(container.firstChild).toHaveClass(classes.size(SwitchSize.SMALL));
  });
  test('render disabled switch', () => {
    const { container } = render(<Switch loading />);
    expect(container.firstChild).toHaveClass(classes.disabled);
    const input = container.getElementsByTagName('input')[0];
    expect(input).toBeDisabled();
  });
  test('render loading switch', () => {
    const { container } = render(<Switch loading />);
    expect(container.firstChild).toHaveClass(classes.disabled);
    const input = container.getElementsByTagName('input')[0];
    const content = container.getElementsByClassName(classes.content)[0];
    expect(input).toBeDisabled();
    if (content) {
      const loading = content.getElementsByTagName('svg');
      expect(loading.length).toEqual(1);
    }
  });
  test('switch change correctly', () => {
    const { container } = render(<Switch loading />);
    const root = container.firstChild;
    expect(root).not.toBeNull();
    if (root) {
      const input = container.getElementsByTagName('input')[0];
      fireEvent.change(input, { target: { checked: true } });
      expect(input.checked).toEqual(true);
    }
  });
});
