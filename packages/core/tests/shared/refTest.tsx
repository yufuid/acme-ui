import React from 'react';
import _ from 'lodash';

export enum RefTestCaseType {
  createRef = 'createRef',
  callback = 'callback',
  useRef = 'useRef',
}

export type RefTestCaseCallbacks = Record<RefTestCaseType, jest.ProvidesCallback>;

export type RefTestCaseTimeout = Partial<Record<RefTestCaseType, number>>;

function refTestSuite(
  name: string,
  callbacks: RefTestCaseCallbacks,
  timeout?: RefTestCaseTimeout,
): void {
  describe(name, () => {
    if (typeof React.createRef !== 'undefined') {
      test(
        'matches ref with using createRef',
        _.get(callbacks, RefTestCaseType.createRef),
        _.get(timeout, RefTestCaseType.createRef),
      );
    }

    test(
      'matches ref with using callback',
      _.get(callbacks, RefTestCaseType.callback),
      _.get(timeout, RefTestCaseType.callback),
    );

    if (typeof React.useRef !== 'undefined') {
      test(
        'matches ref with using useRef',
        _.get(callbacks, RefTestCaseType.useRef),
        _.get(timeout, RefTestCaseType.useRef),
      );
    }
  });
}

export default refTestSuite;
