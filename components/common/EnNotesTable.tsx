import { CommonObjectType } from '@/typings/global';
import { TableResp } from '@/lib/table';
import { isNonEmptyArray } from '@/lib/utils';
import React, {
  CSSProperties,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import SearchView, { SearchFormRef, SearchProps } from '@/components/common/SearchForm';
import Table from 'antd/lib/table';
import useSWR from 'swr';

/**
 * reference https://github.com/hsl947/react-antd-multi-tabs-admin
 * 1. 原来项目的代码使用了自定义的 RefType ，存在兼容性问题。我参考下面的文档把TS类型安全问题解决掉了
 * https://geek-docs.com/typescript/typescript-questions/516_typescript_declare_type_with_reactuseimperativehandle.html
 * 2. 用 swr 代替原作者自制的 useService 轮子。
 * useService 轮子 + apiFun 使用了 useState 的变量，会导致进入页面时不断发送请求的 bug 。改用 swr 后问题解决，原因未知。
 */

/* 改用 swr
const useServiceCallback = (
  service: (arg0?: any) => Promise<{}>
): CommonObjectType[] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState<unknown>(null);

  // 使用 useCallback，来判断 service 是否改变
  const callback = useCallback(
    (params: unknown) => {
      setLoading(true);
      setError(null);
      service(params)
        .then((res) => {
          setLoading(false);
          setResponse(res);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [service]
  );
  return [callback, { error, loading, response }];
};

const useService = (
  service: (arg0?: any) => Promise<{}>,
  params?: CommonObjectType
): object => {
  const [callback, { loading, error, response }]: any[] = useServiceCallback(service);
  useEffect(() => {
    callback(params);
    return () => {};
  }, [callback, params]);
  return { error, loading, response };
};
*/

export interface TableRef {
  getTableData: () => CommonObjectType[]
  resetField: (field?: string[]) => void
  resetForm: (page?: number) => void
  update: (page?: number) => void
}

/**
 * 封装列表、分页、多选、搜索组件
 * @param {React.ForwardedRef<TableRef>} ref 表格的实例，用于调用内部方法
 * @param {object[]} columns 表格列的配置
 * @param {function} apiFun 表格数据的请求方法
 * @param {SearchProps['config']} searchConfigList 搜索栏配置
 * @param {function} beforeSearch 搜索前的操作（如处理一些特殊数据，修改搜索参数）
 * @param {function} onFieldsChange 处理搜索栏表单联动事件
 * @param {object} extraProps 额外的搜索参数（不在搜索配置内的）
 * @param {function} onSelectRow 复选框操作回调
 * @param {string} rowKey 表格行的key
 * @param {function} sortConfig 自定义表格排序字段
 * @param {function} expandedRowRender 额外的展开行
 * @param {function} onExpand 点击展开图标时触发
 * @param {string} rowClassName 表格行的样式名
 * @param {boolean} small 表格和分页的展示大小
 * @param {string[]} paginationOptions 分页大小可选项
 * @param {CSSProperties} style 容器的行内样式
 */

interface TableProps {
  columns: object[]
  apiFun: (arg0: any) => Promise<TableResp<CommonObjectType>>
  searchConfigList?: SearchProps['config']
  extraProps?: object
  rowKey?: string
  rowClassName?: string
  small?: boolean
  showHeader?: boolean
  paginationOptions?: string[]
  beforeSearch?: (arg0?: any) => void
  onSelectRow?: (arg0?: string[], arg1?: string[]) => void
  onFieldsChange?: (arg0?: unknown, arg1?: unknown) => void
  sortConfig?: (arg0?: object) => any
  expandedRowRender?: () => ReactNode
  onExpand?: () => void
  style?: CSSProperties
}

const EnNotesTable = forwardRef<TableRef, TableProps>(
  (props, ref) => {
    /**
     * @forwardRef
     * 引用父组件的ref实例，成为子组件的一个参数
     * 可以引用父组件的ref绑定到子组件自身的节点上.
     */
    const searchForm = useRef<SearchFormRef>(null);
    const {
      columns,
      apiFun,
      searchConfigList,
      extraProps,
      rowKey,
      rowClassName,
      small,
      showHeader,
      paginationOptions: _paginationOptions,
      beforeSearch,
      onSelectRow,
      onFieldsChange,
      sortConfig,
      expandedRowRender,
      onExpand,
      style
    } = props;

    const tableContainerStyle = style || { padding: 16 };
    const paginationOptions = isNonEmptyArray(_paginationOptions) ? _paginationOptions : ['20', '40', '50', '100'];

    // 搜索参数,如果有特殊需要处理的参数，就处理
    const searchObj = !searchConfigList ? {} : searchConfigList.reduce<CommonObjectType>(
      (prev, next) =>
        Object.assign(prev, {
          [next.key]: next.fn ? next.fn(next.initialValue) : next.initialValue
        }),
      {}
    );

    // 初始参数
    const initParams = {
      ...searchObj,
      ...extraProps,
      pageNum: 1,
      pageSize: 20
    };

    // 多选框的选择值
    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
    // 列表所有的筛选参数（包括搜索、分页、排序等）
    const [tableParams, setTableParams] = useState(initParams);
    // 列表搜索参数
    const [searchParams, setSearchParams] = useState(searchObj);
    // 列表排序参数
    const [sortParams, setSortParams] = useState({});
    // 列表分页参数
    const [curPageNo, setCurPageNo] = useState(initParams.pageNum);
    const [curPageSize, setCurPageSize] = useState(initParams.pageSize);

    // const { loading = false, response }: CommonObjectType = useService(apiFun, tableParams);
    const { isLoading: loading, data: response } = useSWR([tableParams], ([tableParams]) => apiFun(tableParams));
    const { rows: tableData = [], total = -1 } = response || {};

    // 执行搜索操作
    const handleSearch = (val: object): void => {
      setSearchParams(val);
      setTableParams({ ...tableParams, ...val, pageNum: 1 });
    };

    // 重置列表部分状态
    const resetAction = (page?: number): void => {
      setSelectedKeys([]);
      const nextPage = page || curPageNo;
      const nextParams = page === 1 ? {} : { ...searchParams, ...sortParams };
      setCurPageNo(nextPage);
      setTableParams({
        ...initParams,
        ...nextParams,
        pageNum: nextPage,
        pageSize: curPageSize
      });
    };

    // 列表复选框选中变化
    const onSelectChange = (
      selectedRowKeys: any[],
      selectedRows: any[]
    ): void => {
      setSelectedKeys(selectedRowKeys);
      onSelectRow && onSelectRow(selectedRowKeys, selectedRows);
    };
    // 复选框配置
    const rowSelection = {
      onChange: onSelectChange,
      selectedRowKeys: selectedKeys
    };
    // 判断是否有复选框显示
    const showCheckbox = onSelectRow ? { rowSelection } : {};

    // 展开配置
    const expendConfig = {
      expandedRowRender,
      onExpand,
      rowClassName
    };
    // 判断是否有展开行
    const showExpend = expandedRowRender ? expendConfig : {};

    // 表格和分页的大小
    const tableSize = small ? 'small' : 'middle';
    const paginationSize = small ? 'small' : 'default';

    // 分页、筛选、排序变化时触发
    const onTableChange = (
      pagination: CommonObjectType,
      filters: CommonObjectType,
      sorter: object
    ): void => {
      // 如果有sort排序并且sort参数改变时，优先排序
      const sortObj = sortConfig ? sortConfig(sorter) : {};
      setSortParams(sortObj);

      const { current: pageNum, pageSize } = pagination;
      setCurPageNo(pageNum);
      setCurPageSize(pageSize);
      setTableParams({
        ...initParams,
        ...searchParams,
        ...sortObj,
        pageNum,
        pageSize
      });
    };

    /**
     * @useImperativeHandle
     * 第一个参数，接收一个通过forwardRef引用父组件的ref实例
     * 第二个参数一个回调函数，返回一个对象，对象里面存储需要暴露给父组件的属性或方法
     */
    useImperativeHandle(ref, () => ({
      // 获取当前列表数据
      getTableData(): CommonObjectType[] {
        return tableData;
      },
      // 仅重置搜索字段
      resetField(field?: string[]) {
        if (!searchForm.current) return;
        return field
          ? searchForm.current.resetFields([...field])
          : searchForm.current.resetFields();
      },
      // 更新列表，并重置搜索字段
      resetForm(page?: number) {
        if (searchForm.current) searchForm.current.resetFields();
        setSearchParams({});
        resetAction(page);
      },
      // 更新列表
      update(page?: number) {
        resetAction(page);
      }
    }));

    return (
      <div style={tableContainerStyle}>
        {
          searchConfigList && searchConfigList.length > 0 && (
            <SearchView
              ref={searchForm}
              config={searchConfigList}
              beforeSearch={beforeSearch}
              handleSearch={handleSearch}
              onFieldsChange={onFieldsChange}
            />
          )
        }
        <Table
          {...showCheckbox}
          {...showExpend}
          rowKey={rowKey}
          loading={loading}
          dataSource={tableData}
          columns={columns}
          onChange={onTableChange}
          size={tableSize}
          showHeader={showHeader}
          pagination={{
            current: tableParams.pageNum,
            pageSize: tableParams.pageSize,
            pageSizeOptions: paginationOptions,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (all) => `${all} items`,
            size: paginationSize,
            total
          }}
        />
      </div>
    );
  }
);

EnNotesTable.defaultProps = {
  beforeSearch: () => {},
  expandedRowRender: undefined,
  extraProps: {},
  onExpand: () => {},
  onFieldsChange: () => {},
  onSelectRow: undefined,
  paginationOptions: [],
  rowClassName: '',
  rowKey: 'id',
  searchConfigList: [],
  showHeader: true,
  small: false,
  sortConfig: () => {}
};

EnNotesTable.displayName = 'EnNotesTable';

export default EnNotesTable;
