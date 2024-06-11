import { Key, ReactNode, useState } from 'react';
import { MenuItemData, collectAllKeys, getFilteredItems } from '@/lib/frontend/enMenuHelper';
import { urls } from '@/lib/frontend/urls';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import ExportOutlined from '@ant-design/icons/ExportOutlined';
import Menu, { MenuProps } from 'antd/lib/menu';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import TableOutlined from '@ant-design/icons/TableOutlined';

function getItem(
  label: ReactNode,
  key: Key,
  requireAuthorized: boolean,
  icon?: ReactNode,
  children?: MenuItemData[],
  type?: 'group'
): MenuItemData {
  return {
    children,
    icon,
    key,
    label,
    requireAuthorized,
    type
  } as MenuItemData;
}

const items: MenuItemData[] = [
  getItem('Word', '1-1', false, <AppstoreOutlined />, [
    getItem('Create & Edit', urls.word.edit, true, <EditOutlined />),
    getItem('List', urls.word.list, false, <TableOutlined />),
    getItem('Word Settings', urls.word.settings, true, <SettingOutlined />)
  ]),
  getItem('English Topic', '1-2', false, <AppstoreOutlined />, [
    getItem('Create & Edit', urls.cnWord.edit, true, <EditOutlined />),
    getItem('List', urls.cnWord.list, false, <TableOutlined />)
  ]),
  getItem('Sentence', '1-3', false, <AppstoreOutlined />, [
    getItem('Create', urls.sentence.create, true, <EditOutlined />),
    getItem('Edit', urls.sentence.edit, true, <EditOutlined />),
    getItem('List', urls.sentence.list, false, <TableOutlined />)
  ]),
  getItem('Export', urls.export.index, false, <ExportOutlined />),
  getItem('Dashboard', urls.dashboard.index, false, <DashboardOutlined />)
];

export default function EnMenu() {
  const router = useRouter();
  const defaultSelectedKeys = [router.pathname];

  const { data: session } = useSession();
  const filteredItems = getFilteredItems(items, session);
  const allKeys = collectAllKeys(filteredItems, []);

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
      items={filteredItems}
    />
  );
}
