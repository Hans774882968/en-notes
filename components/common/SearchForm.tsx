import { CommonObjectType } from '@/typings/global';
import Button from 'antd/lib/button';
import Col from 'antd/lib/col';
import Form from 'antd/lib/form';
import React, { ReactNode, forwardRef, useImperativeHandle } from 'react';
import Row from 'antd/lib/row';
import Space from 'antd/lib/space';

export interface SearchFormRef {
  resetFields: (field?: string[]) => void
}

export interface SearchProps {
  config: SearchFieldProps[]
  searchOnReset?: boolean
  handleSearch: (arg0: object) => void
  beforeSearch?: (arg0: object) => void
  onFieldsChange?: (arg0?: unknown, arg1?: unknown) => void
}

interface SearchFieldProps {
  key: string
  label: string
  rules?: object[]
  slot: ReactNode
  initialValue?: unknown
  fn?: (initialValue: unknown) => unknown
}

const SearchForm = forwardRef<SearchFormRef, SearchProps>(
  (props, ref) => {
    const { config, handleSearch, beforeSearch, onFieldsChange, searchOnReset: _searchOnReset } = props;
    const searchOnReset = _searchOnReset === undefined ? true : _searchOnReset;

    const [form] = Form.useForm();
    const getFields = () => {
      return config.map((item) => {
        return (
          <Col span={12} key={item.key}>
            <Form.Item
              labelCol={{ span: 6 }}
              name={item.key}
              label={item.label}
              rules={item.rules}
              style={{ marginBottom: '16px' }}
            >
              {item.slot}
            </Form.Item>
          </Col>
        );
      });
    };

    const emitSearch = (values: object): void => {
      // beforeSearch用于处理一些特殊情况
      beforeSearch && beforeSearch(values);
      handleSearch(values);
    };

    // 重置搜索字段
    const resetFields = (field?: string[]) => {
      return field ? form.resetFields([...field]) : form.resetFields();
    };

    const resetBtnHandler = () => {
      resetFields();
      if (searchOnReset) {
        form.submit();
      }
    };

    const initialValues = config.reduce(
      (prev: CommonObjectType, next: CommonObjectType) => ({
        ...prev,
        [next.key]: next.initialValue
      }),
      {}
    );

    useImperativeHandle(ref, () => ({
      resetFields
    }));

    return (
      <Form
        form={form}
        initialValues={initialValues}
        onFieldsChange={onFieldsChange}
        onFinish={emitSearch}
        style={{ marginBottom: 10 }}
      >
        <Row gutter={16}>
          {getFields()}
        </Row>
        <div style={{ textAlign: 'right' }}>
          <Space size="middle">
            <Button htmlType="submit" type="primary">
              Search
            </Button>
            <Button onClick={resetBtnHandler}>Reset</Button>
          </Space>
        </div>
      </Form>
    );
  }
);

SearchForm.displayName = 'SearchForm';

SearchForm.defaultProps = {
  beforeSearch: () => {},
  onFieldsChange: () => {}
};

export default SearchForm;
