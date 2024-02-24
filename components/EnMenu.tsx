import { Key, ReactNode, useState } from 'react';
import { urls } from '@/lib/frontend/urls';
import { useRouter } from 'next/router';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import ExportOutlined from '@ant-design/icons/ExportOutlined';
import Menu, { MenuProps } from 'antd/lib/menu';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import TableOutlined from '@ant-design/icons/TableOutlined';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: ReactNode,
  key: Key,
  icon?: ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    children,
    icon,
    key,
    label,
    type
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Word', '1-1', <AppstoreOutlined />, [
    getItem('Edit', urls.word.edit, <EditOutlined />),
    getItem('List', urls.word.list, <TableOutlined />),
    getItem('Word Settings', urls.word.settings, <SettingOutlined />)
  ]),
  getItem('English Topic', urls.cnWord.edit, <EditOutlined />),
  getItem('Sentence', '1-3', <AppstoreOutlined />, [
    getItem('Create', urls.sentence.create, <EditOutlined />),
    getItem('Edit', urls.sentence.edit, <EditOutlined />)
  ]),
  getItem('Export', urls.export.index, <ExportOutlined />),
  getItem('Dashboard', urls.dashboard.index, <DashboardOutlined />)
];

function collectAllKeys(currentItems: MenuProps['items'], a: string[]) {
  currentItems?.forEach((currentItem) => {
    if (currentItem?.key) a.push(currentItem.key.toString());
    if (currentItem && 'children' in currentItem) collectAllKeys(currentItem.children, a);
  });
  return a;
}

const allKeys = collectAllKeys(items, []);

export default function EnMenu() {
  const router = useRouter();
  const defaultSelectedKeys = [router.pathname];
  const [openSubmenus, setOpenSubMenus] = useState<string[]>(allKeys);

  const onMenuClick: MenuProps['onClick'] = (e) => {
    const url = e.key;
    if (!url.startsWith('/')) return;
    router.push(url);
  };

  return (
    <Menu
      onClick={onMenuClick}
      style={{ width: 256 }}
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={openSubmenus}
      openKeys={openSubmenus}
      onOpenChange={setOpenSubMenus}
      mode="inline"
      items={items}
    />
  );
}
