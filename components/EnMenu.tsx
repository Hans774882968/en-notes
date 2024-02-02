import { Key, ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import ExportOutlined from '@ant-design/icons/ExportOutlined';
import Menu, { MenuProps } from 'antd/lib/menu';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

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
    getItem('Edit Word', '/word', <EditOutlined />),
    getItem('Word Settings', '2-2', <SettingOutlined />)
  ]),
  getItem('English Topic', '/cn-word', <EditOutlined />),
  getItem('Sentence', '1-3', <EditOutlined />),
  getItem('Export', '1-4', <ExportOutlined />),
  getItem('Dashboard', '1-5', <DashboardOutlined />)
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
