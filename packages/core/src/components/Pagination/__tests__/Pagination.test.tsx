import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import get from 'lodash/get';
import { mountTestSuite } from 'tests/shared';
import Pagination, { classes } from '../Pagination';

describe('✨️ Pagination correctly', () => {
  mountTestSuite(<Pagination />);
  mountTestSuite(<Pagination type="mini" />);
  mountTestSuite(<Pagination type="simple" />);

  test('render total is 0', () => {
    const { container } = render(<Pagination />);
    const lis = container.querySelectorAll('li');
    expect(lis.length).toEqual(2);
    expect(lis[0].querySelector('div')).toHaveClass(classes.default.disabled);
    expect(lis[0].querySelector('svg')).toHaveClass(classes.default.arrowDisabled);
    expect(lis[1].querySelector('div')).toHaveClass(classes.default.disabled);
    expect(lis[1].querySelector('svg')).toHaveClass(classes.default.arrowDisabled);
    expect(container.firstChild).toHaveClass(classes.root);
  });
  test('render type = default and total = 50 and pageSize = 10 Pagination', () => {
    const { container } = render(<Pagination total={50} defaultPageSize={10} />);
    const lis = container.querySelectorAll('li');
    expect(container.firstChild).toHaveClass(classes.root);
    expect(lis.length).toEqual(7);
    expect(lis[0].querySelector('div')).toHaveClass(classes.default.disabled);
    expect(lis[1].querySelector('div')).toHaveClass(classes.default.active);
    expect(get(lis[1].querySelector('div'), 'textContent')).toEqual('1');
    expect(get(lis[2].querySelector('div'), 'textContent')).toEqual('2');
    expect(get(lis[3].querySelector('div'), 'textContent')).toEqual('3');
    expect(get(lis[4].querySelector('div'), 'textContent')).toEqual('4');
    expect(get(lis[5].querySelector('div'), 'textContent')).toEqual('5');
    expect(lis[lis.length - 1].querySelector('div')).not.toHaveClass(classes.default.disabled);
  });
  test('render more item ', () => {
    const { container } = render(<Pagination total={200} />);
    const moreButton = container.getElementsByClassName(classes.doubleArrow);
    const lis = container.querySelectorAll('li');
    expect(moreButton).not.toBeNull();
    expect(moreButton.length).toEqual(1);
    fireEvent.click(moreButton[0]);
    expect(lis[4].querySelector('div')).toHaveClass(classes.default.active);
    fireEvent.click(moreButton[0]);
    const moreBtn = container.getElementsByClassName(classes.doubleArrow);
    expect(moreBtn.length).toEqual(2);
    expect(get(lis[4].querySelector('div'), 'textContent')).toEqual('7');
    expect(lis[4].querySelector('div')).toHaveClass(classes.default.active);
  });
  test('next button click and item click', () => {
    const { container } = render(<Pagination total={50} defaultPageSize={10} />);
    const lis = container.querySelectorAll('li');
    const rightButton = lis[lis.length - 1].querySelector('div');
    if (rightButton) {
      rightButton.click();
    }
    expect(lis[2].querySelector('div')).toHaveClass(classes.default.active);
    const item4 = lis[4].querySelector('div');
    expect(item4).not.toBeNull();
    if (item4) {
      item4.click();
      expect(item4).toHaveClass(classes.default.active);
    }
  });
  test('render show pageSize Select', () => {
    const { container } = render(<Pagination total={50} showPageSize />);
    const selects = container.getElementsByTagName('select');
    expect(selects.length).toEqual(1);
    const select = selects[0];
    expect(select).not.toBeEmptyDOMElement();
    fireEvent.change(select, {
      target: { value: '50' },
    });
    const items = container.querySelectorAll('li');
    expect(items.length).toEqual(4);
  });
  test('render show total and totalPage is correct', () => {
    const { container } = render(<Pagination total={50} defaultPageSize={10} showTotal />);
    const lis = container.querySelectorAll('li');
    const totalDom = lis[0].querySelector('span');
    expect(totalDom).not.toBeEmptyDOMElement();
    expect(totalDom).toHaveClass(classes.text);
    expect(get(totalDom, 'textContent')).toEqual('共50条');
  });
  test('render show jump Input', () => {
    const { container } = render(<Pagination total={50} defaultPageSize={10} showJump />);
    const lis = container.querySelectorAll('li');
    const jumpDom = lis[lis.length - 1].querySelector('div');
    expect(jumpDom).toContainHTML('input');
    if (jumpDom) {
      const jumpInput = jumpDom.querySelector('input');
      if (jumpInput) {
        fireEvent.change(jumpInput, { target: { value: '4' } });
        fireEvent.blur(jumpInput);
        expect(jumpInput.value).toEqual('');
        expect(lis[4].querySelector('div')).toHaveClass(classes.default.active);
      }
    }
  });
  test('render mini Pagination', () => {
    const { container } = render(<Pagination total={50} type="mini" />);
    const items = container.querySelectorAll('li');
    expect(items.length).toEqual(7);
    const itemContent = items[1].querySelector('div');
    expect(itemContent).not.toBeNull();
    if (itemContent) {
      expect(itemContent).toHaveClass(classes.mini.item);
    }
  });
});
