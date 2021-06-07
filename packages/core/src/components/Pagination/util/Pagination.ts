export enum PageItemType {
  PAGE = 'page',
  LEFT_MORE = 'leftMore',
  RIGHT_MORE = 'rightMore',
}

export interface IPageItem {
  val: number | string;
  type: PageItemType;
}

export const getPages = (total: number, current: number, length: number): IPageItem[] => {
  const pages: IPageItem[] = [];
  if (total < length) {
    for (let i = 1; i <= total; i += 1) {
      pages.push({ val: i, type: PageItemType.PAGE });
    }
  } else if (current < length - 2) {
    for (let i = 1; i <= length - 2; i += 1) {
      pages.push({ val: i, type: PageItemType.PAGE });
    }
    pages.push({ val: '...', type: PageItemType.RIGHT_MORE });
    pages.push({ val: total, type: PageItemType.PAGE });
  } else if (current > total - (length - 3)) {
    pages.push({ val: 1, type: PageItemType.PAGE });
    pages.push({ val: '...', type: PageItemType.LEFT_MORE });
    for (let i = total - (length - 3); i <= total; i += 1) {
      pages.push({ val: i, type: PageItemType.PAGE });
    }
  } else {
    const interval = Math.floor((length - 4) / 2);
    pages.push({ val: 1, type: PageItemType.PAGE });
    pages.push({ val: '...', type: PageItemType.LEFT_MORE });
    for (let i = current - interval; i <= current + interval; i += 1) {
      pages.push({ val: i, type: PageItemType.PAGE });
    }
    pages.push({ val: '...', type: PageItemType.RIGHT_MORE });
    pages.push({ val: total, type: PageItemType.PAGE });
  }
  return pages;
};
