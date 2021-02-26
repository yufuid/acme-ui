import React from 'react';
import { render } from '@testing-library/react';

function mountTestSuite(element: React.ReactElement, options?: Parameters<typeof render>[1]): void {
  describe('✨ mount and unmount correctly', () => {
    test('component could be mounted and unmounted without errors', () => {
      const wrapper = render(element, options);

      expect(() => {
        wrapper.unmount();
      }).not.toThrow();
    });
  });
}

export default mountTestSuite;
