import { MenuProps } from 'antd/lib/menu';
import { Session } from 'next-auth';
import { loginAsTheGodOfTheGods } from '@/lib/backend/perm';

export type MenuItemData = Required<MenuProps>['items'][number] & {
  children?: MenuItemData[]
  requireAuthorized: boolean
};

export function getAuthorizedMenus(items: MenuItemData[]): MenuItemData[] {
  return items
    .filter(({ requireAuthorized }) => !requireAuthorized)
    .map(({ children, ...rest }) => {
      return {
        children: children ? getAuthorizedMenus(children) : children,
        ...rest
      };
    });
}

export function removeRequireAuthorizedAttr(items: MenuItemData[]): MenuProps['items'] {
  return items.map(({ requireAuthorized, children, ...rest }) => {
    return {
      children: children ? removeRequireAuthorizedAttr(children) : children,
      ...rest
    };
  });
}

export function getFilteredItems(items: MenuItemData[], session: Session | null): MenuProps['items'] {
  if (loginAsTheGodOfTheGods(session)) {
    return removeRequireAuthorizedAttr(items);
  }
  return removeRequireAuthorizedAttr(
    getAuthorizedMenus(items)
  );
}

export function collectAllKeys(currentItems: MenuProps['items'], a: string[]) {
  currentItems?.forEach((currentItem) => {
    if (currentItem?.key) a.push(currentItem.key.toString());
    if (currentItem && 'children' in currentItem) collectAllKeys(currentItem.children, a);
  });
  return a;
}
